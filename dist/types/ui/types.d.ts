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
    serverId?: string;
    title: string;
    createdAt: number;
    messages: Message[];
}
export interface ThemeConfig {
    primary: string;
    secondary?: string;
    text?: string;
    mode: "light" | "dark";
}
export interface AetherChatWidgetProps {
    avatarName?: string;
    displayName?: string;
    avatarImageUrl?: string;
    avatarImage?: string;
    bannerImageUrl?: string;
    companyName?: string;
    organizationName?: string;
    theme?: Partial<ThemeConfig>;
    versionTag?: string;
    firstMessage?: string;
    welcomeMessage?: string;
    apiKey?: string;
    avatarId?: string;
    externalUserId?: string;
    externalUserName?: string;
    autoOpenMode?: "manual" | "delay" | "scroll" | "hybrid";
    autoOpenDelaySeconds?: number;
    autoOpenScrollPercentage?: number;
    chatHistoryMode?: "history" | "always-new" | "show-history";
    widthPercent?: number;
    heightPercent?: number;
    showAvatars?: boolean;
    strings?: TextOverrides;
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
    launcherTitle?: string;
    launcherSubtitle?: string;
    headerSubtitle?: string;
    bannerTagline?: string;
    inputPlaceholder?: string;
    thinkingLabel?: string;
    poweredByPrefix?: string;
    poweredByBrand?: string;
    splashPoweredByBrand?: string;
}
