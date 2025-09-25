import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type {
  AvatarQueryStreamEvent,
  ClientSessionState,
  PublicAvatarQueryResponse,
  PublicChatHistoryResponse,
  PublicChatSummary,
  QueryOptions,
} from '../types';
import {
  chatReducer,
  createUserMessage,
  initialChatState,
  type ChatState,
  type TranscriptMessage,
} from './chatReducer';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const errorMessage = (err: unknown): string => {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'string') return err;
  return 'Something went wrong. Please try again.';
};

const historyHasAnswer = (history: PublicChatHistoryResponse, answer?: string): boolean => {
  if (!answer) return false;
  const trimmed = answer.trim();
  if (!trimmed.length) return false;
  return history.messages.some(
    (msg) => msg.role === 'ASSISTANT' && msg.content.trim() === trimmed,
  );
};

export interface UseWidgetChatResult {
  state: ChatState;
  chatId: string | null;
  chats: PublicChatSummary[];
  loadingChats: boolean;
  loadingHistory: boolean;
  sending: boolean;
  error: string | null;
  setError: (value: string | null) => void;
  refreshChats: () => Promise<void>;
  selectChat: (chatId: string | null) => Promise<void>;
  sendMessage: (content: string, options?: QueryOptions) => Promise<PublicAvatarQueryResponse | null>;
  resetConversation: () => void;
  updateContactForm: (messageId: string, patch: Partial<NonNullable<TranscriptMessage['contactForm']>>) => void;
}

export interface WidgetChatClient {
  getSessionState(): ClientSessionState;
  resetConversation(): void;
  setActiveChat(chatId: string | null): void;
  listChats(externalUserId?: string): Promise<{ items?: PublicChatSummary[] }>;
  getChatHistory(chatId?: string): Promise<PublicChatHistoryResponse>;
  streamQuery(
    query: string,
    options?: QueryOptions,
  ): AsyncGenerator<AvatarQueryStreamEvent, void, unknown>;
}

export const useWidgetChat = (client: WidgetChatClient): UseWidgetChatResult => {
  const [state, dispatch] = useReducer(chatReducer, initialChatState);
  const [chats, setChats] = useState<PublicChatSummary[]>([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialSession = useMemo(() => client.getSessionState(), [client]);
  const [chatId, setChatId] = useState<string | null>(initialSession.chatId ?? null);
  const autoSelectPerformed = useRef(false);

  const refreshChats = useCallback(async () => {
    setLoadingChats(true);
    try {
      const res = await client.listChats();
      setChats(res.items ?? []);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoadingChats(false);
    }
  }, [client]);

  const loadHistory = useCallback(
    async (targetChatId: string) => {
      setLoadingHistory(true);
      try {
        const history = await client.getChatHistory(targetChatId);
        dispatch({ type: 'hydrate', history });
      } catch (err) {
        setError(errorMessage(err));
        throw err;
      } finally {
        setLoadingHistory(false);
      }
    },
    [client],
  );

  const loadHistoryWithRetry = useCallback(
    async (targetChatId: string, expectedAnswer?: string) => {
      const maxAttempts = 4;
      for (let attempt = 0; attempt <= maxAttempts; attempt += 1) {
        try {
          const history = await client.getChatHistory(targetChatId);
          const persisted = historyHasAnswer(history, expectedAnswer);
          dispatch({ type: 'reconcile', history, expectedAnswer });
          if (persisted) return;
        } catch (err) {
          setError(errorMessage(err));
          return;
        }
        await wait(200 * (attempt + 1));
      }
    },
    [client],
  );

  const selectChat = useCallback(
    async (targetChatId: string | null) => {
      if (!targetChatId) {
        client.resetConversation();
        client.setActiveChat(null);
        setChatId(null);
        dispatch({ type: 'reset' });
        autoSelectPerformed.current = true;
        return;
      }

      setChatId(targetChatId);
      client.setActiveChat(targetChatId);
      dispatch({ type: 'reset' });
      await loadHistory(targetChatId).catch(() => {
        // error already captured in loadHistory
      });
    },
    [client, loadHistory],
  );

  const resetConversation = useCallback(() => {
    client.resetConversation();
    client.setActiveChat(null);
    setChatId(null);
    dispatch({ type: 'reset' });
    autoSelectPerformed.current = true;
  }, [client]);

  const streamEventHandler = useCallback(
    (event: AvatarQueryStreamEvent) => {
      switch (event.type) {
        case 'status':
          dispatch({ type: 'stream-status', value: event.status });
          break;
        case 'reasoning':
          dispatch({ type: 'stream-reasoning', value: event.reasoning });
          break;
        case 'token':
          dispatch({ type: 'stream-delta', token: event.token });
          break;
        case 'contact_form':
          dispatch({ type: 'insert-contact-form', prompt: event.message, messageId: event.messageId, chatId: event.chatId });
          break;
        case 'final':
          dispatch({ type: 'stream-final', payload: event.payload });
          break;
        default:
          break;
      }
    },
    [],
  );

  const sendMessage = useCallback(
    async (content: string, options?: QueryOptions): Promise<PublicAvatarQueryResponse | null> => {
      const trimmed = content.trim();
      if (!trimmed.length || sending) {
        return null;
      }

      dispatch({ type: 'commit-transient' });
      const userMessage: TranscriptMessage = createUserMessage(trimmed);
      dispatch({ type: 'set-ephemeral-user', message: userMessage });
      dispatch({ type: 'stream-start' });
      setSending(true);
      setError(null);

      try {
        let finalPayload: PublicAvatarQueryResponse | null = null;
        for await (const event of client.streamQuery(trimmed, options)) {
          if (event.type === 'final') {
            finalPayload = event.payload;
          }
          streamEventHandler(event);
        }

        if (finalPayload) {
          const targetChatId = finalPayload.chat_id;
          client.setActiveChat(targetChatId);
          setChatId(targetChatId);
          await loadHistoryWithRetry(targetChatId, finalPayload.answer);
          await refreshChats();
        }

        return finalPayload;
      } catch (err) {
        setError(errorMessage(err));
        dispatch({ type: 'stream-error' });
        throw err;
      } finally {
        setSending(false);
      }
    },
    [client, loadHistoryWithRetry, refreshChats, sending, streamEventHandler],
  );

  useEffect(() => {
    refreshChats();
  }, [refreshChats]);

  useEffect(() => {
    if (!chatId) return;
    loadHistory(chatId).catch(() => {
      // error already captured
    });
  }, [chatId, loadHistory]);

  useEffect(() => {
    if (autoSelectPerformed.current) return;
    if (initialSession.chatId || chats.length === 0) return;
    const [first] = chats;
    if (first?.id) {
      autoSelectPerformed.current = true;
      selectChat(first.id).catch(() => {});
    }
  }, [chats, initialSession.chatId, selectChat]);

  return {
    state,
    chatId,
    chats,
    loadingChats,
    loadingHistory,
    sending,
    error,
    setError,
    refreshChats,
    selectChat,
    sendMessage,
    resetConversation,
    updateContactForm: (messageId, patch) => dispatch({ type: 'contact-form-state', messageId, patch }),
  };
};
