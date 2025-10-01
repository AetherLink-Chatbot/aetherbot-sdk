import type { TextOverrides } from "./ui/types";
export type CreateWidgetOptions = {
    apiKey?: string;
    avatarId?: string;
    externalUserId?: string;
    externalUserName?: string;
    avatarName?: string;
    displayName?: string;
    avatarImageUrl?: string;
    avatarImage?: string;
    bannerImageUrl?: string;
    companyName?: string;
    organizationName?: string;
    theme?: {
        primary?: string;
        secondary?: string;
        text?: string;
        mode?: "light" | "dark";
    };
    versionTag?: string;
    firstMessage?: string;
    welcomeMessage?: string;
    autoOpenMode?: "manual" | "delay" | "scroll" | "hybrid";
    autoOpenDelaySeconds?: number;
    autoOpenScrollPercentage?: number;
    chatHistoryMode?: "history" | "always-new" | "show-history";
    widthPercent?: number;
    heightPercent?: number;
    showAvatars?: boolean;
    strings?: TextOverrides;
};
export type WidgetController = {
    open: () => void;
    close: () => void;
    toggle: () => void;
    resetConversation: () => void;
    destroy: () => void;
};
export declare function createWidget(opts: CreateWidgetOptions): WidgetController;
export declare function destroyAll(): void;
export declare const create: typeof createWidget;
export declare function init(opts?: CreateWidgetOptions): WidgetController;
export declare const AetherbotWidget: {
    createWidget: typeof createWidget;
    create: typeof createWidget;
    init: typeof init;
    destroyAll: typeof destroyAll;
};
