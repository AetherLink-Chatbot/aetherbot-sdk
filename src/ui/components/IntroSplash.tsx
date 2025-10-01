import React from "react";
import { motion } from "framer-motion";
import logoUrl from "../../assets/aetherbot-logo.png";

export function IntroSplash() {
  return (
    <motion.div
      key="splash"
      className="flex flex-col items-center justify-center h-[500px] px-6 select-none relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        opacity: { duration: 0.5, ease: "easeInOut" },
        scale: { duration: 0.4, ease: "easeInOut" }
      }}
    >
      {/* Animated background gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-300/20 dark:bg-violet-600/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [-20, 20, -20],
          y: [-20, 20, -20],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-300/20 dark:bg-purple-600/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [20, -20, 20],
          y: [20, -20, 20],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Logo - larger size */}
      <motion.img
        src={logoUrl}
        alt="AetherBot"
        className="h-32 w-32 object-contain relative z-10"
        initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ 
          duration: 0.8,
          ease: [0.34, 1.56, 0.64, 1],
          delay: 0.2
        }}
      />
      
      {/* Text without shimmer */}
      <motion.p 
        className="mt-6 text-sm text-zinc-600 dark:text-zinc-300 relative z-10"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          ease: "easeOut",
          delay: 0.6
        }}
      >
        Powered by <span className="font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">AetherBot</span>
      </motion.p>
    </motion.div>
  );
}