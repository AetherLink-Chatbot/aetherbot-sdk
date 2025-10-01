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
}: {
  show: boolean;
  chats: Chat[];
  activeId: string;
  setActiveId: (id: string) => void;
  onClose: () => void;
  onStartNew: () => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.aside
            className="absolute right-6 bottom-24 w-[380px] sm:w-[420px] rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden"
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="p-4 flex items-center justify-between border-b border-zinc-200/60 dark:border-white/10">
              <p className="font-semibold">Past chats</p>
              <div className="flex items-center gap-2">
                <button onClick={onStartNew} className="px-3 py-1.5 text-sm rounded-full bg-[var(--aether-primary)] text-white hover:opacity-90">
                  New chat
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
                    setActiveId(c.id);
                    onClose();
                  }}
                  className={classNames(
                    "w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition",
                    c.id === activeId && "bg-zinc-100 dark:bg-white/10"
                  )}
                >
                  <p className="text-sm font-medium truncate">{c.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{new Date(c.createdAt).toLocaleString()}</p>
                </button>
              ))}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

