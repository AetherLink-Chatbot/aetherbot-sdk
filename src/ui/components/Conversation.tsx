import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Chat, Message } from "../types";
import { classNames, generateMockAnswer, timeAgo } from "../utils";

export function ConversationArea({
  chat,
  onUpdateChat,
  onRetitle,
  onPlay,
}: {
  chat: Chat;
  onUpdateChat: (chat: Chat) => void;
  onRetitle: (title: string) => void;
  onPlay: (freq?: number) => void;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [chat.messages.length, busy]);

  const send = () => {
    if (!input.trim() || busy) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      createdAt: Date.now(),
    };

    const thinking: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "Thinking…",
      createdAt: Date.now(),
      thinking: true,
    };

    const updated: Chat = { ...chat, messages: [...chat.messages, userMsg, thinking] };
    onUpdateChat(updated);
    onPlay?.(560);
    setInput("");
    setBusy(true);

    if (chat.title === "New chat") {
      onRetitle(userMsg.content.slice(0, 36));
    }

    const replyIn = 1200 + Math.random() * 1000;
    setTimeout(() => {
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          generateMockAnswer(userMsg.content) ||
          "Thanks! I’m checking that and will get back to you.",
        createdAt: Date.now(),
      };
      const next: Chat = {
        ...updated,
        messages: updated.messages.map((m) => (m.thinking ? assistantMsg : m)),
      };
      onUpdateChat(next);
      onPlay?.(760);
      setBusy(false);
    }, replyIn);
  };

  return (
    <div className="mt-3 flex flex-col h-[46vh]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 space-y-3">
        {chat.messages.map((m) => (
          <MessageBubble key={m.id} msg={m} />
        ))}
      </div>

      <div className="px-4 pt-2 pb-4">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
            placeholder="Type message..."
            className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[var(--aether-primary)]/30 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
          />
          <button
            onClick={send}
            className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-[var(--aether-primary)] text-white grid place-items-center hover:opacity-90 active:scale-95 transition"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: any }) {
  const isUser = msg.role === "user";
  return (
    <div className={classNames("flex", isUser ? "justify-end" : "justify-start")}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className={classNames(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
          isUser
            ? "bg-[var(--aether-primary)] text-white"
            : "bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
        )}
      >
        {msg.thinking ? <ThinkingRow /> : <span>{msg.content}</span>}
        <div className={classNames("mt-1 text-[10px] opacity-70", isUser ? "text-white" : "text-zinc-500 dark:text-zinc-400")}> 
          {timeAgo(msg.createdAt)}
        </div>
      </motion.div>
    </div>
  );
}

function ThinkingRow() {
  return (
    <div className="flex items-center gap-2">
      <DotsLoader />
      <span className="text-zinc-500 dark:text-zinc-400">Thinking…</span>
    </div>
  );
}

function DotsLoader() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-zinc-400/70 inline-block"
          style={{ animation: `aether-bounce 1.2s ${i * 0.12}s infinite` }}
        />
      ))}
      <style>{`
        @keyframes aether-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: .6 }
          40% { transform: translateY(-3px); opacity: 1 }
        }
      `}</style>
    </div>
  );
}
