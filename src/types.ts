export interface PublicAvatarQueryRequest {
  query: string;
  external_user_id: string;
  external_user_name?: string;
  chat_id?: string;
  session_id?: string;
  k?: number;
}

export interface AvatarQueryContextItem {
  kb_id: string;
  kb_name?: string;
  priority?: number;
  distance?: number;
  text: string;
  metadata?: Record<string, unknown> | null;
}

export interface PublicAvatarQueryResponse {
  chat_id: string;
  answer: string;
  context: AvatarQueryContextItem[];
  created_new_chat: boolean;
}

export type StreamStatusEvent = {
  type: 'status';
  status: string;
};

export type StreamReasoningEvent = {
  type: 'reasoning';
  reasoning: string;
};

export type StreamTokenEvent = {
  type: 'token';
  token: string;
};

export type StreamFinalEvent = {
  type: 'final';
  payload: PublicAvatarQueryResponse;
};

// Contact form trigger event for public widget
export type StreamContactFormEvent = {
  type: 'contact_form';
  message: string;
  messageId?: string;
  chatId?: string;
};

export type AvatarQueryStreamEvent =
  | StreamStatusEvent
  | StreamReasoningEvent
  | StreamTokenEvent
  | StreamFinalEvent
  | StreamContactFormEvent;

export interface PublicChatSummary {
  id: string;
  title: string | null;
  avatar_id: string;
  project_name?: string | null;
  external_user_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicChatListResponse {
  items: PublicChatSummary[];
}

export type ChatMessageRole = 'SYSTEM' | 'USER' | 'ASSISTANT';

export interface PublicChatMessageMetadata {
  reasoning?: string[];
  [key: string]: unknown;
}

export interface PublicChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  created_at: string;
  message_metadata?: PublicChatMessageMetadata | null;
}

export interface PublicChatHistoryResponse {
  chat_id: string;
  avatar_id: string;
  title: string | null;
  external_user_id?: string | null;
  external_user_name?: string | null;
  messages: PublicChatMessage[];
}

export interface ClientSessionState {
  chatId: string | null;
  sessionId: string;
  externalUserId: string;
  externalUserName?: string;
}

export type WidgetChatHistoryMode = 'always-new' | 'history' | 'show-history';

export interface SessionOptions {
  /** Optional namespace to avoid storage collisions when using multiple widgets */
  namespace?: string;
  /** Override storage implementation (defaults to localStorage with in-memory fallback) */
  storage?: StorageLike;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface PublicClientOptions {
  apiKey: string;
  avatarId: string;
  externalUserId: string;
  externalUserName?: string;
  apiBaseUrl: string;
  defaultTopK?: number;
  session?: SessionOptions;
}

// A/B testing
export interface AbAssignResponse {
  show: boolean;
}

export interface AbTestingOptions {
  /** 0–100 percentage of users to show the widget */
  testPercentage: number;
  /**
   * If true and an external user id is available, persist assignments via
   * the public A/B endpoint so the same user sees a consistent result.
   * If false or no user id, the widget uses client-side randomness only.
   */
  persistAssignment?: boolean;
}

export interface QueryOptions {
  k?: number;
  externalUserName?: string;
  resetChat?: boolean;
}

export interface WidgetTheme {
  primary: string;
  secondary: string;
  text: string;
}

export interface WidgetPreviewScriptMessage {
  role: Extract<ChatMessageRole, 'USER' | 'ASSISTANT'>;
  content: string;
  reasoning?: string[];
}

export interface WidgetPreviewConfig {
  /**
   * Pre-populated conversation for demo environments.
   * @internal
   */
  initialMessages?: WidgetPreviewScriptMessage[];
  /**
   * Re-usable canned answers when the visitor sends messages during preview.
   * @internal
   */
  cannedResponses?: string[];
  /**
   * Milliseconds to simulate thinking between user question and assistant reply.
   * @internal
   */
  answerDelayMs?: number;
  /**
   * Optional display name used in generated demo answers.
   * @internal
   */
  personaName?: string;
}

export type WidgetPosition =
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'center'
  | 'center-left'
  | 'center-right';

export interface WidgetOptions {
  apiKey: string;
  avatarId: string;
  apiBaseUrl: string;
  externalUserId: string;
  externalUserName?: string;
  organizationName?: string;
  position?: WidgetPosition;
  theme?: WidgetTheme;
  welcomeMessage?: string;
  firstMessage?: string;
  displayMessage?: string;
  displayName?: string;
  autoOpen?: boolean;
  autoOpenMode?: 'never' | 'immediate' | 'delay' | 'scroll' | 'manual';
  autoOpenDelaySeconds?: number;
  autoOpenScrollPercentage?: number;
  showAvatars?: boolean;
  avatarImage?: string;
  defaultTopK?: number;
  session?: SessionOptions;
  chatHistoryMode?: WidgetChatHistoryMode;
  widthPercent?: number;
  heightPercent?: number;
  /** Configure A/B testing for widget visibility */
  abTesting?: AbTestingOptions;
  /** @internal */
  __preview?: WidgetPreviewConfig;
}

export interface WidgetMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  createdAt: string;
  reasoning?: string[];
}

export interface WidgetController {
  open(): void;
  close(): void;
  toggle(): void;
  resetConversation(): void;
  destroy(): void;
}

// Public Contacts API types
export type ContactMethod = 'email' | 'call';

export interface ContactCreatePublic {
  chat_id: string;
  avatar_id: string;
  message_id?: string | null;
  name: string;
  contact_method: ContactMethod;
  contact_value?: string | null;
  concern_text: string;
}

export interface ContactOut {
  id: string;
  avatar_id: string;
  chat_id: string;
  message_id?: string | null;
  name: string;
  contact_method: ContactMethod;
  contact_value?: string | null;
  concern_text: string;
  status: 'pending' | 'on_hold' | 'resolved' | 'failure';
  created_at: string;
  updated_at: string;
}
