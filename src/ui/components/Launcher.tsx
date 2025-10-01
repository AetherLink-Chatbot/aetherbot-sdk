import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

// Placeholder Avatar Component
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
}) {
  return (
    <div className="pointer-events-auto fixed bottom-6 right-6 z-[61]">
      <AnimatePresence mode="wait">
        {!open && (
          <LauncherCard 
            onClick={onToggle} 
            avatarImageUrl={avatarImageUrl} 
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {open && (
          <motion.button
            key="launcher-close"
            aria-label="Close chat"
            onClick={onToggle}
            className="h-14 w-14 rounded-full grid place-items-center bg-violet-600 text-white shadow-xl hover:bg-violet-700 transition-colors"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function LauncherCard({
  onClick,
  avatarImageUrl,
}) {
  return (
    <motion.div
      key="launcher-card"
      className="relative"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Main Card */}
      <motion.button
        onClick={onClick}
        className="relative flex items-center gap-3 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl px-4 py-3.5 pr-20 text-left border border-zinc-200/70 dark:border-zinc-700/50 hover:shadow-2xl transition-shadow"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Avatar with subtle animation */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
        >
          <AvatarImg 
            src={avatarImageUrl} 
            alt="Chatbot Avatar" 
            className="h-12 w-12 rounded-full ring-2 ring-violet-100 dark:ring-violet-900/30" 
          />
          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
        </motion.div>

        {/* Text content */}
        <div className="max-w-[220px]">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-0.5">
            Let's Chat, Your Way
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            This chatbot adapts to your style of conversation.
          </p>
        </div>
      </motion.button>

      {/* Floating Message Icon - properly positioned outside card */}
      <motion.div
        className="absolute -right-3 top-1/2 h-14 w-14 rounded-full grid place-items-center text-white bg-gradient-to-br from-violet-600 to-purple-700 shadow-lg cursor-pointer"
        style={{ transform: 'translateY(-50%)' }}
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 4px 14px rgba(124, 58, 237, 0.4)",
            "0 4px 24px rgba(124, 58, 237, 0.6)",
            "0 4px 14px rgba(124, 58, 237, 0.4)",
          ],
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            repeatDelay: 1
          }}
        >
          <MessageCircle className="h-6 w-6" />
        </motion.div>
        
        {/* Ping effect */}
        <motion.span
          className="absolute inset-0 rounded-full bg-violet-400"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeOut" 
          }}
        />
      </motion.div>
    </motion.div>
  );
}

