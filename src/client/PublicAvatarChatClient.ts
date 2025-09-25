import {
  AvatarQueryStreamEvent,
  PublicAvatarQueryRequest,
  PublicAvatarQueryResponse,
  PublicChatHistoryResponse,
  PublicChatListResponse,
  PublicChatSummary,
  PublicClientOptions,
  QueryOptions,
  WidgetMessage,
} from '../types';
import { SessionManager } from '../storage/session';
import { parseAvatarQueryStream } from '../transport/streamParser';
import type { ContactCreatePublic, ContactOut } from '../types';

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, '');

const encodeQueryParams = (params: Record<string, string | undefined>): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (typeof val === 'string' && val.length) {
      search.append(key, val);
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
};

interface RawChatSummary {
  id?: string;
  chat_id?: string;
  title?: string | null;
  project_name?: string | null;
  avatar_id: string;
  external_user_id?: string | null;
  created_at: string;
  updated_at: string;
}

interface RawChatListResponse {
  items?: RawChatSummary[];
}

export class PublicAvatarChatClient {
  private readonly apiKey: string;
  private readonly avatarId: string;
  private readonly apiBaseUrl: string;
  private readonly defaultTopK?: number;
  private session: SessionManager;

  constructor(private readonly options: PublicClientOptions) {
    if (!options.apiKey) throw new Error('apiKey is required');
    if (!options.avatarId) throw new Error('avatarId is required');
    if (!options.apiBaseUrl) throw new Error('apiBaseUrl is required');
    if (!options.externalUserId) throw new Error('externalUserId is required');

    this.apiKey = options.apiKey;
    this.avatarId = options.avatarId;
    this.apiBaseUrl = trimTrailingSlash(options.apiBaseUrl);
    this.defaultTopK = options.defaultTopK;
    this.session = new SessionManager(
      this.avatarId,
      options.externalUserId,
      options.externalUserName,
      options.session,
    );
    if (options.externalUserName) {
      this.session.setExternalUserName(options.externalUserName);
    }
  }

  getSessionState() {
    return this.session.getState();
  }

  resetConversation(): void {
    this.session.reset();
  }

  setActiveChat(chatId: string | null): void {
    this.session.setChatId(chatId);
  }

  private buildRequestPayload(query: string, overrides?: QueryOptions): PublicAvatarQueryRequest {
    const state = this.session.getState();
    const shouldReset = overrides?.resetChat;
    if (shouldReset) {
      this.resetConversation();
    }
    const payload: PublicAvatarQueryRequest = {
      query,
      external_user_id: this.options.externalUserId,
      external_user_name: overrides?.externalUserName ?? this.options.externalUserName ?? state.externalUserName,
      chat_id: shouldReset ? null : state.chatId ?? null,
      session_id: state.sessionId,
      k: overrides?.k ?? this.defaultTopK ?? undefined,
    };
    if (payload.external_user_name) {
      this.session.setExternalUserName(payload.external_user_name);
    }
    return payload;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...(init?.headers || {}),
    };

    const res = await fetch(`${this.apiBaseUrl}${path}`, {
      ...init,
      headers,
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${text || 'unknown error'}`);
    }
    if (!text) {
      return {} as T;
    }
    try {
      return JSON.parse(text) as T;
    } catch (err) {
      throw new Error('Failed to parse API response');
    }
  }

  /**
   * Request an A/B test assignment for whether to show the widget.
   * If userId is omitted, backend treats it as a guest and returns
   * a one-off randomised decision without persistence.
   */
  async assignAb(testPercentage: number, userId?: string): Promise<{ show: boolean }> {
    const body = {
      userId: userId ?? undefined,
      testPercentage,
    } as { userId?: string; testPercentage: number };
    return this.request<{ show: boolean }>(`/public/ab/${this.avatarId}/assign`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async *streamQuery(
    query: string,
    options?: QueryOptions,
  ): AsyncGenerator<AvatarQueryStreamEvent, void, unknown> {
    const payload = this.buildRequestPayload(query, options);
    const res = await fetch(`${this.apiBaseUrl}/public/avatars-chat/${this.avatarId}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify(payload),
    });

    const session = this.session;
    for await (const event of parseAvatarQueryStream(res)) {
      if (event.type === 'final') {
        session.setChatId(event.payload.chat_id);
      }
      yield event;
    }
  }

  async sendQuery(
    query: string,
    options?: QueryOptions,
  ): Promise<PublicAvatarQueryResponse> {
    let final: PublicAvatarQueryResponse | null = null;
    for await (const evt of this.streamQuery(query, options)) {
      if (evt.type === 'final') {
        final = evt.payload;
      }
    }
    if (!final) {
      throw new Error('Stream completed without a final payload');
    }
    return final;
  }

  async listChats(externalUserId?: string): Promise<PublicChatListResponse> {
    const qs = encodeQueryParams({ external_user_id: externalUserId ?? this.options.externalUserId });
    const response = await this.request<RawChatListResponse>(`/public/avatars-chat/chats${qs}`);
    const items = (response.items ?? []).reduce<PublicChatSummary[]>((acc, item) => {
      const id = item.id ?? item.chat_id;
      if (!id) return acc;
      acc.push({
        id,
        title: item.title ?? null,
        avatar_id: item.avatar_id,
        project_name: item.project_name ?? null,
        external_user_id: item.external_user_id ?? null,
        created_at: item.created_at,
        updated_at: item.updated_at,
      });
      return acc;
    }, []);

    return { items };
  }

  async getChatHistory(chatId?: string): Promise<PublicChatHistoryResponse> {
    const targetChatId = chatId ?? this.session.getChatId();
    if (!targetChatId) {
      throw new Error('No chat_id available. Start a conversation first.');
    }
    return this.request<PublicChatHistoryResponse>(`/public/avatars-chat/chats/${targetChatId}`);
  }

  /**
   * Convenience helper for widgets: returns chat history adapted to widget message shape.
   */
  async getWidgetMessages(chatId?: string): Promise<WidgetMessage[]> {
    const history = await this.getChatHistory(chatId);
    return history.messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: message.created_at,
      reasoning: message.message_metadata?.reasoning,
    }));
  }

  // Submit a public contact request (inline chat form)
  async submitContact(request: ContactCreatePublic): Promise<ContactOut> {
    return this.request<ContactOut>(`/public/contacts`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export type { PublicAvatarQueryRequest } from '../types';
