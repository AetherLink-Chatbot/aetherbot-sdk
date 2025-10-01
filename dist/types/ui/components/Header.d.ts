import { ThemeConfig } from "../types";
export declare function Header({ avatarImageUrl, avatarName, theme, setTheme, muted, setMuted, onHistory, onClose, subtitleText, }: {
    avatarImageUrl: string;
    avatarName: string;
    theme: ThemeConfig;
    setTheme: (t: ThemeConfig | ((t: ThemeConfig) => ThemeConfig)) => void;
    muted: boolean;
    setMuted: (v: boolean) => void;
    onHistory: () => void;
    onClose: () => void;
    subtitleText?: string;
}): import("react/jsx-runtime").JSX.Element;
