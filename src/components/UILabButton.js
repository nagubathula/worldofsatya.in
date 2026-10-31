"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import { playTickSound, playPopSound } from "./SoundEffects";
import { SPRING } from "@/lib/motion";
import { useMagnetic } from "@/lib/useMagnetic";
import HoverLabel from "./HoverLabel";

// Opens the UI lab. Same tile as About and Gallery; the icon is a little switch
// that a cursor clicks on when you hover, since everything in the lab is live.
export default function UILabButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Leans toward the cursor; the icon inside follows by a fraction for parallax.
  const magnet = useMagnetic();
  const magneticX = magnet.x;
  const magneticY = magnet.y;
  const iconX = useTransform(magneticX, (val) => val * 0.45);
  const iconY = useTransform(magneticY, (val) => val * 0.45);

  const handleMouseEnter = () => {
    setIsHovered(true);
    try {
      playTickSound();
    } catch {}
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    magnet.reset();
  };

  const handleMouseDown = () => {
    setIsPressed(true);
    try {
      playPopSound(620, 0.08);
    } catch {}
  };

  return (
    <motion.div style={{ x: magneticX, y: magneticY }} className="group/label relative shrink-0 select-none">
      <Link
        href="/ui"
        aria-label="UI lab"
        onPointerMove={magnet.move}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={() => setIsPressed(false)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-2xl border border-black/[0.08] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 overflow-hidden"
      >
        {/* Ambient Glow on Hover */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2ec4f0]/10 via-transparent to-[#2ec4f0]/5 pointer-events-none"
        />

        {/* Button body with squash and stretch */}
        <motion.div
          animate={
            isPressed
              ? { scaleX: 1.08, scaleY: 0.88, y: 2 }
              : isHovered
              ? { scaleX: 1.03, scaleY: 1.03, y: -1 }
              : { scaleX: 1, scaleY: 1, y: 0 }
          }
          transition={SPRING.pop}
          className="relative flex h-full w-full items-center justify-center pointer-events-none"
        >
          <motion.svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
            style={{ x: iconX, y: iconY }}
          >
            {/* The switch: its track fills in as the knob slides across */}
            <motion.rect
              x="3"
              y="8"
              width="22"
              height="12"
              rx="6"
              stroke="#1d1d1f"
              strokeWidth="2"
              animate={{ fill: isHovered ? "#2ec4f0" : "#ffffff" }}
              transition={{ duration: 0.2, delay: isHovered ? 0.18 : 0 }}
            />
            <motion.circle
              cy="14"
              r="3.6"
              fill="#1d1d1f"
              animate={{ cx: isHovered ? 19 : 9 }}
              transition={{ ...SPRING.pop, delay: isHovered ? 0.18 : 0 }}
            />

            {/* The cursor comes in from below and taps the switch */}
            <motion.path
              d="M0 0L0 10.5L2.8 8L4.6 12L6.4 11.2L4.6 7.3L8.2 7.1Z"
              fill="#ffffff"
              stroke="#1d1d1f"
              strokeWidth="1.5"
              strokeLinejoin="round"
              animate={
                isHovered
                  ? { x: [24, 17, 17.5], y: [26, 15, 16], scale: [1, 0.85, 1] }
                  : { x: 22, y: 19, scale: 1 }
              }
              transition={isHovered ? { duration: 0.4, times: [0, 0.55, 1], ease: "easeOut" } : SPRING.pop}
            />
          </motion.svg>
        </motion.div>

        {/* Micro Bevel Gloss Highlight */}
        <div className="absolute inset-0 rounded-2xl border border-white/60 pointer-events-none" />
      </Link>
      <HoverLabel>UI lab</HoverLabel>
    </motion.div>
  );
}
