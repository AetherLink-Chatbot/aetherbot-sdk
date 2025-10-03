import type {
  PublicAvatarQueryResponse,
  PublicChatHistoryResponse,
  PublicChatMessage,
  WidgetMessage,
} from '../types';

export type TranscriptMessageState = 'persisted' | 'pending';

export interface TranscriptMessage extends WidgetMessage {
  state: TranscriptMessageState;
  contactForm?: {
    prompt: string;
    chatId?: string;
    submitting?: boolean;
    submitted?: boolean;
    dismissed?: boolean;
    error?: string | null;
  };
}

export interface ChatState {
  messages: TranscriptMessage[];
  liveAnswer: string;
  reasoning: string[];
  streaming: boolean;
  ephemeralUser: TranscriptMessage | null;
  showEphemeralAssistant: boolean;
}

export const initialChatState: ChatState = {
  messages: [],
  liveAnswer: '',
  reasoning: [],
  streaming: false,
  ephemeralUser: null,
  showEphemeralAssistant: false,
};

const toTranscriptMessage = (message: PublicChatMessage): TranscriptMessage => {
  const meta = message.message_metadata || {};
  const contactPrompt = (meta as any).contact_form_prompt;
  const hasContactFlag = Boolean((meta as any).contact_form || (meta as any).contactForm || contactPrompt);
  const contactForm = hasContactFlag
    ? {
        prompt: typeof contactPrompt === 'string' && contactPrompt.trim().length
          ? (contactPrompt as string)
          : message.content,
      }
    : undefined;
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    createdAt: message.created_at,
    reasoning: message.message_metadata?.reasoning ?? undefined,
    state: 'persisted',
    ...(contactForm ? { contactForm } : {}),
  };
};

const messageKey = (message: WidgetMessage): string => `${message.role}|${message.content.trim()}`;

const mergeHistoryWithPending = (
  history: PublicChatHistoryResponse,
  existing: TranscriptMessage[],
): TranscriptMessage[] => {
  const persisted = history.messages.map(toTranscriptMessage);
  const persistedKeys = new Set(persisted.map(messageKey));
  // Attach inline contact form from pending to the matching persisted message
  for (const msg of existing) {
    if (!msg.contactForm) continue;
    const key = messageKey(msg);
    const idx = persisted.findIndex((m) => messageKey(m) === key);
    if (idx !== -1) {
      persisted[idx] = { ...persisted[idx], contactForm: { ...msg.contactForm } };
    }
  }
  const pending = existing.filter(
    (msg) => msg.state !== 'persisted' && !persistedKeys.has(messageKey(msg)),
  );
  return [...persisted, ...pending];
};

const createAssistantPending = (content: string, reasoning: string[]): TranscriptMessage => ({
  id: `pending-assistant-${Date.now()}`,
  role: 'ASSISTANT',
  content,
  createdAt: new Date().toISOString(),
  reasoning: reasoning.length ? [...reasoning] : undefined,
  state: 'pending',
});

const clonePending = (message: TranscriptMessage): TranscriptMessage => ({
  ...message,
  id: message.id ?? `pending-${Date.now()}`,
  createdAt: message.createdAt ?? new Date().toISOString(),
  state: 'pending',
});

const answerMatchesHistory = (history: PublicChatHistoryResponse, answer?: string): boolean => {
  if (!answer) return false;
  const trimmed = answer.trim();
  return history.messages.some(
    (msg) => msg.role === 'ASSISTANT' && msg.content.trim() === trimmed,
  );
};

export type ChatAction =
  | { type: 'hydrate'; history: PublicChatHistoryResponse }
  | { type: 'commit-transient' }
  | { type: 'set-ephemeral-user'; message: TranscriptMessage | null }
  | { type: 'stream-start' }
  | { type: 'stream-status'; value: string }
  | { type: 'stream-reasoning'; value: string }
  | { type: 'stream-delta'; token: string }
  | { type: 'stream-final'; payload: PublicAvatarQueryResponse }
  | { type: 'reconcile'; history: PublicChatHistoryResponse; expectedAnswer?: string }
  | { type: 'stream-error' }
  | { type: 'insert-contact-form'; prompt: string; messageId?: string; chatId?: string }
  | { type: 'contact-form-state'; messageId: string; patch: Partial<NonNullable<TranscriptMessage['contactForm']>> }
  | { type: 'reset' };

export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'hydrate': {
      return {
        ...initialChatState,
        messages: mergeHistoryWithPending(action.history, []),
      };
    }
    case 'commit-transient': {
      const pending: TranscriptMessage[] = [...state.messages];
      if (state.showEphemeralAssistant && state.liveAnswer.trim()) {
        pending.push(createAssistantPending(state.liveAnswer, state.reasoning));
      }
      if (state.ephemeralUser) {
        pending.push(clonePending(state.ephemeralUser));
      }
      return {
        ...state,
        messages: pending,
        liveAnswer: '',
        reasoning: [],
        ephemeralUser: null,
        showEphemeralAssistant: false,
      };
    }
    case 'set-ephemeral-user': {
      return {
        ...state,
        ephemeralUser: action.message,
      };
    }
    case 'stream-start': {
      return {
        ...state,
        streaming: true,
        liveAnswer: '',
        reasoning: [],
        showEphemeralAssistant: true,
      };
    }
    case 'stream-status':
    case 'stream-reasoning': {
      return {
        ...state,
        reasoning: [...state.reasoning, action.value],
      };
    }
    case 'stream-delta': {
      return {
        ...state,
        liveAnswer: state.liveAnswer + action.token,
      };
    }
    case 'stream-final': {
      return {
        ...state,
        streaming: false,
        liveAnswer: action.payload.answer,
        showEphemeralAssistant: true,
      };
    }
    case 'reconcile': {
      const merged = mergeHistoryWithPending(action.history, state.messages);
      const persistedHasAnswer = answerMatchesHistory(action.history, action.expectedAnswer ?? state.liveAnswer);
      return {
        ...state,
        messages: merged,
        liveAnswer: persistedHasAnswer ? '' : state.liveAnswer,
        reasoning: persistedHasAnswer ? [] : state.reasoning,
        streaming: persistedHasAnswer ? false : state.streaming,
        showEphemeralAssistant: persistedHasAnswer ? false : state.showEphemeralAssistant,
        ephemeralUser: persistedHasAnswer ? null : state.ephemeralUser,
      };
    }
    case 'stream-error': {
      return {
        ...state,
        streaming: false,
      };
    }
    case 'insert-contact-form': {
      const newMsg: TranscriptMessage = {
        id: action.messageId || `contact-form-${Date.now()}`,
        role: 'ASSISTANT',
        content: action.prompt,
        createdAt: new Date().toISOString(),
        state: 'pending',
        contactForm: { prompt: action.prompt, submitting: false, submitted: false, dismissed: false, error: null, ...(action.chatId ? { chatId: action.chatId } as any : {}) },
      };
      return {
        ...state,
        messages: [...state.messages, newMsg],
      };
    }
    case 'contact-form-state': {
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.messageId ? { ...m, contactForm: { ...m.contactForm, ...action.patch } } : m,
        ),
      };
    }
    case 'reset':
      return { ...initialChatState };
    default:
      return state;
  }
};

export const createUserMessage = (content: string): TranscriptMessage => ({
  id: `user-${Date.now()}`,
  role: 'USER',
  content,
  createdAt: new Date().toISOString(),
  state: 'pending',
});
