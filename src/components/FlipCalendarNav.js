"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ChibiAvatar from "./ChibiAvatar";
import { play8BitBlipSound } from "./SoundEffects";
import { useBlackHoleTransition } from "./BlackHoleTransition";

export const calendarSections = [
  {
    id: "avatar",
    code: "ABOUT",
    title: "About",
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
        href: "/works/o0",
      },
      {
        id: "notbad",
        title: "NotBad",
        image: "/notbad-editor.png",
        href: "/works/case-studies/notbad-design",
      },
      {
        id: "toothpaste",
        title: "Toothpaste",
        image: "/toothpaste-panel.png",
        href: "/works/o1",
      },
      {
        id: "tailus",
        title: "Tailus",
        image: "/tailus.png",
        href: "/works/p5",
      },
    ],
  },
];

// Renders the complete, uncut card face for each section
function CardFace({ section, onNavigate }) {
  return (
    <div className={`relative w-full h-full text-[#111111] flex flex-col justify-between select-none overflow-hidden ${section.isAvatar ? "bg-transparent p-0" : "bg-white p-4 sm:p-5 lg:p-6"}`}>
      {section.isAvatar ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-visible">
          {/* Interactive SVG Chibi Character */}
          <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
            <div className="relative w-44 sm:w-52 lg:w-56 aspect-square max-h-[260px]">
              <ChibiAvatar className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          {/* 2x2 Bento Preview Grid of 4 Works */}
          <div className="relative flex-1 w-full my-1.5 sm:my-2 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-2.5">
            {section.previewItems.map((item, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.href && onNavigate) {
                    onNavigate(item.href, { x: e.clientX, y: e.clientY });
                  }
                }}
                className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#f4f4f6] group/tile hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                <div style={{ borderRadius: 12 }} className="relative w-full h-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 45vw, 220px"
                    className="object-cover object-top group-hover/tile:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Title */}
          <div className="w-full flex items-center justify-between z-10 pt-1 sm:pt-2">
            <span className="text-base sm:text-xl font-semibold tracking-tight text-[#111111] font-sans">
              {section.title}
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-[#999999] tracking-widest uppercase inline-flex items-center gap-1 group-hover:text-black transition-colors">
              <span>View all</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlipCalendarNav({ initialSection = "avatar", onSectionChange }) {
  const reduceMotion = useReducedMotion();
  const initialIndex = Math.max(0, calendarSections.findIndex(section => section.id === initialSection));
  const router = useRouter();
  const { navigate: blackHoleNavigate } = useBlackHoleTransition();
  const [currIndex, setCurrIndex] = useState(initialIndex);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState("down"); // "down" or "up"

  const total = calendarSections.length;
  const currIndexRef = useRef(initialIndex);
  const isFlippingRef = useRef(false);
  const flipTimerRef = useRef(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  // Notify parent of current section on mount or when initialIndex changes
  useEffect(() => {
    onSectionChange?.(calendarSections[currIndexRef.current]?.id || "avatar");
  }, [onSectionChange]);

  const flipToNext = useCallback(() => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;
    const target = (currIndexRef.current + 1) % total;
    currIndexRef.current = target;
    setDirection("down");
    setIsFlipping(true);
    setCurrIndex(target);
    onSectionChange?.(calendarSections[target].id);

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
    }, 480);
  }, [total, onSectionChange]);

  const flipToPrev = useCallback(() => {
    if (isFlippingRef.current) return;
    isFlippingRef.current = true;
    const target = (currIndexRef.current - 1 + total) % total;
    currIndexRef.current = target;
    setDirection("up");
    setIsFlipping(true);
    setCurrIndex(target);
    onSectionChange?.(calendarSections[target].id);

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
    }, 480);
  }, [total, onSectionChange]);

  // Wheel listener: Flips calendar when scrolling anywhere on the home screen
  useEffect(() => {
    let accumulatedDelta = 0;
    let resetTimer = null;

    const handleGlobalWheel = (e) => {
      // Ignore if user is interacting with form controls or interactive popups
      if (e.target instanceof Element && e.target.closest("input, textarea, select, [data-prevent-flip='true']")) return;

      if (isFlippingRef.current) {
        if (e.cancelable) e.preventDefault();
        return;
      }

      accumulatedDelta += e.deltaY;

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accumulatedDelta = 0;
      }, 180);

      const THRESHOLD = 22;

      if (Math.abs(accumulatedDelta) >= THRESHOLD) {
        if (e.cancelable) e.preventDefault();
        const goingDown = accumulatedDelta > 0;
        accumulatedDelta = 0;

        if (goingDown) {
          flipToNext();
        } else {
          flipToPrev();
        }
      }
    };

    window.addEventListener("wheel", handleGlobalWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleGlobalWheel);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [flipToNext, flipToPrev]);

  // Touch swipe support: swiping vertically or horizontally flips cards
  useEffect(() => {
    const handleGlobalTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleGlobalTouchMove = (e) => {
      if (e.cancelable) {
        const diffY = touchStartY.current - e.touches[0].clientY;
        const diffX = touchStartX.current - e.touches[0].clientX;
        if (Math.abs(diffY) > 8 || Math.abs(diffX) > 8) {
          e.preventDefault();
        }
      }
    };

    const handleGlobalTouchEnd = (e) => {
      if (isFlippingRef.current) return;
      const diffY = touchStartY.current - e.changedTouches[0].clientY;
      const diffX = touchStartX.current - e.changedTouches[0].clientX;

      // Check vertical swipe first
      if (Math.abs(diffY) > 22 && Math.abs(diffY) >= Math.abs(diffX)) {
        if (diffY > 0) {
          flipToNext();
        } else {
          flipToPrev();
        }
      } else if (Math.abs(diffX) > 26) {
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
        if (item.href.startsWith("mailto:")) {
          window.location.href = item.href;
        } else {
          blackHoleNavigate(item.href);
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
  }, [flipToNext, flipToPrev, router, blackHoleNavigate]);

  const currSection = calendarSections[currIndex];
  return (
    <div
      data-lenis-prevent="true"
      data-flip-calendar="true"
      className="relative w-full h-full flex flex-col items-center justify-center select-none"
    >
      {/* Main Display Area */}
      <div
        onClick={(e) => {
          if (!isFlippingRef.current) {
            if (currSection.href.startsWith("mailto:")) {
              window.location.href = currSection.href;
            } else {
              blackHoleNavigate(currSection.href, { x: e.clientX, y: e.clientY });
            }
          }
        }}
        className={`relative rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] cursor-pointer group ${
          currSection.isAvatar
            ? "w-[min(220px,72vw)] sm:w-[240px] lg:w-[250px] aspect-square bg-transparent"
            : "w-[min(300px,84vw)] sm:w-[340px] lg:w-[370px] xl:w-[390px] aspect-[4/4.1] max-h-[420px] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
        }`}
        style={{ perspective: "1200px" }}
      >
        {/* Apple iOS Level Smooth 3D Perspective Card Turn */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currIndex}
            custom={direction}
            variants={{
              enter: (dir) => ({
                rotateX: dir === "down" ? 55 : -55,
                y: dir === "down" ? 30 : -30,
                z: -40,
                scale: 0.94,
                opacity: 0,
              }),
              center: {
                rotateX: 0,
                y: 0,
                z: 0,
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 26,
                  mass: 0.75,
                },
              },
              exit: (dir) => ({
                rotateX: dir === "down" ? -55 : 55,
                y: dir === "down" ? -30 : 30,
                z: -40,
                scale: 0.94,
                opacity: 0,
                transition: {
                  duration: 0.38,
                  ease: [0.32, 0, 0.67, 0],
                },
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            style={{
              transformOrigin: "50% 50%",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              willChange: "transform, opacity",
            }}
            className={`absolute inset-0 w-full h-full rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] overflow-hidden ${currSection.isAvatar ? "bg-transparent" : "bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)]"}`}
          >
            <CardFace section={currSection} onNavigate={blackHoleNavigate} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
