import { Chat } from "../types";
export declare function ConversationArea({ chat, onUpdateChat, onRetitle, onPlay, onSendMessage, inputPlaceholder, thinkingText, }: {
    chat: Chat;
    onUpdateChat: (chat: Chat) => void;
    onRetitle: (title: string) => void;
    onPlay: (freq?: number) => void;
    onSendMessage?: (args: {
        text: string;
        chat: Chat;
        thinkingId: string;
        updateThinking: (content: string, done?: boolean) => void;
    }) => Promise<void> | void;
    inputPlaceholder?: string;
    thinkingText?: string;
}): import("react/jsx-runtime").JSX.Element;
