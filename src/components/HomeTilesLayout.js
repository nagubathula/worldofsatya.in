"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { User, MessageSquare, X, Linkedin, Instagram, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FlipCalendarNav from "./FlipCalendarNav";
import { play8BitBlipSound, play8BitTapSound } from "./SoundEffects";

export default function HomeTilesLayout() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactContainerRef = useRef(null);

  // Lock body/html scroll on home so mobile browsers never scroll/rubber-band the viewport
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, []);

  // Close contact menu when clicking outside
  useEffect(() => {
    if (!isContactOpen) return;

    const handlePointerDown = (e) => {
      if (contactContainerRef.current && !contactContainerRef.current.contains(e.target)) {
        setIsContactOpen(false);
        try {
          play8BitTapSound();
        } catch {}
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isContactOpen]);

  const toggleContact = () => {
    const nextState = !isContactOpen;
    setIsContactOpen(nextState);

    // Play click sound feedback
    try {
      if (nextState) {
        play8BitBlipSound(650);
      } else {
        play8BitTapSound();
      }
    } catch {}

    // Haptic feedback on mobile devices
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(18);
      } catch {}
    }
  };

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 w-full h-[100dvh] overflow-hidden overscroll-none touch-none bg-[#f4f4f4] text-[#1d1d1f] flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-5 sm:gap-8 lg:gap-0 px-4 sm:px-8 lg:px-0 select-none"
    >
      {/* Top / Left Column: Author Identity & Action Buttons */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:pl-24 xl:pl-32 shrink-0 z-20 lg:h-full">
        <div>
          <h1 className="text-2xl sm:text-4xl lg:text-[52px] font-semibold tracking-tight text-[#111111] font-sans leading-tight">
            Satya Sai Nagubathula
          </h1>
          
          <p className="text-base sm:text-2xl lg:text-3xl font-normal tracking-tight text-[#8f8f8f] mt-1 sm:mt-2 font-sans">
            Design Technologist
          </p>

          {/* Action buttons row with animated expanding contact options */}
          <div ref={contactContainerRef} className="mt-4 sm:mt-6 lg:mt-8 flex items-center gap-3 sm:gap-4 flex-wrap">
            <Link
              href="/about"
              aria-label="About Satya"
              title="About Satya"
              onClick={() => {
                try {
                  play8BitTapSound();
                } catch {}
              }}
              className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#111111] hover:bg-[#fafafa] hover:scale-105 active:scale-95 transition-all group shrink-0"
            >
              <User size={19} strokeWidth={1.75} className="group-hover:opacity-75 transition-opacity" />
            </Link>

            {/* Contact Toggle Button with animated SVG transition to X */}
            <button
              type="button"
              onClick={toggleContact}
              aria-label={isContactOpen ? "Close contact options" : "Contact options"}
              aria-expanded={isContactOpen}
              title={isContactOpen ? "Close" : "Contact"}
              className={`w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-95 shadow-[0_2px_10px_rgba(0,0,0,0.04)] shrink-0 ${
                isContactOpen
                  ? "bg-[#111111] text-white border border-black shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
                  : "bg-white text-[#111111] border border-black/[0.06] hover:bg-[#fafafa] hover:scale-105"
              }`}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isContactOpen ? 180 : 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-5 h-5 flex items-center justify-center pointer-events-none"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isContactOpen ? (
                    <motion.span
                      key="close-x"
                      initial={{ scale: 0.4, opacity: 0, rotate: -90 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.4, opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="flex items-center justify-center"
                    >
                      <X size={19} strokeWidth={2} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="msg-sq"
                      initial={{ scale: 0.4, opacity: 0, rotate: 90 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.4, opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="flex items-center justify-center"
                    >
                      <MessageSquare size={19} strokeWidth={1.75} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </button>

            {/* Animated Social Channels: LinkedIn, Instagram, Gmail */}
            <AnimatePresence>
              {isContactOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2.5 sm:gap-3"
                >
                  {/* LinkedIn */}
                  <motion.a
                    href="https://www.linkedin.com/in/satyasainagubathula"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                    initial={{ opacity: 0, scale: 0.5, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: -10 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25, delay: 0.02 }}
                    onClick={() => {
                      try {
                        play8BitBlipSound(650);
                      } catch {}
                    }}
                    className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#111111] hover:text-[#0077b5] hover:border-[#0077b5]/30 hover:scale-105 active:scale-95 transition-all group"
                  >
                    <Linkedin size={19} strokeWidth={1.75} className="group-hover:scale-110 transition-transform" />
                  </motion.a>

                  {/* Instagram */}
                  <motion.a
                    href="https://www.instagram.com/satyasainagubathula"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    initial={{ opacity: 0, scale: 0.5, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: -10 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25, delay: 0.06 }}
                    onClick={() => {
                      try {
                        play8BitBlipSound(700);
                      } catch {}
                    }}
                    className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#111111] hover:text-[#e1306c] hover:border-[#e1306c]/30 hover:scale-105 active:scale-95 transition-all group"
                  >
                    <Instagram size={19} strokeWidth={1.75} className="group-hover:scale-110 transition-transform" />
                  </motion.a>

                  {/* Gmail */}
                  <motion.a
                    href="mailto:nagubathula.satyasai@gmail.com"
                    aria-label="Email via Gmail"
                    title="Gmail"
                    initial={{ opacity: 0, scale: 0.5, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: -10 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25, delay: 0.1 }}
                    onClick={() => {
                      try {
                        play8BitBlipSound(750);
                      } catch {}
                    }}
                    className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#111111] hover:text-[#ea4335] hover:border-[#ea4335]/30 hover:scale-105 active:scale-95 transition-all group"
                  >
                    <Mail size={19} strokeWidth={1.75} className="group-hover:scale-110 transition-transform" />
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom / Right Column: 3D Split-Flap Mechanical Flip Calendar */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-2 sm:px-6 lg:pr-20 xl:pr-28 z-10 lg:h-full shrink-0">
        <FlipCalendarNav />
      </div>
    </div>
  );
}
