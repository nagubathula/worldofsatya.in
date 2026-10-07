"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useSpring, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { play8BitTapSound, playPopSound } from "./SoundEffects";

export default function RiveAboutButton({ showFace = false }) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [blink, setBlink] = useState(false);

  // Magnetic cursor spring tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 260, mass: 0.2 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  // Parallax shifts for interior vector layers
  const faceX = useTransform(magneticX, (val) => val * 0.45);
  const faceY = useTransform(magneticY, (val) => val * 0.45);
  const eyeShiftX = useTransform(magneticX, (val) => val * 0.65);
  const eyeShiftY = useTransform(magneticY, (val) => val * 0.65);

  // Periodic blinking state machine
  useEffect(() => {
    const triggerBlink = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        triggerBlink();
      }
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Normalized magnetic pull (-10px to +10px)
    mouseX.set(Math.max(-10, Math.min(10, (e.clientX - centerX) * 0.25)));
    mouseY.set(Math.max(-10, Math.min(10, (e.clientY - centerY) * 0.25)));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    try {
      play8BitTapSound();
    } catch {}
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
    try {
      playPopSound(580, 0.08);
    } catch {}
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <motion.div
      style={{
        x: magneticX,
        y: magneticY,
      }}
      className="relative shrink-0 select-none"
    >
      <Link
        ref={buttonRef}
        href="/about#two-truths"
        aria-label="About Satya — Two Truths & One Lie"
        title="About Satya — Two Truths & One Lie"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="group relative flex h-14 w-14 items-center justify-center rounded-2xl border border-black/[0.08] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 overflow-hidden"
      >
        {/* Living Ambient Glow on Hover */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 pointer-events-none"
        />

        {/* Tactile Button Body with Fluid Squash & Stretch */}
        <motion.div
          animate={
            isPressed
              ? { scaleX: 1.08, scaleY: 0.88, y: 2 }
              : isHovered
              ? { scaleX: 1.03, scaleY: 1.03, y: -1 }
              : { scaleX: 1, scaleY: 1, y: 0 }
          }
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 18,
          }}
          className="relative flex items-center justify-center w-full h-full pointer-events-none"
        >
          <AnimatePresence mode="wait" initial={false}>
            {!showFace ? (
              <motion.div
                key="icon-state"
                initial={{ opacity: 0, scale: 0.75, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.75, rotate: 8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex items-center justify-center w-full h-full"
              >
                {/* Animated Rive-Style Vector Character Avatar */}
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible"
                >
                  {/* Ambient Aura Ripple on Hover */}
                  <motion.circle
                    cx="16"
                    cy="16"
                    r="14"
                    initial={false}
                    animate={{
                      opacity: isHovered ? [0.15, 0.4, 0.15] : 0,
                      scale: isHovered ? [0.95, 1.15, 0.95] : 0.9,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="fill-black/[0.04]"
                  />

                  {/* Torso / Shoulders with gentle breathing bob */}
                  <motion.path
                    d="M7 27C7 22.8 10.8 20 16 20C21.2 20 25 22.8 25 27"
                    stroke="#1d1d1f"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    animate={{
                      y: isPressed ? 1.5 : isHovered ? [0, -0.6, 0] : 0,
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Parallax Moving Head Container */}
                  <motion.g
                    style={{
                      x: faceX,
                      y: faceY,
                    }}
                    animate={
                      isPressed
                        ? { scale: 0.95, y: 1 }
                        : isHovered
                        ? { y: [0, -1, 0], rotate: [0, -2, 2, 0] }
                        : { y: 0, rotate: 0 }
                    }
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Head Circle */}
                    <circle
                      cx="16"
                      cy="11.5"
                      r="5.7"
                      fill="#ffffff"
                      stroke="#1d1d1f"
                      strokeWidth="2.2"
                    />

                    {/* Eyes with Parallax Gaze & Natural Blinking */}
                    <motion.g
                      style={{
                        x: eyeShiftX,
                        y: eyeShiftY,
                      }}
                    >
                      {/* Left Eye */}
                      <motion.circle
                        cx="14"
                        cy="11.5"
                        r="1.1"
                        fill="#1d1d1f"
                        animate={{
                          scaleY: blink ? 0.1 : 1,
                        }}
                        transition={{ duration: 0.08 }}
                      />

                      {/* Right Eye */}
                      <motion.circle
                        cx="18"
                        cy="11.5"
                        r="1.1"
                        fill="#1d1d1f"
                        animate={{
                          scaleY: blink ? 0.1 : 1,
                        }}
                        transition={{ duration: 0.08 }}
                      />

                      {/* Smiling Expression Arc */}
                      <motion.path
                        d="M14.5 13.8C15 14.4 17 14.4 17.5 13.8"
                        stroke="#1d1d1f"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        animate={{
                          d: isHovered
                            ? "M14.2 13.5C14.8 14.6 17.2 14.6 17.8 13.5"
                            : "M14.5 13.8C15 14.4 17 14.4 17.5 13.8",
                        }}
                      />
                    </motion.g>

                    {/* Tiny Thought Sparkle on Hover */}
                    <motion.g
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        scale: isHovered ? [0, 1.2, 1] : 0,
                        rotate: isHovered ? [0, 90] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <path
                        d="M23 5L23.6 6.4L25 7L23.6 7.6L23 9L22.4 7.6L21 7L22.4 6.4L23 5Z"
                        fill="#0071e3"
                      />
                    </motion.g>
                  </motion.g>
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="face-state"
                initial={{ opacity: 0, scale: 0.75, rotate: 8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.75, rotate: -8 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex items-center justify-center w-full h-full"
              >
                {/* Illustrated Chibi Vector Face Avatar */}
                <motion.div
                  style={{
                    x: faceX,
                    y: faceY,
                  }}
                  animate={
                    isPressed
                      ? { scale: 0.94 }
                      : isHovered
                      ? { scale: 1.08, rotate: [0, -2, 2, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{
                    scale: { type: "spring", stiffness: 400, damping: 20 },
                    rotate: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center"
                >
                  <Image
                    src="/images/hero/SVG/vector-avatar.png"
                    alt="Satya's face avatar"
                    width={40}
                    height={40}
                    priority
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)] pointer-events-none"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Micro Bevel Gloss Highlight */}
        <div className="absolute inset-0 rounded-2xl border border-white/60 pointer-events-none" />
      </Link>
    </motion.div>
  );
}
