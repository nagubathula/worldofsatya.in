"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import { play8BitTapSound, playPopSound } from "./SoundEffects";
import { SPRING } from "@/lib/motion";
import { useMagnetic } from "@/lib/useMagnetic";
import HoverLabel from "./HoverLabel";

// Opens the gallery. Same tile as About and contact; the icon is a small stack
// of prints that fans out on hover, like the works fan.
export default function GalleryButton() {
    const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Leans toward the cursor; the icon inside follows by a fraction for parallax.
  const magnet = useMagnetic();
  const magneticX = magnet.x;
  const magneticY = magnet.y;
  const printX = useTransform(magneticX, (val) => val * 0.45);
  const printY = useTransform(magneticY, (val) => val * 0.45);

  const handleMouseEnter = () => {
    setIsHovered(true);
    try {
      play8BitTapSound();
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
        href="/gallery"
        aria-label="Gallery"
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
            width="26"
            height="26"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
            style={{ x: printX, y: printY }}
          >
            {/* Back print: tips out to the left */}
            <motion.rect
              x="7"
              y="7"
              width="16"
              height="19"
              rx="3"
              fill="#ffffff"
              stroke="#1d1d1f"
              strokeWidth="2"
              style={{ originX: "50%", originY: "100%" }}
              animate={{ rotate: isHovered ? -16 : -8, x: isHovered ? -2.5 : -1 }}
              transition={SPRING.pop}
            />

            {/* Front print: a little picture of hills and a sun */}
            <motion.g
              style={{ originX: "50%", originY: "100%" }}
              animate={{ rotate: isHovered ? 9 : 4, x: isHovered ? 2 : 1, y: isHovered ? -1 : 0 }}
              transition={SPRING.pop}
            >
              <rect x="9" y="6" width="16" height="20" rx="3" fill="#ffffff" stroke="#1d1d1f" strokeWidth="2" />
              <path d="M11.5 21.5L15 17.5L17.5 20L19.5 18L22.5 21.5" stroke="#1d1d1f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              <motion.circle
                cx="20"
                cy="11.5"
                r="1.8"
                fill="#2ec4f0"
                animate={{ scale: isHovered ? [1, 1.25, 1] : 1 }}
                transition={{ duration: 1.6, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
              />
            </motion.g>
          </motion.svg>
        </motion.div>

        {/* Micro Bevel Gloss Highlight */}
        <div className="absolute inset-0 rounded-2xl border border-white/60 pointer-events-none" />
      </Link>
      <HoverLabel>Gallery</HoverLabel>
    </motion.div>
  );
}
