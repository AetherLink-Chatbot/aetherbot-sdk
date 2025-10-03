import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AetherChatWidgetProps, Chat } from "../types";
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
  chats,
  setChats,
  activeChat,
  setActiveId,
  muted,
  setMuted,
  onClose,
  play,
  onSendMessage,
  strings,
  initialShowHistory,
  widthPercent,
  heightPercent,
  historyTitle,
  onSelectHistoryChat,
  guestMode,
  onSubmitContact,
  position = 'bottom-right',
}: Pick<AetherChatWidgetProps, "avatarName" | "avatarImageUrl" | "bannerImageUrl" | "companyName" | "versionTag"> & {
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
    updateThinking: (content: string, done?: boolean, options?: { contactForm?: { promptText: string; chatId?: string; messageId?: string } }) => void;
  }) => Promise<void> | void;
  strings?: any;
  initialShowHistory?: boolean;
  widthPercent?: number;
  heightPercent?: number;
  historyTitle?: string;
  onSelectHistoryChat?: (chat: Chat) => void;
  guestMode?: boolean;
  onSubmitContact?: (payload: {
    chat_id: string;
    message_id?: string | null;
    name: string;
    contact_method: 'email' | 'call' | string;
    contact_value?: string | null;
    concern_text: string;
  }) => Promise<any>;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}) {
  const [showHistory, setShowHistory] = useState(!!initialShowHistory);
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

  const wClamp = typeof widthPercent === 'number' && !Number.isNaN(widthPercent)
    ? `min(420px, max(380px, ${Math.max(0, Math.min(100, widthPercent))}vw))`
    : undefined;
  const hClamp = typeof heightPercent === 'number' && !Number.isNaN(heightPercent)
    ? `${Math.min(78, Math.max(20, heightPercent))}vh`
    : undefined;

  const posClass = position === 'bottom-left'
    ? 'fixed bottom-24 left-6'
    : position === 'top-right'
    ? 'fixed top-24 right-6'
    : position === 'top-left'
    ? 'fixed top-24 left-6'
    : 'fixed bottom-24 right-6';

  return (
    <motion.div
      className={`pointer-events-auto ${posClass} w-[380px] max-h-[78vh] sm:w-[420px]`}
      style={{ width: wClamp, maxHeight: hClamp } as React.CSSProperties}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 180, damping: 16 }}
    >
      <div
        className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/60 dark:border-white/10"
        style={{ backgroundColor: "var(--aether-bg)", color: "var(--aether-text)" } as React.CSSProperties}
      >
        <Header
          avatarName={avatarName}
          avatarImageUrl={avatarImageUrl}
          muted={muted}
          setMuted={setMuted}
          onHistory={() => setShowHistory(true)}
          onClose={onClose}
          subtitleText={strings?.headerSubtitle}
        />

        {/* Splash → Chat animated transition */}
        <AnimateContent
          phase={phase}
          companyName={companyName}
          bannerImageUrl={bannerImageUrl}
          activeChat={activeChat}
          setChats={setChats}
          onRetitle={(title)=>setChats((xs)=>xs.map((c)=>c.id===activeChat.id?{...c,title}:c))}
          play={play}
          versionTag={'v1.0  .'}
          onSendMessage={onSendMessage}
          onSubmitContact={onSubmitContact}
          strings={strings}
        />

        {/* Decorative droplet aligns with horizontal side and vertical position */}
        <div
          className={`absolute h-8 w-8 rounded-full shadow-md ${position.startsWith('top') ? '-top-3' : '-bottom-3'} ${position.endsWith('left') ? '-left-2' : '-right-2'}`}
          style={{ backgroundColor: "var(--aether-bg)" } as React.CSSProperties}
        />
      </div>

      <HistoryDrawer
        show={showHistory}
        chats={guestMode ? chats.filter((c)=>!!c.serverId) : chats}
        activeId={activeChat.id}
        setActiveId={setActiveId}
        onClose={() => setShowHistory(false)}
        onStartNew={() => {
          const id = crypto.randomUUID();
          const now = Date.now();
          const chat: Chat = {
            id,
            createdAt: now,
            title: "Untitled chat",
            messages: [
              {
                id: crypto.randomUUID(),
                role: "assistant",
                content: strings?.initialAssistantMessage || "Welcome! How can I help today?",
                createdAt: now,
              },
            ],
          };
          setChats((xs) => [chat, ...xs]);
          setActiveId(id);
        }}
        titleText={historyTitle}
        onSelectChat={onSelectHistoryChat}
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
  onSendMessage,
  onSubmitContact,
  strings,
}: any) {
  return (
    <>
      {phase === "splash" ? (
        <IntroSplash poweredByBrand={"AetherLink"} />
      ) : (
        <motion.div key="chat" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Banner bannerImageUrl={bannerImageUrl} companyName={companyName} taglineText={strings?.bannerTagline} />
          <ConversationArea
            chat={activeChat}
            onUpdateChat={(chat: any) => setChats((xs: any) => xs.map((c: any) => (c.id === chat.id ? chat : c)))}
            onRetitle={onRetitle}
            onPlay={play}
            onSendMessage={onSendMessage}
            onSubmitContact={onSubmitContact}
            inputPlaceholder={strings?.inputPlaceholder}
            thinkingText={strings?.thinkingLabel}
          />
          <div className="px-4 pb-2">
            <div className="mt-2 flex items-center justify-between text-[11px]" style={{ color: "var(--aether-text)", opacity: 0.7 } as React.CSSProperties}>
               <div className="flex items-center gap-1">
                 <Sparkles className="h-3.5 w-3.5" />
                 <span>
                  {"Powered by"} <span className="font-medium">{"AetherLink"}</span>
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
