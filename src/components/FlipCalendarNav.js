"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowUpRight, Smartphone } from "lucide-react";
import ChibiAvatar from "./ChibiAvatar";
import { play8BitBlipSound } from "./SoundEffects";

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
      className={`relative w-full h-[200%] bg-white text-[#111111] flex flex-col justify-between p-4 sm:p-6 lg:p-7 select-none ${
        isTop ? "translate-y-0" : "-translate-y-1/2"
      }`}
    >
      {section.isAvatar ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
          {/* Subtle soft studio lighting */}
          <div className="absolute w-[85%] h-[85%] -top-[5%] left-[7.5%] bg-radial from-amber-100/35 via-slate-100/35 to-transparent blur-2xl pointer-events-none" />

          {/* Interactive SVG Chibi Character */}
          <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
            <div className="relative w-40 sm:w-48 lg:w-56 aspect-[9/16] max-h-[30vh] sm:max-h-[36vh] lg:max-h-[42vh]">
              <ChibiAvatar className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.07)]" />
            </div>
            <div className="w-32 sm:w-40 h-2 sm:h-2.5 rounded-full bg-black/[0.07] blur-[3px] mt-0.5" />
          </div>
        </div>
      ) : section.isContact ? (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          {/* Top code badge */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#888888]">
              {section.code}
            </span>
          </div>

          {/* Contact Graphic Frame */}
          <div className="relative flex-1 w-full my-1.5 sm:my-2 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-[#1d1d1f] to-[#2c2c2e] text-white p-4 sm:p-6 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-2 sm:mb-3">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h4 className="text-sm sm:text-lg font-semibold tracking-tight text-white mb-0.5 sm:mb-1">
              Let&apos;s Build Together
            </h4>
            <p className="text-[11px] sm:text-xs text-white/70 max-w-xs font-sans truncate">
              nagubathula.satyasai@gmail.com
            </p>
          </div>

          {/* Bottom Title */}
          <div className="w-full flex items-center justify-between z-10 pt-1 sm:pt-2">
            <span className="text-base sm:text-xl font-semibold tracking-tight text-[#111111] font-sans">
              {section.title}
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-[#999999] tracking-widest uppercase inline-flex items-center gap-1">
              <span>Send Email</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          {/* Top code badge */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#888888]">
              {section.code}
            </span>
          </div>

          {/* Preview Image Frame */}
          <div className="relative flex-1 w-full my-1.5 sm:my-2 rounded-xl sm:rounded-2xl overflow-hidden bg-[#f4f4f6] border border-black/[0.04]">
            <Image
              src={section.image}
              alt={section.title}
              fill
              sizes="(max-width: 768px) 85vw, 440px"
              className="object-cover"
            />
          </div>

          {/* Bottom Title */}
          <div className="w-full flex items-center justify-between z-10 pt-1 sm:pt-2">
            <span className="text-base sm:text-xl font-semibold tracking-tight text-[#111111] font-sans">
              {section.title}
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-[#999999] tracking-widest uppercase">
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
  const touchStartX = useRef(0);

  const flipToNext = useCallback(() => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;
    const target = (currIndexRef.current + 1) % total;
    nextIndexRef.current = target;
    setNextIndex(target);
    setDirection("down");
    setIsFlipping(true);

    try {
      play8BitBlipSound(620);
    } catch {}
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch {}
    }

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

    try {
      play8BitBlipSound(520);
    } catch {}
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch {}
    }

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

  // Global touch swipe support (supports both vertical and horizontal swipes)
  useEffect(() => {
    const handleGlobalTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleGlobalTouchMove = (e) => {
      // Prevent browser bounce / page scroll while swiping on mobile
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const handleGlobalTouchEnd = (e) => {
      if (isFlippingRef.current) return;
      const diffY = touchStartY.current - e.changedTouches[0].clientY;
      const diffX = touchStartX.current - e.changedTouches[0].clientX;

      // Check vertical swipe first
      if (Math.abs(diffY) > 28 && Math.abs(diffY) >= Math.abs(diffX)) {
        if (diffY > 0) {
          flipToNext();
        } else {
          flipToPrev();
        }
      } else if (Math.abs(diffX) > 28) {
        // Horizontal swipe (left = next, right = prev)
        if (diffX > 0) {
          flipToNext();
        } else {
          flipToPrev();
        }
      }
    };

    window.addEventListener("touchstart", handleGlobalTouchStart, { passive: true });
    window.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });
    window.addEventListener("touchend", handleGlobalTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleGlobalTouchStart);
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [flipToNext, flipToPrev]);

  // iOS DeviceMotion permission state
  const [needsMotionPermission, setNeedsMotionPermission] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(false);

  // Check if browser requires explicit user gesture permission for DeviceMotion (iOS 13+)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      setNeedsMotionPermission(true);
    }
  }, []);

  // Request motion permission on iOS via explicit user gesture
  const requestMotionAccess = useCallback(async () => {
    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      try {
        const res = await DeviceMotionEvent.requestPermission();
        if (res === "granted") {
          setMotionEnabled(true);
          setNeedsMotionPermission(false);
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            try {
              navigator.vibrate([25, 35, 25]);
            } catch {}
          }
          return true;
        }
      } catch (err) {
        console.warn("Motion permission error:", err);
      }
    } else {
      setMotionEnabled(true);
      return true;
    }
    return false;
  }, []);

  // Shake phone to flip cards on mobile (DeviceMotion API)
  useEffect(() => {
    let lastX = null;
    let lastY = null;
    let lastZ = null;
    let lastTime = 0;
    const SHAKE_AXIS_THRESHOLD = 11;
    const SHAKE_TOTAL_THRESHOLD = 18;
    const COOLDOWN_MS = 600;

    const handleDeviceMotion = (e) => {
      const current = e.accelerationIncludingGravity || e.acceleration;
      if (!current) return;

      const now = Date.now();
      if (now - lastTime < 60) return;

      const x = current.x ?? 0;
      const y = current.y ?? 0;
      const z = current.z ?? 0;

      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);
        const totalDelta = deltaX + deltaY + deltaZ;

        // Triggers on horizontal, vertical, or diagonal shake
        const isShake =
          deltaX > SHAKE_AXIS_THRESHOLD ||
          deltaY > SHAKE_AXIS_THRESHOLD ||
          deltaZ > SHAKE_AXIS_THRESHOLD * 1.2 ||
          totalDelta > SHAKE_TOTAL_THRESHOLD;

        if (isShake && now - lastTime > COOLDOWN_MS) {
          lastTime = now;
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            try {
              navigator.vibrate([25, 35, 25]);
            } catch {}
          }
          flipToNext();
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    const isIOS =
      typeof DeviceMotionEvent !== "undefined" &&
      typeof DeviceMotionEvent.requestPermission === "function";

    if (!isIOS) {
      // Android / browsers that do not require permission prompt
      window.addEventListener("devicemotion", handleDeviceMotion);
      setMotionEnabled(true);
      return () => {
        window.removeEventListener("devicemotion", handleDeviceMotion);
      };
    } else {
      // iOS: listen to devicemotion once permission is granted
      if (motionEnabled) {
        window.addEventListener("devicemotion", handleDeviceMotion);
        return () => {
          window.removeEventListener("devicemotion", handleDeviceMotion);
        };
      }

      // Automatically request permission on first user tap/click on iOS
      const handleFirstTap = async () => {
        const granted = await requestMotionAccess();
        if (granted) {
          window.addEventListener("devicemotion", handleDeviceMotion);
        }
      };

      window.addEventListener("click", handleFirstTap, { once: true });
      window.addEventListener("touchend", handleFirstTap, { once: true });

      return () => {
        window.removeEventListener("devicemotion", handleDeviceMotion);
        window.removeEventListener("click", handleFirstTap);
        window.removeEventListener("touchend", handleFirstTap);
      };
    }
  }, [flipToNext, motionEnabled, requestMotionAccess]);

  // Keyboard arrow keys, hardware volume buttons (Bluetooth / WebViews), and MediaSession
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isNext =
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === "AudioVolumeDown" ||
        e.key === "VolumeDown" ||
        e.code === "AudioVolumeDown" ||
        e.code === "VolumeDown" ||
        e.keyCode === 25 ||
        e.which === 25;

      const isPrev =
        e.key === "ArrowUp" ||
        e.key === "PageUp" ||
        e.key === "AudioVolumeUp" ||
        e.key === "VolumeUp" ||
        e.code === "AudioVolumeUp" ||
        e.code === "VolumeUp" ||
        e.keyCode === 24 ||
        e.which === 24;

      if (isNext) {
        if (e.cancelable) e.preventDefault();
        flipToNext();
      } else if (isPrev) {
        if (e.cancelable) e.preventDefault();
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

    // MediaSession handler for Bluetooth headphones / earphone volume & media keys
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.setActionHandler("nexttrack", () => flipToNext());
        navigator.mediaSession.setActionHandler("previoustrack", () => flipToPrev());
      } catch {}
    }

    const handleCustomVolDown = () => flipToNext();
    const handleCustomVolUp = () => flipToPrev();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("volumedown", handleCustomVolDown);
    window.addEventListener("volumeup", handleCustomVolUp);

    // Global helpers for native WebViews / bridges
    window.flipCalendarNext = flipToNext;
    window.flipCalendarPrev = flipToPrev;

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("volumedown", handleCustomVolDown);
      window.removeEventListener("volumeup", handleCustomVolUp);
      delete window.flipCalendarNext;
      delete window.flipCalendarPrev;
    };
  }, [flipToNext, flipToPrev, router]);

  const currSection = calendarSections[currIndex];
  const nextSection = calendarSections[nextIndex];

  return (
    <div
      data-lenis-prevent="true"
      className="relative w-full h-full flex flex-col items-center justify-center select-none"
    >
      {/* Clean Flip Housing with fluid responsive sizing */}
      <div className="relative p-2 sm:p-2.5 lg:p-3 rounded-[28px] sm:rounded-[34px] lg:rounded-[38px] bg-gradient-to-b from-[#e8e8ea] to-[#d0d0d4] shadow-[0_20px_50px_rgba(0,0,0,0.12),0_8px_18px_rgba(0,0,0,0.05),inset_0_2px_3px_rgba(255,255,255,0.7)] border border-white/60">
        
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
          className="relative w-[min(320px,84vw)] sm:w-[min(390px,86vw)] lg:w-[440px] aspect-[4/4.2] max-h-[40vh] sm:max-h-[46vh] lg:max-h-[460px] rounded-[22px] sm:rounded-[26px] lg:rounded-[30px] overflow-hidden bg-white shadow-[0_12px_28px_rgba(0,0,0,0.06)] cursor-pointer group"
          style={{ perspective: "1400px" }}
        >
          {/* ============================================================
              1. STATIC BACKGROUND FLAPS (Clean, no black lines)
             ============================================================ */}
          
          {/* Static Top Half */}
          <div className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-white rounded-t-[22px] sm:rounded-t-[26px] lg:rounded-t-[30px]">
            <FlapHalf
              section={isFlipping && direction === "down" ? nextSection : currSection}
              half="top"
            />
          </div>

          {/* Static Bottom Half */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-white rounded-b-[22px] sm:rounded-b-[26px] lg:rounded-b-[30px]">
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
                  className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-white rounded-t-[22px] sm:rounded-t-[26px] lg:rounded-t-[30px] z-20"
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
                  className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-white rounded-b-[22px] sm:rounded-b-[26px] lg:rounded-b-[30px] z-20"
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
                  className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden bg-white rounded-b-[22px] sm:rounded-b-[26px] lg:rounded-b-[30px] z-20"
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
                  className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden bg-white rounded-t-[22px] sm:rounded-t-[26px] lg:rounded-t-[30px] z-20"
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

      {/* Discrete flip indicator & navigation hints */}
      <div className="mt-3 sm:mt-5 flex flex-col items-center gap-1.5 text-[11px] sm:text-xs font-mono text-[#86868b]">
        <div className="flex items-center gap-3">
          <button
            onClick={flipToPrev}
            disabled={isFlipping}
            aria-label="Previous date"
            className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/10 active:bg-black/20 active:scale-90 flex items-center justify-center transition-all text-[#111111]"
          >
            ▲
          </button>

          <span className="tracking-widest font-medium">
            {String(currIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          <button
            onClick={flipToNext}
            disabled={isFlipping}
            aria-label="Next date"
            className="w-8 h-8 rounded-full bg-black/[0.05] hover:bg-black/10 active:bg-black/20 active:scale-90 flex items-center justify-center transition-all text-[#111111]"
          >
            ▼
          </button>
        </div>

        {/* Mobile quick interaction hint & iOS permission trigger */}
        <div className="flex items-center justify-center lg:hidden mt-0.5">
          {needsMotionPermission && !motionEnabled ? (
            <button
              onClick={requestMotionAccess}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.05] hover:bg-black/10 active:scale-95 transition-all text-[11px] font-mono text-[#111111] border border-black/[0.08] shadow-2xs cursor-pointer"
            >
              <Smartphone size={12} className="text-emerald-600 animate-bounce" />
              <span>Tap to enable Shake on iOS</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] text-[#999999]">
              <Smartphone size={11} className="opacity-70 animate-pulse" />
              <span>Shake phone or swipe to flip</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
