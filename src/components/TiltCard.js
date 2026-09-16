"use client";

import { motion } from "framer-motion";

export default function TiltCard({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative w-full h-full transition-shadow duration-300 hover:shadow-lg rounded-2xl ${className}`}
    >
      <div className="w-full h-full rounded-[inherit]">
        {children}
      </div>
    </motion.div>
  );
}
