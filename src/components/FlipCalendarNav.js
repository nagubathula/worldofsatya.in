"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowUpRight } from "lucide-react";
import ChibiAvatar from "./ChibiAvatar";

export const calendarSections = [
  {
    id: "avatar",
    code: "AVATAR",
    title: "Avatar",
    href: "/about",
    isAvatar: true,
  },
  {
    id: "about-me",
    code: "ABOUT",
    title: "About Me",
    href: "/about",
    image: "/main.jpeg",
  },
  {
    id: "works",
    code: "WORKS",
    title: "Works",
    href: "/works",
    image: "/openweave-app.png",
  },
  {
    id: "case-studies",
    code: "STUDY",
    title: "Case Studies",
    href: "/case-studies",
    image: "/notbad-editor.png",
  },
  {
    id: "contact",
    code: "CONTACT",
    title: "Contact",
    href: "mailto:nagubathula.satyasai@gmail.com",
    isContact: true,
  },
];

// Helper to render the inner content of a flap (either top half or bottom half)
function FlapHalf({ section, half }) {
  const isTop = half === "top";

  return (
    <div
      className={`relative w-full h-[460px] bg-white text-[#111111] flex flex-col justify-between p-7 select-none ${
        isTop ? "translate-y-0" : "-translate-y-1/2"
      }`}
    >
      {section.isAvatar ? (
        <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden">
          {/* Subtle soft studio lighting */}
          <div className="absolute w-[80%] h-[80%] -top-[10%] left-[10%] bg-radial from-amber-100/30 via-slate-100/30 to-transparent blur-2xl pointer-events-none" />

          {/* Top code badge */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="text-xs font-mono font-bold tracking-widest text-[#888888]">
              {section.code}
            </span>
          </div>

          {/* Interactive SVG Chibi Character */}
          <div className="relative flex-1 w-full flex flex-col items-center justify-center z-10">
            <div className="relative w-44 sm:w-52 aspect-[9/16] max-h-[38vh]">
              <ChibiAvatar className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.06)]" />
            </div>
            <div className="w-36 h-2 rounded-full bg-black/[0.07] blur-[3px] mt-0.5" />
          </div>

          {/* Bottom Title */}
          <div className="w-full flex items-center justify-between z-10 pt-2">
            <span className="text-xl font-semibold tracking-tight text-[#111111] font-sans">
              {section.title}
            </span>
            <span className="text-xs font-mono text-[#999999] tracking-widest uppercase">
              Click to view
            </span>
          </div>
        </div>
      ) : section.isContact ? (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          {/* Top code badge */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="text-xs font-mono font-bold tracking-widest text-[#888888]">
              {section.code}
            </span>
          </div>

          {/* Contact Graphic Frame */}
          <div className="relative flex-1 w-full my-2 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1d1d1f] to-[#2c2c2e] text-white p-6 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-3">
              <Mail size={24} className="text-white" />
            </div>
            <h4 className="text-lg font-semibold tracking-tight text-white mb-1">
              Let&apos;s Build Together
            </h4>
            <p className="text-xs text-white/70 max-w-xs font-sans">
              nagubathula.satyasai@gmail.com
            </p>
          </div>

          {/* Bottom Title */}
          <div className="w-full flex items-center justify-between z-10 pt-2">
            <span className="text-xl font-semibold tracking-tight text-[#111111] font-sans">
              {section.title}
            </span>
            <span className="text-xs font-mono text-[#999999] tracking-widest uppercase inline-flex items-center gap-1">
              <span>Send Email</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          {/* Top code badge */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="text-xs font-mono font-bold tracking-widest text-[#888888]">
              {section.code}
            </span>
          </div>

          {/* Preview Image Frame */}
          <div className="relative flex-1 w-full my-2 rounded-2xl overflow-hidden bg-[#f4f4f6] border border-black/[0.04]">
            <Image
              src={section.image}
              alt={section.title}
              fill
              sizes="(max-width: 768px) 90vw, 440px"
              className="object-cover"
            />
          </div>

          {/* Bottom Title */}
          <div className="w-full flex items-center justify-between z-10 pt-2">
            <span className="text-xl font-semibold tracking-tight text-[#111111] font-sans">
              {section.title}
            </span>
            <span className="text-xs font-mono text-[#999999] tracking-widest uppercase">
              Click to view
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlipCalendarNav() {
  const router = useRouter();
  const [currIndex, setCurrIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState("down"); // "down" or "up"

  const total = calendarSections.length;
  const currIndexRef = useRef(0);
  const nextIndexRef = useRef(0);
  const isFlippingRef = useRef(false);
  const flipTimerRef = useRef(null);
  const touchStartY = useRef(0);

  const flipToNext = useCallback(() => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;
    const target = (currIndexRef.current + 1) % total;
    nextIndexRef.current = target;
    setNextIndex(target);
    setDirection("down");
    setIsFlipping(true);

    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    flipTimerRef.current = setTimeout(() => {
      currIndexRef.current = target;
      setCurrIndex(target);
      setIsFlipping(false);
      isFlippingRef.current = false;
    }, 440);
  }, [total]);

  const flipToPrev = useCallback(() => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;
    const target = (currIndexRef.current - 1 + total) % total;
    nextIndexRef.current = target;
    setNextIndex(target);
    setDirection("up");
    setIsFlipping(true);

    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    flipTimerRef.current = setTimeout(() => {
      currIndexRef.current = target;
      setCurrIndex(target);
      setIsFlipping(false);
      isFlippingRef.current = false;
    }, 440);
  }, [total]);

  // Global window wheel listener so scrolling ANYWHERE turns the calendar
  useEffect(() => {
    const handleGlobalWheel = (e) => {
      if (Math.abs(e.deltaY) < 14) return;
      if (isFlippingRef.current) return;

      if (e.deltaY > 0) {
        flipToNext();
      } else {
        flipToPrev();
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleGlobalWheel);
    };
  }, [flipToNext, flipToPrev]);

  // Global touch swipe support
  useEffect(() => {
    const handleGlobalTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleGlobalTouchEnd = (e) => {
      if (isFlippingRef.current) return;
      const diff = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(diff) > 28) {
        if (diff > 0) {
          flipToNext();
        } else {
          flipToPrev();
        }
      }
    };

    window.addEventListener("touchstart", handleGlobalTouchStart, { passive: true });
    window.addEventListener("touchend", handleGlobalTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleGlobalTouchStart);
      window.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [flipToNext, flipToPrev]);

  // Keyboard arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        flipToNext();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        flipToPrev();
      } else if (e.key === "Enter") {
        const item = calendarSections[currIndexRef.current];
        if (item.href.startsWith("mailto:")) {
          window.location.href = item.href;
        } else {
          router.push(item.href);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flipToNext, flipToPrev, router]);

  const currSection = calendarSections[currIndex];
  const nextSection = calendarSections[nextIndex];

  return (
    <div
      data-lenis-prevent="true"
      className="relative w-full h-full flex flex-col items-center justify-center select-none"
    >
      {/* Clean Flip Housing without black line or side clips */}
      <div className="relative p-2.5 sm:p-3 rounded-[38px] bg-gradient-to-b from-[#e8e8ea] to-[#d0d0d4] shadow-[0_30px_70px_rgba(0,0,0,0.12),0_10px_24px_rgba(0,0,0,0.05),inset_0_2px_3px_rgba(255,255,255,0.7)] border border-white/60">
        
        {/* Main Display Area */}
        <div
          onClick={() => {
            if (!isFlippingRef.current) {
              if (currSection.href.startsWith("mailto:")) {
                window.location.href = currSection.href;
              } else {
                router.push(currSection.href);
              }
            }
          }}
          className="relative w-[min(440px,86vw)] h-[min(460px,58vh)] max-h-[460px] rounded-[30px] overflow-hidden bg-white shadow-[0_12px_28px_rgba(0,0,0,0.06)] cursor-pointer group"
          style={{ perspective: "1400px" }}
        >
          {/* ============================================================
              1. STATIC BACKGROUND FLAPS (Clean, no black lines)
             ============================================================ */}
          
          {/* Static Top Half */}
          <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-white rounded-t-[30px]">
            <FlapHalf
              section={isFlipping && direction === "down" ? nextSection : currSection}
              half="top"
            />
          </div>

          {/* Static Bottom Half */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-white rounded-b-[30px]">
            <FlapHalf
              section={isFlipping && direction === "up" ? nextSection : currSection}
              half="bottom"
            />
            {/* Subtle shadow that deepens as the top flap falls */}
            {isFlipping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black pointer-events-none"
              />
            )}
          </div>

          {/* ============================================================
              2. 3D FLIPPING FLAPS (Seamless, no black lines)
             ============================================================ */}
          <AnimatePresence>
            {isFlipping && direction === "down" && (
              <>
                {/* Flap A: Top Half flips DOWN from 0deg to -90deg */}
                <motion.div
                  key={`top-down-${currIndex}-${nextIndex}`}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: -90 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.7, 1] }}
                  style={{
                    transformOrigin: "bottom center",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                  className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-white rounded-t-[30px] z-20"
                >
                  <FlapHalf section={currSection} half="top" />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-black pointer-events-none"
                  />
                </motion.div>

                {/* Flap B: Bottom Half flips DOWN from 90deg to 0deg */}
                <motion.div
                  key={`bottom-down-${currIndex}-${nextIndex}`}
                  initial={{ rotateX: 90 }}
                  animate={{ rotateX: 0 }}
                  transition={{ duration: 0.22, delay: 0.19, ease: [0.15, 0.9, 0.3, 1] }}
                  style={{
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                  className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-white rounded-b-[30px] z-20"
                >
                  <FlapHalf section={nextSection} half="bottom" />
                  <motion.div
                    initial={{ opacity: 0.25 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.22, delay: 0.19 }}
                    className="absolute inset-0 bg-black pointer-events-none"
                  />
                </motion.div>
              </>
            )}

            {isFlipping && direction === "up" && (
              <>
                {/* Reverse Flip (Scrolling Up) */}
                <motion.div
                  key={`bottom-up-${currIndex}-${nextIndex}`}
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: 90 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.7, 1] }}
                  style={{
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                  className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-white rounded-b-[30px] z-20"
                >
                  <FlapHalf section={currSection} half="bottom" />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-black pointer-events-none"
                  />
                </motion.div>

                <motion.div
                  key={`top-up-${currIndex}-${nextIndex}`}
                  initial={{ rotateX: -90 }}
                  animate={{ rotateX: 0 }}
                  transition={{ duration: 0.22, delay: 0.19, ease: [0.15, 0.9, 0.3, 1] }}
                  style={{
                    transformOrigin: "bottom center",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                  className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-white rounded-t-[30px] z-20"
                >
                  <FlapHalf section={nextSection} half="top" />
                  <motion.div
                    initial={{ opacity: 0.25 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.22, delay: 0.19 }}
                    className="absolute inset-0 bg-black pointer-events-none"
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Discrete flip indicator & click navigation hint */}
      <div className="mt-6 flex items-center gap-3 text-xs font-mono text-[#86868b]">
        <button
          onClick={flipToPrev}
          disabled={isFlipping}
          aria-label="Previous date"
          className="hover:text-[#111111] transition-colors p-1"
        >
          ▲
        </button>

        <span className="tracking-widest">
          {String(currIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>

        <button
          onClick={flipToNext}
          disabled={isFlipping}
          aria-label="Next date"
          className="hover:text-[#111111] transition-colors p-1"
        >
          ▼
        </button>
      </div>
    </div>
  );
}
