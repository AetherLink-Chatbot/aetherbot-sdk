import React from "react";
import { AetherChatWidgetProps, Chat, ThemeConfig } from "../types";
export declare function ChatWindow({ avatarName, avatarImageUrl, bannerImageUrl, companyName, theme, setTheme, chats, setChats, activeChat, setActiveId, versionTag, muted, setMuted, onClose, play, onSendMessage, strings, initialShowHistory, widthPercent, heightPercent, historyTitle, onSelectHistoryChat, }: Pick<AetherChatWidgetProps, "avatarName" | "avatarImageUrl" | "bannerImageUrl" | "companyName" | "versionTag"> & {
    theme: ThemeConfig;
    setTheme: (t: ThemeConfig | ((t: ThemeConfig) => ThemeConfig)) => void;
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
    activeChat: Chat;
    setActiveId: (id: string) => void;
    muted: boolean;
    setMuted: (v: boolean) => void;
    onClose: () => void;
    play: (freq?: number, durationMs?: number) => void;
    onSendMessage?: (args: {
        text: string;
        chat: Chat;
        thinkingId: string;
        updateThinking: (content: string, done?: boolean) => void;
    }) => Promise<void> | void;
    strings?: any;
    initialShowHistory?: boolean;
    widthPercent?: number;
    heightPercent?: number;
    historyTitle?: string;
    onSelectHistoryChat?: (chat: Chat) => void;
}): import("react/jsx-runtime").JSX.Element;
