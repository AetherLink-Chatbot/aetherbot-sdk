import React from "react";
import { motion } from "framer-motion";
import logoUrl from "../../assets/aetherbot-logo.png";

export function IntroSplash({ poweredByBrand = "AetherBot" }: { poweredByBrand?: string }) {
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
      {/* Animated background gradient orbs - using secondary color */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl"
        style={{ 
          backgroundColor: 'var(--aether-secondary)',
          opacity: 0.15
        } as React.CSSProperties}
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
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl"
        style={{ 
          backgroundColor: 'var(--aether-secondary)',
          opacity: 0.12
        } as React.CSSProperties}
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

      {/* Logo with secondary color */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ 
          duration: 0.8,
          ease: [0.34, 1.56, 0.64, 1],
          delay: 0.2
        }}
      >
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="logo-color-filter">
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
              />
              <feComponentTransfer>
                <feFuncR type="identity" />
                <feFuncG type="identity" />
                <feFuncB type="identity" />
                <feFuncA type="identity" />
              </feComponentTransfer>
              <feFlood floodColor="var(--aether-secondary)" />
              <feComposite operator="in" in2="SourceAlpha" />
            </filter>
          </defs>
        </svg>
        <img
          src={logoUrl}
          alt="AetherBot"
          className="h-32 w-32 object-contain"
          style={{
            filter: 'url(#logo-color-filter)'
          } as React.CSSProperties}
        />
      </motion.div>
      
      {/* Text with theme colors */}
      <motion.p 
        className="mt-6 text-sm relative z-10"
        style={{ color: 'var(--aether-text)' } as React.CSSProperties}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          ease: "easeOut",
          delay: 0.6
        }}
      >
        Powered by <span 
          className="font-semibold" 
          style={{ color: 'var(--aether-secondary)' } as React.CSSProperties}
        >
          {poweredByBrand}
        </span>
      </motion.p>
    </motion.div>
  );
}