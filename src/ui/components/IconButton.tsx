import React from "react";

export function IconButton({ label, onClick, children }: any) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition"
    >
      {children}
    </button>
  );
}

