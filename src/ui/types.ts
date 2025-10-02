export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  thinking?: boolean;
}

export interface Chat {
  id: string;
  // Optional server chat id from backend
  serverId?: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

export interface ThemeConfig {
  mode: "light" | "dark";
  text: string; // global text color
  background: string; // widget background color
  secondary: string; // accents: FAB, icons, user bubble, send button
  aiMessageBg: string; // AI message bubble background
  bannerText: string; // banner text color
}

export interface AetherChatWidgetProps {
  // Presentation names
  avatarName?: string; // falls back to displayName
  displayName?: string; // alias for avatarName
  avatarImageUrl?: string; // falls back to avatarImage
  avatarImage?: string; // alias for avatarImageUrl
  bannerImageUrl?: string;
  companyName?: string; // falls back to organizationName
  organizationName?: string; // alias for companyName

  theme?: Partial<ThemeConfig>;
  versionTag?: string; // e.g., v1.01
  // Optional: initial assistant message to display
  firstMessage?: string;
  welcomeMessage?: string; // header subtitle while idle
  // Optional API config for live integration
  apiKey?: string;
  // apiBaseUrl is static to https://aetherbot.dev
  avatarId?: string;
  externalUserId?: string;
  externalUserName?: string;
  // Behaviour
  autoOpenMode?: "manual" | "delay" | "scroll" | "hybrid";
  autoOpenDelaySeconds?: number; // used when mode includes delay
  autoOpenScrollPercentage?: number; // used when mode includes scroll
  chatHistoryMode?: "history" | "always-new" | "show-history";
  widthPercent?: number; // target width percent of viewport (clamped to design)
  heightPercent?: number; // max height percent of viewport (clamped)
  showAvatars?: boolean; // accepted but not altering layout by default
  
  // Copy/text overrides
  strings?: TextOverrides;
  // Called once with control methods for external callers
  onReady?: (controls: {
    open: () => void;
    close: () => void;
    toggle: () => void;
    resetConversation: () => void;
  }) => void;
}

export interface PublicApiClientConfig {
  apiKey: string;
  apiBaseUrl: string;
  avatarId: string;
  externalUserId: string;
  externalUserName?: string;
}

export interface StreamCallbacks {
  onToken?: (delta: string) => void;
  onStatus?: (text: string) => void;
}

export interface StreamResult {
  chat_id?: string;
  answer?: string;
  created_new_chat?: boolean;
  context?: unknown;
}

export interface TextOverrides {
  launcherTitle?: string; // "Let's Chat, Your Way"
  launcherSubtitle?: string; // "This chatbot adapts..."
  headerSubtitle?: string; // default from welcomeMessage or constant
  bannerTagline?: string; // banner small text
  inputPlaceholder?: string; // "Type message..."
  thinkingLabel?: string; // "Thinking…"
  poweredByPrefix?: string; // "Powered by"
  poweredByBrand?: string; // "aetherlink"
  splashPoweredByBrand?: string; // IntroSplash brand text
}
