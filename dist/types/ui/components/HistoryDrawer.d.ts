import { Chat } from "../types";
export declare function HistoryDrawer({ show, chats, activeId, setActiveId, onClose, onStartNew, titleText, newChatText, onSelectChat, }: {
    show: boolean;
    chats: Chat[];
    activeId: string;
    setActiveId: (id: string) => void;
    onClose: () => void;
    onStartNew: () => void;
    titleText?: string;
    newChatText?: string;
    onSelectChat?: (chat: Chat) => void;
}): import("react/jsx-runtime").JSX.Element;
