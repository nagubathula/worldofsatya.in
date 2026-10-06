"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * Rive-Style Living Vector Compass
 * Needle drifts naturally, reacts to hover with momentum spin & magnetic oscillation
 */
export function RiveCompass({ size = 22, className = "" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`overflow-visible select-none cursor-pointer ${className}`}
    >
      {/* Outer Dial Circle with Breathing Ambient Pulse */}
      <motion.circle
        cx="12"
        cy="12"
        r="9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        animate={{
          scale: hovered ? [1, 1.08, 1.02] : 1,
        }}
        transition={{ duration: 0.4 }}
        className="opacity-75"
      />

      {/* 4 Cardinal Tick Marks */}
      <line x1="12" y1="3" x2="12" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-50" />
      <line x1="12" y1="19.5" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-50" />
      <line x1="3" y1="12" x2="4.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-50" />
      <line x1="19.5" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-50" />

      {/* Living Magnetic Needle (Rotates on hover with damping) */}
      <motion.g
        animate={{
          rotate: hovered ? [0, 85, -25, 12, 0] : [0, 4, -4, 0],
        }}
        transition={
          hovered
            ? { duration: 1.2, ease: "easeOut" }
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ originX: "12px", originY: "12px" }}
      >
        {/* North Needle Tip (Vibrant Blue) */}
        <polygon points="12,5 14,12 12,10.5 10,12" fill="#0071e3" />
        {/* South Needle Tip */}
        <polygon points="12,19 14,12 12,13.5 10,12" fill="currentColor" className="opacity-60" />
        {/* Center Pivot Jewel */}
        <circle cx="12" cy="12" r="1.5" fill="#1d1d1f" />
      </motion.g>
    </motion.svg>
  );
}

/**
 * Rive-Style Living 3D Layer Stack
 * Layers expand with spatial depth parallax on hover
 */
export function RiveLayers({ size = 22, className = "" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`overflow-visible select-none cursor-pointer ${className}`}
    >
      {/* Bottom Layer */}
      <motion.path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          y: hovered ? 2.5 : 0,
          opacity: hovered ? 0.9 : 0.6,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
      />

      {/* Middle Layer */}
      <motion.path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          y: hovered ? 0 : 0,
          opacity: hovered ? 1 : 0.8,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 20 }}
      />

      {/* Top Floating Diamond Plate */}
      <motion.path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="#0071e3"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={hovered ? "rgba(0, 113, 227, 0.08)" : "none"}
        animate={{
          y: hovered ? -3.5 : [0, -1, 0],
          scale: hovered ? 1.05 : 1,
        }}
        transition={
          hovered
            ? { type: "spring", stiffness: 400, damping: 18 }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </motion.svg>
  );
}

/**
 * Rive-Style Living Code Terminal Brackets
 * Left and right brackets breathe and separate on hover with blinking slash
 */
export function RiveCode({ size = 22, className = "" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`overflow-visible select-none cursor-pointer ${className}`}
    >
      {/* Left Bracket < */}
      <motion.path
        d="M8 6L2 12L8 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          x: hovered ? -2.5 : [0, -0.6, 0],
        }}
        transition={
          hovered
            ? { type: "spring", stiffness: 450, damping: 18 }
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* Center Slash / */}
      <motion.line
        x1="14.5"
        y1="4.5"
        x2="9.5"
        y2="19.5"
        stroke="#0071e3"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{
          rotate: hovered ? [0, 8, -8, 0] : 0,
          opacity: [0.7, 1, 0.7],
        }}
        transition={
          hovered
            ? { duration: 0.8, ease: "easeInOut" }
            : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
        }
        style={{ originX: "12px", originY: "12px" }}
      />

      {/* Right Bracket > */}
      <motion.path
        d="M16 6L22 12L16 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          x: hovered ? 2.5 : [0, 0.6, 0],
        }}
        transition={
          hovered
            ? { type: "spring", stiffness: 450, damping: 18 }
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </motion.svg>
  );
}
