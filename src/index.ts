import { PublicAvatarChatClient } from './client/PublicAvatarChatClient';
import { createWidget } from './widget/createWidget';
import type { WidgetController, WidgetOptions } from './types';

const VERSION = '0.1.0';

const instances = new Set<WidgetController>();

const trackInstance = (instance: WidgetController): WidgetController => {
  instances.add(instance);
  const originalDestroy = instance.destroy;
  instance.destroy = () => {
    instances.delete(instance);
    originalDestroy();
  };
  return instance;
};

const destroyAll = () => {
  instances.forEach((instance) => instance.destroy());
  instances.clear();
};

type ConfigLike = WidgetOptions & { colorScheme?: { primary?: string; secondary?: string; text?: string } };

const normalizeConfig = (config: ConfigLike): WidgetOptions => {
  if (!config.apiKey) throw new Error('apiKey is required');
  if (!config.avatarId) throw new Error('avatarId is required');
  if (!config.apiBaseUrl) throw new Error('apiBaseUrl is required');
  if (!config.externalUserId) throw new Error('externalUserId is required');
  const { colorScheme, ...rest } = config;
  const theme = rest.theme ?? colorScheme;
  return {
    ...rest,
    theme: theme
      ? {
          primary: theme.primary ?? '#1f2937',
          secondary: theme.secondary ?? '#4b5563',
          text: theme.text ?? '#0f172a',
        }
      : undefined,
  };
};

const createAndTrack = (options: WidgetOptions): WidgetController => trackInstance(createWidget(options));

const initWithConfig = (config: ConfigLike): WidgetController => createAndTrack(normalizeConfig(config));

declare global {
  interface Window {
    AetherbotWidget?: {
      version: string;
      create: (options: WidgetOptions) => WidgetController;
      init: (options: ConfigLike) => WidgetController;
      destroyAll: () => void;
      Client: typeof PublicAvatarChatClient;
    };
    aetherbotConfig?: ConfigLike;
    AetherbotWidgetInstance?: WidgetController;
  }
}

const exposeGlobal = () => {
  if (typeof window === 'undefined') return;
  const globalObj = window;

  const namespace = globalObj.AetherbotWidget || {
    version: VERSION,
    destroyAll,
    create: createAndTrack,
    init: initWithConfig,
    Client: PublicAvatarChatClient,
  };

  namespace.version = VERSION;
  namespace.destroyAll = destroyAll;
  namespace.create = createAndTrack;
  namespace.init = initWithConfig;
  namespace.Client = PublicAvatarChatClient;

  globalObj.AetherbotWidget = namespace;

  const preload = globalObj.aetherbotConfig;
  if (preload) {
    try {
      globalObj.AetherbotWidgetInstance = namespace.init(preload);
    } catch (err) {
      console.error('[Aetherbot] Failed to initialize widget', err);
    }
  }
};

exposeGlobal();

export { PublicAvatarChatClient, createWidget };
export type { WidgetController, WidgetOptions }; 
