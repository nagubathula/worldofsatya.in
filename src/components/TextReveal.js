"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function TextReveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "120%", rotate: 2 }}
        animate={isInView ? { y: 0, rotate: 0 } : { y: "120%", rotate: 2 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.76, 0, 0.24, 1],
          delay: delay
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
