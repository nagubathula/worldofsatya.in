"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { play8BitTapSound, playPopSound } from "./SoundEffects";

/**
 * Reusable Rive-Style State Machine Button
 * - Magnetic cursor attraction
 * - Fluid squash & stretch physics on press
 * - Directional ambient aura
 * - Micro-spring recoil & haptic sound feedback
 */
export default function RiveButton({
  href,
  onClick,
  children,
  className = "",
  variant = "primary", // 'primary' | 'secondary' | 'glass' | 'pill'
  magnetic = true,
  sound = true,
  target,
  rel,
  ...props
}) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Magnetic cursor spring tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 14, stiffness: 280, mass: 0.2 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!magnetic || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Normalized magnetic pull (-8px to +8px)
    mouseX.set(Math.max(-8, Math.min(8, (e.clientX - centerX) * 0.2)));
    mouseY.set(Math.max(-8, Math.min(8, (e.clientY - centerY) * 0.2)));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (sound) {
      try {
        play8BitTapSound();
      } catch {}
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
    if (sound) {
      try {
        playPopSound(540, 0.09);
      } catch {}
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  // Variant styling
  const variantStyles = {
    primary:
      "bg-[#1d1d1f] text-white hover:bg-[#333336] shadow-[0_2px_12px_rgba(0,0,0,0.08)]",
    secondary:
      "bg-[#f5f5f7] text-[#1d1d1f] border border-black/[0.06] hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)]",
    glass:
      "bg-white/80 backdrop-blur-md text-[#1d1d1f] border border-black/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.04)]",
    pill:
      "bg-white text-[#1d1d1f] border border-black/[0.06] shadow-sm",
  };

  const content = (
    <motion.span
      animate={
        isPressed
          ? { scaleX: 1.06, scaleY: 0.9, y: 1.5 }
          : isHovered
          ? { scaleX: 1.02, scaleY: 1.02, y: -0.5 }
          : { scaleX: 1, scaleY: 1, y: 0 }
      }
      transition={{ type: "spring", stiffness: 450, damping: 18 }}
      className="relative z-10 flex items-center justify-center gap-2 w-full h-full"
    >
      {children}
    </motion.span>
  );

  const wrapperProps = {
    ref: buttonRef,
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    style: {
      x: magnetic ? magneticX : 0,
      y: magnetic ? magneticY : 0,
    },
    className: `relative inline-flex items-center justify-center select-none overflow-hidden rounded-full font-medium transition-colors ${
      variantStyles[variant] || variantStyles.primary
    } ${className}`,
    ...props,
  };

  if (href) {
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return (
        <motion.a href={href} target={target} rel={rel} onClick={onClick} {...wrapperProps}>
          {/* Micro ambient glow overlay */}
          <motion.span
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1.05 : 0.9,
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/15 via-transparent to-emerald-500/15 pointer-events-none"
          />
          {content}
        </motion.a>
      );
    }

    return (
      <Link href={href} onClick={onClick} passHref legacyBehavior>
        <motion.a {...wrapperProps}>
          <motion.span
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1.05 : 0.9,
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/15 via-transparent to-emerald-500/15 pointer-events-none"
          />
          {content}
        </motion.a>
      </Link>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} {...wrapperProps}>
      <motion.span
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.05 : 0.9,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/15 via-transparent to-emerald-500/15 pointer-events-none"
      />
      {content}
    </motion.button>
  );
}
