import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AetherChatWidgetProps, Chat, ThemeConfig } from "../types";
import { Header } from "./Header";
import { Banner } from "./Banner";
import { ConversationArea } from "./Conversation";
import { HistoryDrawer } from "./HistoryDrawer";
import { IntroSplash } from "./IntroSplash";
import { Sparkles } from "lucide-react";

export function ChatWindow({
  avatarName,
  avatarImageUrl,
  bannerImageUrl,
  companyName,
  theme,
  setTheme,
  chats,
  setChats,
  activeChat,
  setActiveId,
  versionTag,
  muted,
  setMuted,
  onClose,
  play,
}: Omit<Required<AetherChatWidgetProps>, "theme"> & {
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
}) {
  const [showHistory, setShowHistory] = useState(false);
  const [phase, setPhase] = useState<"splash" | "chat">("splash");

  // Intro splash then transition to chat with a chime
  useEffect(() => {
    setPhase("splash");
    const t = setTimeout(() => {
      setPhase("chat");
      play?.(720);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      className="pointer-events-auto fixed bottom-24 right-6 w-[380px] max-h-[78vh] sm:w-[420px]"
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 180, damping: 16 }}
    >
      <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-white dark:bg-black border border-white/60 dark:border-white/10">
        <Header
          avatarName={avatarName}
          avatarImageUrl={avatarImageUrl}
          theme={theme}
          setTheme={setTheme}
          muted={muted}
          setMuted={setMuted}
          onHistory={() => setShowHistory(true)}
          onClose={onClose}
        />

        {/* Splash → Chat animated transition */}
        <AnimateContent phase={phase} companyName={companyName} bannerImageUrl={bannerImageUrl} activeChat={activeChat} setChats={setChats} onRetitle={(title)=>setChats((xs)=>xs.map((c)=>c.id===activeChat.id?{...c,title}:c))} play={play} versionTag={versionTag} />

        {/* Decorative bottom-right droplet */}
        <div className="absolute -bottom-3 -right-2 h-8 w-8 rounded-full bg-white dark:bg-black shadow-md" />
      </div>

      <HistoryDrawer
        show={showHistory}
        chats={chats}
        activeId={activeChat.id}
        setActiveId={setActiveId}
        onClose={() => setShowHistory(false)}
        onStartNew={() => {
          const id = crypto.randomUUID();
          const now = Date.now();
          const chat: Chat = {
            id,
            createdAt: now,
            title: "New chat",
            messages: [
              {
                id: crypto.randomUUID(),
                role: "assistant",
                content: "Welcome! How can I help today?",
                createdAt: now,
              },
            ],
          };
          setChats((xs) => [chat, ...xs]);
          setActiveId(id);
        }}
      />
    </motion.div>
  );
}

function AnimateContent({
  phase,
  companyName,
  bannerImageUrl,
  activeChat,
  setChats,
  onRetitle,
  play,
  versionTag,
}: any) {
  return (
    <>
      {phase === "splash" ? (
        <IntroSplash />
      ) : (
        <motion.div key="chat" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Banner bannerImageUrl={bannerImageUrl} companyName={companyName} />
          <ConversationArea
            chat={activeChat}
            onUpdateChat={(chat: any) => setChats((xs: any) => xs.map((c: any) => (c.id === chat.id ? chat : c)))}
            onRetitle={onRetitle}
            onPlay={play}
          />
          <div className="px-4 pb-2">
            <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  Powered by <span className="font-medium">aetherlink</span>
                </span>
              </div>
              <span className="opacity-70">{versionTag}</span>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
