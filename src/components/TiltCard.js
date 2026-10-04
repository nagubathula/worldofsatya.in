"use client";

import { motion } from "framer-motion";

export default function TiltCard({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full h-full transition-shadow duration-500 hover:shadow-lg rounded-2xl ${className}`}
    >
      <div className="w-full h-full rounded-[inherit]">
        {children}
      </div>
    </motion.div>
  );
}
