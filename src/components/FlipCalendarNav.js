"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
    id: "works",
    code: "WORKS",
    title: "Works",
    href: "/works",
    isWorks: true,
    previewItems: [
      {
        id: "openweave",
        title: "OpenWeave",
        image: "/openweave-app.png",
      },
      {
        id: "notbad",
        title: "NotBad",
        image: "/notbad-editor.png",
      },
      {
        id: "toothpaste",
        title: "Toothpaste",
        image: "/toothpaste-panel.png",
      },
      {
        id: "tailus",
        title: "Tailus",
        image: "/tailus.png",
      },
    ],
  },
  {
    id: "contact",
    code: "CONTACT",
    title: "Contact",
    href: "mailto:nagubathula.satyasai@gmail.com",
    isContact: true,
  },
];

// Renders the complete, uncut card face for each section
function CardFace({ section, onExpandWorks }) {
  return (
    <div className="relative w-full h-full bg-white text-[#111111] flex flex-col justify-between p-4 sm:p-6 lg:p-7 select-none overflow-hidden">
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
      ) : section.isWorks ? (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          {/* Top code badge */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#888888]">
              {section.code}
            </span>
          </div>

          {/* 2x2 Bento Preview Grid of 4 Works */}
          <div
            onClick={(e) => {
              if (onExpandWorks) {
                e.stopPropagation();
                onExpandWorks();
              }
            }}
            className="relative flex-1 w-full my-1.5 sm:my-2 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-2.5 cursor-pointer"
          >
            {section.previewItems.map((item, idx) => (
              <div
                key={idx}
                className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#f4f4f6] border border-black/[0.06] shadow-2xs group/tile hover:border-black/20 hover:scale-[1.02] transition-all duration-200"
              >
                <motion.div layoutId={`work-image-${item.id}`} style={{ borderRadius: 12 }} className="relative w-full h-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 45vw, 220px"
                    className="object-cover object-top"
                  />
                </motion.div>
              </div>
            ))}
          </div>

          {/* Bottom Title */}
          <div className="w-full flex items-center justify-between z-10 pt-1 sm:pt-2">
            <span className="text-base sm:text-xl font-semibold tracking-tight text-[#111111] font-sans">
              {section.title}
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-[#999999] tracking-widest uppercase inline-flex items-center gap-1">
              <span>Click to view</span>
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

export default function FlipCalendarNav({ onExpandWorks, initialSection = "avatar" }) {
  const reduceMotion = useReducedMotion();
  const initialIndex = Math.max(0, calendarSections.findIndex(section => section.id === initialSection));
  const router = useRouter();
  const [currIndex, setCurrIndex] = useState(initialIndex);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState("down"); // "down" or "up"

  const total = calendarSections.length;
  const currIndexRef = useRef(initialIndex);
  const isFlippingRef = useRef(false);
  const flipTimerRef = useRef(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const flipToNext = useCallback(() => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;
    const target = (currIndexRef.current + 1) % total;
    currIndexRef.current = target;
    setDirection("down");
    setIsFlipping(true);
    setCurrIndex(target);

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
      setIsFlipping(false);
      isFlippingRef.current = false;
    }, 650);
  }, [total]);

  const flipToPrev = useCallback(() => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;
    const target = (currIndexRef.current - 1 + total) % total;
    currIndexRef.current = target;
    setDirection("up");
    setIsFlipping(true);
    setCurrIndex(target);

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
      setIsFlipping(false);
      isFlippingRef.current = false;
    }, 650);
  }, [total]);

  // Wheel listener: Flips calendar when hovering over the widget, allows normal page scroll elsewhere
  useEffect(() => {
    const handleGlobalWheel = (e) => {
      const overCalendar = e.target?.closest?.("[data-flip-calendar='true']");
      if (!overCalendar) return;

      if (Math.abs(e.deltaY) < 14) return;
      if (isFlippingRef.current) return;
      if (e.cancelable) e.preventDefault();

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

  // Touch swipe support: swiping on the calendar flips cards, swiping elsewhere scrolls the page
  useEffect(() => {
    const handleGlobalTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleGlobalTouchMove = (e) => {
      const overCalendar = e.target?.closest?.("[data-flip-calendar='true']");
      if (overCalendar && e.cancelable) {
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
        if (e.target instanceof Element && e.target.closest("button, a, input, textarea, select")) return;
        const item = calendarSections[currIndexRef.current];
        if (item.isWorks && onExpandWorks) { onExpandWorks(); return; }
        if (item.id === "works") {
          const worksEl = document.getElementById("works-section");
          if (worksEl) {
            worksEl.scrollIntoView({ behavior: "smooth" });
            return;
          }
        }
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
  }, [flipToNext, flipToPrev, router, onExpandWorks]);

  const currSection = calendarSections[currIndex];
  return (
    <div
      data-lenis-prevent="true"
      data-flip-calendar="true"
      className="relative w-full h-full flex flex-col items-center justify-center select-none"
    >
      {/* Clean Flip Housing with fluid responsive sizing */}
      <div className="relative p-2 sm:p-2.5 lg:p-3 rounded-[28px] sm:rounded-[34px] lg:rounded-[38px] bg-gradient-to-b from-[#e8e8ea] to-[#d0d0d4] shadow-[0_20px_50px_rgba(0,0,0,0.12),0_8px_18px_rgba(0,0,0,0.05),inset_0_2px_3px_rgba(255,255,255,0.7)] border border-white/60">
        
        {/* Main Display Area */}
        <div
          onClick={() => {
            if (!isFlippingRef.current) {
              if (currSection.id === "works") {
                if (onExpandWorks) {
                  onExpandWorks();
                  return;
                }
                const worksEl = document.getElementById("works-section");
                if (worksEl) {
                  worksEl.scrollIntoView({ behavior: "smooth" });
                  return;
                }
              }
              if (currSection.href.startsWith("mailto:")) {
                window.location.href = currSection.href;
              } else {
                router.push(currSection.href);
              }
            }
          }}
          className="relative w-[min(320px,84vw)] sm:w-[min(390px,86vw)] lg:w-[440px] aspect-[4/4.2] max-h-[40vh] sm:max-h-[46vh] lg:max-h-[460px] rounded-[22px] sm:rounded-[26px] lg:rounded-[30px] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.06)] cursor-pointer group"
          style={{ perspective: "1000px" }}
        >
          {/* Apple iOS Level Smooth 3D Perspective Card Turn */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currIndex}
              custom={direction}
              variants={{
                enter: (dir) => ({
                  rotateX: dir === "down" ? 50 : -50,
                  y: dir === "down" ? 28 : -28,
                  scale: 0.95,
                  opacity: 0,
                }),
                center: {
                  rotateX: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  transition: {
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
                exit: (dir) => ({
                  rotateX: dir === "down" ? -50 : 50,
                  y: dir === "down" ? -28 : 28,
                  scale: 0.95,
                  opacity: 0,
                  transition: {
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }),
              }}
              initial={false}
              animate="center"
              exit="exit"
              style={{
                transformOrigin: "50% 50%",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                willChange: "transform, opacity",
              }}
              className="absolute inset-0 w-full h-full rounded-[22px] sm:rounded-[26px] lg:rounded-[30px] overflow-hidden bg-white"
            >
              <CardFace section={currSection} onExpandWorks={onExpandWorks} />
            </motion.div>
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

        {/* Mobile quick interaction hint */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#999999] lg:hidden mt-0.5">
          <Smartphone size={11} className="opacity-70 animate-pulse" />
          <span>Shake phone or swipe to flip</span>
        </div>
      </div>
    </div>
  );
}
