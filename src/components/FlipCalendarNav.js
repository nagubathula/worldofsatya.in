"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import ChibiAvatar from "./ChibiAvatar";
import WorksFan from "./WorksFan";
import { play8BitBlipSound } from "./SoundEffects";
import { useBlackHoleTransition } from "./BlackHoleTransition";
import { EASE_IN, EASE_OUT, SPRING } from "@/lib/motion";

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
        href: "/works/openweave",
        slug: "openweave",
        blurb: "Design editor",
      },
      {
        id: "notbad",
        title: "NotBad",
        image: "/notbad-editor.png",
        href: "/works/notbad",
        slug: "notbad",
        blurb: "Markdown writer",
      },
      {
        id: "toothpaste",
        title: "Toothpaste",
        image: "/toothpaste-panel.png",
        href: "/works/toothpaste",
        slug: "toothpaste",
        blurb: "Premiere Pro extension",
      },
      {
        id: "tailus",
        title: "Tailus",
        image: "/tailus.png",
        href: "/works/tailus",
        slug: "tailus",
        blurb: "Tailwind UI kit",
      },
    ],
  },
];

// Renders the complete, uncut card face for each section
function CardFace({ section, onNavigate, interactive, reduceMotion }) {
  return (
    <div className={`relative w-full h-full text-[#111111] flex flex-col justify-between select-none ${section.isAvatar ? "" : "px-1 sm:px-2"}`}>
      {section.isAvatar ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-visible">
          {/* Interactive SVG Chibi Character */}
          <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
            <div className="relative h-full w-full">
              <ChibiAvatar className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      ) : (
        <WorksFan
          items={section.previewItems}
          onNavigate={onNavigate}
          interactive={interactive}
          reduceMotion={reduceMotion}
        />
      )}
    </div>
  );
}

export default function FlipCalendarNav({ initialSection = "avatar", onSectionChange }) {
  const prefersReducedMotion = useReducedMotion();
  // useReducedMotion() is null on the server. Render the motion variants first so
  // hydration matches the HTML, then switch once the real setting is known.
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    setReduceMotion(prefersReducedMotion === true);
  }, [prefersReducedMotion]);
  const initialIndex = Math.max(0, calendarSections.findIndex(section => section.id === initialSection));
  const { navigate: blackHoleNavigate } = useBlackHoleTransition();
  const [currIndex, setCurrIndex] = useState(initialIndex);
  const [isFlipping, setIsFlipping] = useState(false);
  const [direction, setDirection] = useState("down"); // "down" or "up"

  const total = calendarSections.length;
  const currIndexRef = useRef(initialIndex);
  const isFlippingRef = useRef(false);
  const isDepartingRef = useRef(false);
  const flipTimerRef = useRef(null);
  const departTimerRef = useRef(null);
  // Swallows trackpad inertia so one flick turns the card and the next gesture continues.
  const gestureLockUntil = useRef(0);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const onSectionChangeRef = useRef(onSectionChange);
  onSectionChangeRef.current = onSectionChange;
  const [isDeparting, setIsDeparting] = useState(false);

  // Spring physics motion values for physical gesture rubber-banding and momentum
  const pullY = useMotionValue(0);
  const pullSpring = useSpring(pullY, {
    stiffness: 380,
    damping: 20, // Elastic rubber-band snapback
    mass: 0.5,
  });

  const liveRotateX = useTransform(pullSpring, [-120, 0, 120], [20, 0, -20]);
  const liveY = useTransform(pullSpring, [-120, 0, 120], [-26, 0, 26]);
  const liveScale = useTransform(pullSpring, [-120, 0, 120], [0.96, 1, 0.96]);

  // Notify parent of current section once on mount
  useEffect(() => {
    onSectionChangeRef.current?.(calendarSections[currIndexRef.current]?.id || "avatar");
  }, []);

  useEffect(() => () => {
    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    if (departTimerRef.current) clearTimeout(departTimerRef.current);
  }, []);

  const holdGestures = useCallback((ms) => {
    isFlippingRef.current = true;
    setIsFlipping(true);
    gestureLockUntil.current = Date.now() + ms;
    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    flipTimerRef.current = setTimeout(() => {
      setIsFlipping(false);
      isFlippingRef.current = false;
    }, Math.min(ms, 720));
  }, []);

  // Opens the archive from the works card (click or Enter).
  const continueToArchive = useCallback(() => {
    if (isFlippingRef.current || isDepartingRef.current) return;
    const section = calendarSections[currIndexRef.current];
    if (!section) return;
    isDepartingRef.current = true;
    isFlippingRef.current = true;
    setIsFlipping(true);
    setIsDeparting(true);
    gestureLockUntil.current = Date.now() + 1600;
    pullY.set(reduceMotion ? 0 : -70);

    try {
      play8BitBlipSound(760);
    } catch {}
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([18, 24, 18]);
      } catch {}
    }

    if (departTimerRef.current) clearTimeout(departTimerRef.current);
    departTimerRef.current = setTimeout(() => {
      blackHoleNavigate(section.href || "/works");
    }, reduceMotion ? 40 : 340);
  }, [blackHoleNavigate, pullY, reduceMotion]);

  const flipToNext = useCallback(() => {
    if (isFlippingRef.current || isDepartingRef.current) return;
    if (Date.now() < gestureLockUntil.current) return;
    // The works card is the last face; scrolling past it stays put.
    if (currIndexRef.current >= total - 1) return;
    const target = currIndexRef.current + 1;
    currIndexRef.current = target;
    setDirection("down");
    setCurrIndex(target);
    onSectionChangeRef.current?.(calendarSections[target].id);
    holdGestures(1080);

    try {
      play8BitBlipSound(620);
    } catch {}
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch {}
    }
  }, [total, holdGestures]);

  const flipToPrev = useCallback(() => {
    if (isFlippingRef.current || isDepartingRef.current) return;
    if (Date.now() < gestureLockUntil.current) return;
    if (currIndexRef.current <= 0) return;
    const target = currIndexRef.current - 1;
    currIndexRef.current = target;
    setDirection("up");
    setCurrIndex(target);
    onSectionChangeRef.current?.(calendarSections[target].id);
    holdGestures(1080);

    try {
      play8BitBlipSound(520);
    } catch {}
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch {}
    }
  }, [holdGestures]);

  // Wheel listener: Flips calendar when scrolling anywhere on the home screen
  useEffect(() => {
    let accumulatedDelta = 0;
    let resetTimer = null;

    const handleGlobalWheel = (e) => {
      // Ignore if user is interacting with form controls or interactive popups
      if (e.target instanceof Element && e.target.closest("input, textarea, select, [data-prevent-flip='true']")) return;

      if (isFlippingRef.current || isDepartingRef.current || Date.now() < gestureLockUntil.current) {
        if (e.cancelable) e.preventDefault();
        accumulatedDelta = 0;
        return;
      }

      accumulatedDelta += e.deltaY;
      // Real-time elastic rubber-band pull
      pullY.set(Math.max(-85, Math.min(85, -accumulatedDelta * 0.7)));

      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accumulatedDelta = 0;
        pullY.set(0); // Snap back with rubber-band spring!
      }, 150);

      const THRESHOLD = 26;

      if (Math.abs(accumulatedDelta) >= THRESHOLD) {
        if (e.cancelable) e.preventDefault();
        const goingDown = accumulatedDelta > 0;
        accumulatedDelta = 0;
        pullY.set(0);

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
  }, [flipToNext, flipToPrev, pullY]);

  // Touch swipe support with real-time rubber-band tracking
  useEffect(() => {
    const handleGlobalTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleGlobalTouchMove = (e) => {
      if (isFlippingRef.current || isDepartingRef.current || Date.now() < gestureLockUntil.current) return;
      const diffY = touchStartY.current - e.touches[0].clientY;
      const diffX = touchStartX.current - e.touches[0].clientX;
      if (Math.abs(diffY) > 6 || Math.abs(diffX) > 6) {
        if (e.cancelable) e.preventDefault();
      }

      // Elastic rubber-band live stretch
      if (Math.abs(diffY) >= Math.abs(diffX)) {
        pullY.set(Math.max(-95, Math.min(95, -diffY * 0.72)));
      } else {
        pullY.set(Math.max(-95, Math.min(95, -diffX * 0.55)));
      }
    };

    const handleGlobalTouchEnd = (e) => {
      if (isFlippingRef.current || isDepartingRef.current || Date.now() < gestureLockUntil.current) {
        pullY.set(0);
        return;
      }
      const diffY = touchStartY.current - e.changedTouches[0].clientY;
      const diffX = touchStartX.current - e.changedTouches[0].clientX;

      pullY.set(0); // Rubber band bounce back to resting

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
  }, [flipToNext, flipToPrev, pullY]);

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
        if (!item || isDepartingRef.current) return;
        if (item.isWorks) {
          continueToArchive();
        } else if (item.href.startsWith("mailto:")) {
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
  }, [flipToNext, flipToPrev, continueToArchive, blackHoleNavigate]);

  const currSection = calendarSections[currIndex];
  return (
    <div
      data-lenis-prevent="true"
      data-flip-calendar="true"
      className="relative w-full h-full flex flex-col items-center justify-center select-none"
    >
      {/* Shell size springs between the portrait and the works index.
          Drag and the 3D turn live on the inner layers so they don't fight layout. */}
      <motion.div
        layout={reduceMotion ? false : true}
        transition={{ layout: SPRING.enter }}
        className={`relative ${
          currSection.isAvatar
            ? "w-24 sm:w-28 aspect-square"
            : // Phones deal the works as a 2×2 hand, so the shell turns portrait there.
              "w-[min(400px,88vw)] aspect-[100/124] sm:w-[min(780px,94vw)] sm:aspect-[780/380]"
        }`}
      >
      <motion.div
        className="absolute inset-0"
        style={{ perspective: 1400 }}
        animate={isDeparting ? { opacity: 0, scale: 1.045 } : { opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.12 : 0.34, ease: EASE_OUT }}
      >
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.22}
        dragMomentum={false}
        onDragStart={() => {
          pullY.set(0);
        }}
        onDrag={(e, info) => {
          pullY.set(-info.offset.y * 0.55);
        }}
        onDragEnd={(e, info) => {
          pullY.set(0);
          if (isFlippingRef.current || isDepartingRef.current || Date.now() < gestureLockUntil.current) return;
          const { offset, velocity } = info;
          if (offset.y < -28 || velocity.y < -240) {
            flipToNext();
          } else if (offset.y > 28 || velocity.y > 240) {
            flipToPrev();
          }
        }}
        onClick={(e) => {
          if (isFlippingRef.current || isDepartingRef.current) return;
          if (currSection.isWorks) {
            continueToArchive();
            return;
          }
          if (currSection.href.startsWith("mailto:")) {
            window.location.href = currSection.href;
          } else {
            blackHoleNavigate(currSection.href, { x: e.clientX, y: e.clientY });
          }
        }}
        style={{
          rotateX: liveRotateX,
          y: liveY,
          scale: liveScale,
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none select-none group"
      >
        {/* Card turn. Exit is a short glide; the next face springs in and the shell keeps growing.
            The face is clipped only at the bottom, so it rises out of the card without losing its hair. */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currIndex}
            custom={direction}
            variants={reduceMotion ? {
              enter: { opacity: 0 },
              center: { opacity: 1, transition: { duration: 0.2 } },
              exit: { opacity: 0, transition: { duration: 0.14 } },
            } : {
              enter: (dir) => ({
                rotateX: dir === "down" ? 42 : -42,
                y: dir === "down" ? 36 : -36,
                opacity: 0,
                filter: "blur(5px)",
              }),
              center: {
                rotateX: 0,
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                transition: SPRING.enter,
                // Drop the filter once settled: even blur(0px) inside the 3D turn makes
                // phones paint the face as a flat, low-resolution layer.
                transitionEnd: { filter: "none" },
              },
              exit: (dir) => ({
                rotateX: dir === "down" ? -28 : 28,
                y: dir === "down" ? -22 : 22,
                opacity: 0,
                filter: "blur(3px)",
                transition: { duration: 0.22, ease: EASE_IN },
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
            }}
            className={`absolute inset-0 w-full h-full ${currSection.isAvatar ? "[clip-path:inset(-30%_-30%_0_-30%)]" : ""}`}
          >
            <CardFace
              section={currSection}
              onNavigate={blackHoleNavigate}
              interactive={!isFlipping && !isDeparting}
              reduceMotion={reduceMotion}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      </motion.div>
      </motion.div>
    </div>
  );
}
