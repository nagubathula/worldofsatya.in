"use client";

import { motion } from "framer-motion";
import { useMagnetic } from "@/lib/useMagnetic";

// Wrap any link or button to have it lean toward the cursor on hover.
export default function Magnetic({ children, max, strength, className = "" }) {
  const magnet = useMagnetic({ max, strength });

  return (
    <motion.span
      style={{ x: magnet.x, y: magnet.y }}
      onPointerMove={magnet.move}
      onPointerLeave={magnet.reset}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}
