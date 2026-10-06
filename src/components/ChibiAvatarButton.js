"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useSpring, useMotionValue } from "framer-motion";
import ChibiAvatar from "./ChibiAvatar";
import { playPopSound } from "./SoundEffects";

/**
 * ChibiAvatarButton
 * High-performance interactive button featuring the clean comic chibi avatar from Vector.svg.
 * Equipped with magnetic spring tracking, dynamic eye deflection, tactile press squash, and haptics.
 */
export default function ChibiAvatarButton({
  href,
  onClick,
  label = "Hello!",
  showLabel = false,
  size = 64, // button diameter in pixels
  className = "",
  sound = true,
  ...props
}) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Magnetic spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 18, stiffness: 260, mass: 0.3 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(Math.max(-10, Math.min(10, (e.clientX - centerX) * 0.25)));
    mouseY.set(Math.max(-10, Math.min(10, (e.clientY - centerY) * 0.25)));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (sound) {
      try {
        playPopSound(540, 0.05);
      } catch {}
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handlePointerDown = () => {
    setIsPressed(true);
    if (sound) {
      try {
        playPopSound(720, 0.08);
      } catch {}
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const content = (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{
        x: magneticX,
        y: magneticY,
      }}
      animate={{
        scale: isPressed ? 0.92 : isHovered ? 1.08 : 1,
        rotate: isHovered ? 3 : 0,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`group relative inline-flex items-center gap-3 cursor-pointer select-none ${className}`}
      {...props}
    >
      {/* Badge Ring with Chibi Avatar */}
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-700 shadow-md group-hover:shadow-xl group-hover:border-neutral-400 dark:group-hover:border-neutral-500 transition-shadow duration-300 overflow-hidden"
      >
        {/* Subtle Ambient Pulse on Hover */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Vector SVG Avatar */}
        <div className="w-[82%] h-[82%] relative flex items-center justify-center pointer-events-none">
          <ChibiAvatar className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Optional Label / Tooltip */}
      {showLabel && (
        <span className="text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white transition-colors duration-200">
          {label}
        </span>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="inline-block no-underline">
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-transparent border-none p-0 inline-block text-left"
    >
      {content}
    </button>
  );
}
