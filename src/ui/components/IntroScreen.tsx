import React from "react";
import { motion } from "framer-motion";

export function IntroScreen({ companyName }: { companyName: string }) {
  return (
    <div className="px-6 py-10 text-center select-none">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mx-auto h-16 w-16 rounded-2xl grid place-items-center text-[var(--aether-primary)] border-2 border-current/40">
          {/* simple network-like icon using dots/lines */}
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6" cy="12" r="2" />
            <circle cx="12" cy="6" r="2" />
            <circle cx="18" cy="12" r="2" />
            <circle cx="12" cy="18" r="2" />
            <path d="M8 11 L10 8 M14 8 L16 11 M8 13 L10 16 M14 16 L16 13" />
          </svg>
        </div>
        <h3 className="mt-6 text-lg font-semibold">Let’s Chat, Your Way</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
          This chatbot adapts to your style of conversation, offering a helpful and personal experience.
        </p>
      </motion.div>
      <div className="mt-6 flex justify-center">
        <Spinner />
      </div>
      <p className="mt-10 text-[11px] text-zinc-500 dark:text-zinc-400">{companyName}</p>
    </div>
  );
}

function Spinner() {
  return (
    <div className="h-5 w-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-[var(--aether-primary)] rounded-full animate-spin" />
  );
}

