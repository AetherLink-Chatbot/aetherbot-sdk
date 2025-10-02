import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

// Avatar Component
function AvatarImg({ src, alt, className }) {
  return (
    <img 
      src={src || "https://api.dicebear.com/7.x/avataaars/svg?seed=chatbot"} 
      alt={alt} 
      className={className}
    />
  );
}

export function Launcher({
  open = false,
  onToggle = () => {},
  avatarImageUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=chatbot",
  titleText = "Let's Chat, Your Way",
  subtitleText = "This chatbot adapts to your style of conversation.",
}: {
  open?: boolean;
  onToggle?: () => void;
  avatarImageUrl?: string;
  titleText?: string;
  subtitleText?: string;
}) {
  return (
    <div className="pointer-events-auto fixed bottom-6 right-6 z-[61]">
      <AnimatePresence mode="wait">
        {!open && (
          <LauncherCard 
            onClick={onToggle} 
            avatarImageUrl={avatarImageUrl}
            titleText={titleText}
            subtitleText={subtitleText}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {open && (
          <motion.button
            key="launcher-close"
            aria-label="Close chat"
            onClick={onToggle}
            className="h-14 w-14 rounded-full grid place-items-center shadow-xl transition-colors"
            style={{ backgroundColor: "var(--aether-secondary)", color: '#ffffff' } as React.CSSProperties}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Launcher;

function LauncherCard({
  onClick,
  avatarImageUrl,
  titleText,
  subtitleText,
}: any) {
  return (
    <motion.div
      key="launcher-card"
      className="relative"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
    >
      {/* Main Card */}
      <motion.button
        onClick={onClick}
        className="relative flex items-center gap-3 rounded-2xl shadow-xl px-4 py-3.5 pr-[5rem] text-left hover:shadow-2xl transition-shadow border"
        style={{ backgroundColor: 'var(--aether-bg)', color: 'var(--aether-text)', borderColor: 'rgba(0,0,0,0.12)' } as React.CSSProperties}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Avatar with subtle animation */}
        <motion.div className="relative shrink-0" whileHover={{ scale: 1.05 }}>
          <AvatarImg 
            src={avatarImageUrl} 
            alt="Chatbot Avatar" 
            className="h-12 w-12 rounded-full" 
          />
          <span className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 0 2px var(--aether-secondary) inset" } as React.CSSProperties} />
          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full" style={{ backgroundColor: '#10b981', boxShadow: '0 0 0 2px var(--aether-bg)' } as React.CSSProperties} />
        </motion.div>

        {/* Text content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--aether-text)' } as React.CSSProperties}>
            {titleText}
          </p>
          <p className="text-xs leading-snug line-clamp-2" style={{ color: 'var(--aether-text)', opacity: 0.8 } as React.CSSProperties}>
            {subtitleText}
          </p>
        </div>
      </motion.button>

      {/* Floating Message Icon */}
      <motion.div
        className="absolute right-2 top-1/2 h-14 w-14 rounded-full grid place-items-center shadow-lg cursor-pointer"
        style={{ transform: "translateY(-50%)", backgroundColor: "var(--aether-secondary)", color: '#ffffff' } as React.CSSProperties}
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
        >
          <MessageCircle className="h-6 w-6" />
        </motion.div>
        
        {/* Ping effect */}
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: "var(--aether-secondary)" } as React.CSSProperties}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.div>
    </motion.div>
  );
}
