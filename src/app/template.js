"use client";

import { motion } from "framer-motion";

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1], // Very smooth out-quart easing
      }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
