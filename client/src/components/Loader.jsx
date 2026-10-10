import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const floatingEmojis = ["🍅", "🥕", "🥬", "🍋", "🫑", "🍊"];

const Loader = () => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-green-tint via-primary-faint to-primary-lightest"
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center relative">
          {/* Spinning Leaf */}
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4"
          >
            <span className="text-6xl block">🌿</span>
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            className="text-5xl font-black text-dark"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Green<span className="text-primary-lighter">Cart</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-text-light mt-2 text-base font-normal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Farm fresh, delivered fast
          </motion.p>

          {/* Progress Bar */}
          <motion.div
            className="w-48 h-1 bg-primary/15 rounded-full mt-8 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary-lighter to-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ delay: 1, duration: 1.6, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Floating Emojis */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {floatingEmojis.map((emoji, i) => (
              <motion.span
                key={i}
                className="absolute text-3xl"
                initial={{ opacity: 0, y: 50, x: (i - 2.5) * 60 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [50, -20, -40, -80],
                  x: (i - 2.5) * 60,
                }}
                transition={{
                  delay: 0.5 + i * 0.2,
                  duration: 2,
                  ease: "easeOut",
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;