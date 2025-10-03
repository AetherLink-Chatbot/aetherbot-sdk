import { ClientSessionState, SessionOptions, StorageLike } from '../types';

const DEFAULT_NAMESPACE = 'aetherbot-public';

class InMemoryStorage implements StorageLike {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key) ?? null : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
}

const getBrowserStorage = (): StorageLike => {
  if (typeof window === 'undefined') return new InMemoryStorage();
  try {
    const testKey = '__aetherbot_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return new InMemoryStorage();
  }
};

const createStorage = (options?: SessionOptions): StorageLike => {
  if (options?.storage) return options.storage;
  return getBrowserStorage();
};

const createStorageKey = (
  avatarId: string,
  externalUserId: string,
  namespace?: string,
): string => {
  const safeNamespace = namespace?.trim() || DEFAULT_NAMESPACE;
  return `${safeNamespace}::${avatarId}::${externalUserId}`;
};

const safeParse = (raw: string | null): ClientSessionState | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ClientSessionState;
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.sessionId !== 'string') return null;
    if (typeof parsed.externalUserId !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
};

const createSessionId = (): string => {
  const globalCrypto: any = (typeof crypto !== 'undefined') ? crypto : null;
  if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
    return globalCrypto.randomUUID();
  }
  const random = Math.random().toString(16).slice(2, 10);
  const timestamp = Date.now().toString(16);
  return `${timestamp}-${random}`;
};

export class SessionManager {
  private readonly storage: StorageLike;
  private readonly storageKey: string;
  private state: ClientSessionState;

  constructor(
    avatarId: string,
    externalUserId: string,
    externalUserName?: string,
    options?: SessionOptions,
  ) {
    this.storage = createStorage(options);
    this.storageKey = createStorageKey(avatarId, externalUserId, options?.namespace);
    const persisted = safeParse(this.getRaw());
    const sessionId = persisted?.sessionId || createSessionId();
    const chatId = persisted?.chatId ?? null;
    const name = externalUserName ?? persisted?.externalUserName;
    this.state = {
      sessionId,
      chatId,
      externalUserId,
      externalUserName: name,
    };
    this.persist();
  }

  private getRaw(): string | null {
    try {
      return this.storage.getItem(this.storageKey);
    } catch {
      return null;
    }
  }

  private persist(): void {
    try {
      this.storage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch {
      // Ignore storage errors (e.g. quota exceeded)
    }
  }

  getSessionId(): string {
    return this.state.sessionId;
  }

  getChatId(): string | null {
    return this.state.chatId ?? null;
  }

  setChatId(chatId: string | null): void {
    this.state.chatId = chatId;
    this.persist();
  }

  setExternalUserName(name?: string): void {
    this.state.externalUserName = name;
    this.persist();
  }

  reset(): void {
    this.state = {
      sessionId: createSessionId(),
      chatId: null,
      externalUserId: this.state.externalUserId,
      externalUserName: this.state.externalUserName,
    };
    this.persist();
  }

  getState(): ClientSessionState {
    return { ...this.state };
  }
}

