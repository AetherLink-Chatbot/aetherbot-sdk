import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Chat } from "../types";
import { classNames } from "../utils";

export function HistoryDrawer({
  show,
  chats,
  activeId,
  setActiveId,
  onClose,
  onStartNew,
  titleText,
  newChatText,
  onSelectChat,
}: {
  show: boolean;
  chats: Chat[];
  activeId: string;
  setActiveId: (id: string) => void;
  onClose: () => void;
  onStartNew: () => void;
  titleText?: string;
  newChatText?: string;
  onSelectChat?: (chat: Chat) => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.aside
            className="absolute right-6 bottom-24 w-[380px] sm:w-[420px] rounded-3xl shadow-2xl overflow-hidden"
            style={{ backgroundColor: "var(--aether-bg)", color: "var(--aether-text)" } as React.CSSProperties}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="p-4 flex items-center justify-between border-b border-zinc-200/60 dark:border-white/10">
              <p className="font-semibold">{titleText || "Past chats"}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={onStartNew}
                  className="px-3 py-1.5 text-sm rounded-full text-white hover:opacity-90"
                  style={{ backgroundColor: "var(--aether-secondary)" } as React.CSSProperties}
                >
                  {newChatText || "New chat"}
                </button>
                <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full hover:bg-zinc-100 dark:hover:bg-white/10" aria-label="Close history">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[56vh] overflow-y-auto p-2">
              {chats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectChat?.(c);
                    setActiveId(c.id);
                    onClose();
                  }}
                  className={classNames(
                    "w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition",
                    c.id === activeId && "bg-zinc-100 dark:bg-white/10"
                  )}
                >
                  <p className="text-sm font-medium truncate">{c.title}</p>
                  <p className="text-xs" style={{ color: "var(--aether-text)", opacity: 0.7 } as React.CSSProperties}>
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
