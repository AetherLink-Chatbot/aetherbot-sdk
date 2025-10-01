import React from "react";
import { History, Minus, Moon, Sun, Volume2, VolumeX, X } from "lucide-react";
import { IconButton } from "./IconButton";
import { AvatarImg } from "./AvatarImg";
import { ThemeConfig } from "../types";

export function Header({
  avatarImageUrl,
  avatarName,
  theme,
  setTheme,
  muted,
  setMuted,
  onHistory,
  onClose,
  subtitleText,
}: {
  avatarImageUrl: string;
  avatarName: string;
  theme: ThemeConfig;
  setTheme: (t: ThemeConfig | ((t: ThemeConfig) => ThemeConfig)) => void;
  muted: boolean;
  setMuted: (v: boolean) => void;
  onHistory: () => void;
  onClose: () => void;
  subtitleText?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <AvatarImg src={avatarImageUrl} alt="avatar" className="h-9 w-9 rounded-full" />
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold leading-none">{avatarName}</p>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{subtitleText || "Adaptable chatbot service"}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-zinc-500">
        <IconButton
          label="Toggle theme"
          onClick={() => setTheme((t) => ({ ...t, mode: t.mode === "dark" ? "light" : "dark" }))}
        >
          {theme.mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </IconButton>
        <IconButton label={muted ? "Unmute" : "Mute"} onClick={() => setMuted(!muted)}>
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </IconButton>
        <IconButton label="History" onClick={onHistory}>
          <History className="h-4 w-4" />
        </IconButton>
        <IconButton label="Minimize" onClick={onClose}>
          <Minus className="h-4 w-4" />
        </IconButton>
        <IconButton label="Close" onClick={onClose}>
          <X className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}
