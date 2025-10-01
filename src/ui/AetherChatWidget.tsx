import React, { useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { AetherChatWidgetProps, Chat, ThemeConfig } from "./types";
import { useChime, useLocalStorage } from "./hooks";
import { defaultAvatar, defaultBanner } from "./utils";
import { Launcher } from "./components/Launcher";
import { ChatWindow } from "./components/ChatWindow";

const initialTheme: ThemeConfig = {
  primary: "#7c3aed", // violet-600
  mode: "light",
};

export default function AetherChatWidget({
  avatarName = "Aetherbot",
  avatarImageUrl = defaultAvatar,
  bannerImageUrl = defaultBanner,
  companyName = "Aetherlink",
  theme: themeProp,
  versionTag = "v1.01",
}: AetherChatWidgetProps) {
  const [theme, setTheme] = useLocalStorage<ThemeConfig>(
    "aether.widget.theme",
    { ...initialTheme, ...(themeProp || {}) }
  );

  const [open, setOpen] = useLocalStorage<boolean>("aether.widget.open", false);
  const [muted, setMuted] = useLocalStorage<boolean>("aether.widget.muted", false);
  const { chord, play } = useChime(!muted);

  const [chats, setChats] = useLocalStorage<Chat[]>("aether.widget.chats", [
    {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      title: "New chat",
      messages: [
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Hey! I’m here to help. Ask me anything — product info, policies, or troubleshooting.",
          createdAt: Date.now(),
        },
      ],
    },
  ]);

  const [activeId, setActiveId] = useLocalStorage<string>(
    "aether.widget.active",
    ""
  );

  const activeChat = chats.find((c) => c.id === activeId) || chats[0];

  useEffect(() => {
    if (!activeChat && chats.length) setActiveId(chats[0].id);
  }, [chats, activeChat, setActiveId]);

  // Also mirror dark mode onto <html> to make the demo page reflect the theme.
  useEffect(() => {
    const root = document.documentElement;
    if (theme.mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme.mode]);

  const cssVars = useMemo(
    () => ({
      // @ts-ignore
      "--aether-primary": theme.primary,
    }),
    [theme.primary]
  );

  const toggleOpen = () => {
    setOpen((o) => {
      if (!o) chord();
      return !o;
    });
  };

  return (
    <div
      style={cssVars as React.CSSProperties}
      className={`fixed inset-0 pointer-events-none z-[60] ${theme.mode === "dark" ? "dark" : ""}`}
    >
      <Launcher open={open} onToggle={toggleOpen} avatarImageUrl={avatarImageUrl} />
      <AnimatePresence initial={false}>
        {open && (
          <ChatWindow
            avatarName={avatarName}
            avatarImageUrl={avatarImageUrl}
            bannerImageUrl={bannerImageUrl}
            companyName={companyName}
            theme={theme}
            setTheme={setTheme}
            chats={chats}
            setChats={setChats}
            activeChat={activeChat}
            setActiveId={setActiveId}
            versionTag={versionTag}
            muted={muted}
            setMuted={setMuted}
            onClose={() => setOpen(false)}
            play={play}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
