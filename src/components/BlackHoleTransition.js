"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { isSoundEnabled } from "@/components/SoundEffects";

// -------------------------------------------------------------
// Cinematic Stage Timings (Strict adherence to the 5-phase choreography):
// 1. opening   (180ms) - Black hole opens at click point (48x48px start size)
// 2. sucking   (420ms) - Sucks all elements with tidal spaghettification & vortex swirl
// 3. bloating  (240ms) - Wobbles & pulsates like a bloated bubble under pressure
// 4. centering (300ms) - High-velocity gravitational slingshot to screen center
// 5. releasing (320ms) - Big Bang detonation: new page & navbar erupt from singularity
// Total: ~1460ms
// -------------------------------------------------------------
const TIMING = {
  OPENING: 180,
  SUCKING: 420,
  BLOATING: 240,
  CENTERING: 300,
  RELEASING: 320,
};

const BlackHoleContext = createContext({
  phase: "idle", // 'idle' | 'opening' | 'sucking' | 'bloating' | 'centering' | 'releasing'
  navigate: () => {},
});

export function useBlackHoleTransition() {
  return useContext(BlackHoleContext);
}

let globalTriggerTransition = null;

export function triggerBlackHoleNav(href, clickPos) {
  if (globalTriggerTransition) {
    globalTriggerTransition(href, clickPos);
  }
}

// -------------------------------------------------------------
// Web Audio: Deep Cinematic Gravitational Acoustics
// -------------------------------------------------------------
function playOpeningSound() {
  if (typeof window === "undefined" || !isSoundEnabled()) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(28, now + 0.17);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);

    setTimeout(() => {
      try { ctx.close(); } catch {}
    }, 350);
  } catch {}
}

function playGravitationalTremorSound() {
  if (typeof window === "undefined" || !isSoundEnabled()) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;

    // Sub-bass gravitational sweep
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(58, now);
    osc.frequency.exponentialRampToValueAtTime(18, now + 0.4);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.14, now + 0.08);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.41);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.42);

    // Filtered noise for vortex accretion friction
    const bufferSize = Math.floor(ctx.sampleRate * 0.4);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(140, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(35, now + 0.4);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.05, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.41);

    setTimeout(() => {
      try { ctx.close(); } catch {}
    }, 600);
  } catch {}
}

function playBloatedBubbleSound() {
  if (typeof window === "undefined" || !isSoundEnabled()) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(42, now);
    osc.frequency.linearRampToValueAtTime(64, now + 0.08);
    osc.frequency.linearRampToValueAtTime(36, now + 0.16);
    osc.frequency.linearRampToValueAtTime(48, now + 0.23);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.23);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);

    setTimeout(() => {
      try { ctx.close(); } catch {}
    }, 450);
  } catch {}
}

function playRushToCenterSound() {
  if (typeof window === "undefined" || !isSoundEnabled()) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(28, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.29);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.29);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);

    setTimeout(() => {
      try { ctx.close(); } catch {}
    }, 500);
  } catch {}
}

function playReleaseDetonationSound() {
  if (typeof window === "undefined" || !isSoundEnabled()) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(26, now + 0.28);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.31);

    setTimeout(() => {
      try { ctx.close(); } catch {}
    }, 500);
  } catch {}
}

// -------------------------------------------------------------
// Track active element animations to ensure 100% clean DOM restoration
// -------------------------------------------------------------
const activeAnimations = new Set();

function clearAllActiveElementAnimations() {
  // Clear all tracked active animations initiated by Black Hole
  activeAnimations.forEach((anim) => {
    try {
      anim.cancel();
    } catch {}
  });
  activeAnimations.clear();

  if (typeof document !== "undefined") {
    // Reset any inline styles on navbar clusters and page elements
    const allTargetEls = document.querySelectorAll(
      "[data-site-navbar], [data-site-navbar] *, [data-nav-cluster], [data-nav-cluster] *, header, header *, #black-hole-page, #black-hole-page *, main, main *"
    );
    allTargetEls.forEach((el) => {
      el.style.transform = "";
      el.style.opacity = "";
      el.style.filter = "";
      el.style.clipPath = "";
    });
  }
}

// -------------------------------------------------------------
// Navbar background container gentle fade handler
// -------------------------------------------------------------
function fadeNavbar(inOut, duration) {
  // Dynamic Island clusters are directly animated via suction and release keyframes
}

// -------------------------------------------------------------
// Element Selection for Individual Apple-Style Suction & Release
// -------------------------------------------------------------
function getSuckableElements() {
  if (typeof window === "undefined" || typeof document === "undefined") return [];

  const selected = [];
  const selectedSet = new Set();

  // 1. Target Navbar (Dynamic Island cluster divisions)
  const siteNav =
    document.querySelector("[data-site-navbar]") ||
    document.getElementById("site-navbar");

  if (siteNav) {
    const navClusters = Array.from(
      siteNav.querySelectorAll("[data-nav-cluster]")
    );
    const clusters = navClusters.length > 0 ? navClusters : [siteNav];

    for (const el of clusters) {
      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;

      const rect = el.getBoundingClientRect();
      if (rect.width > 6 && rect.height > 6) {
        selected.push({ el, rect, isNav: true });
        selectedSet.add(el);
      }
    }
  }

  // 2. Target Page elements (#black-hole-page or main)
  const pageContainer =
    document.getElementById("black-hole-page") ||
    document.querySelector("main") ||
    document.body;

  const pageSelector = [
    // Page header elements & direct content containers
    "header > *",
    "main > *:not(header)",
    "section > *",
    "article > *",
    "figure",
    "article",
    ".grid > *",
    "[data-card]",
    ".retro-card",
    "[data-flip-calendar]",
    "div[class*='rounded-']",
    "a.group",
    "div.flex",
    "h1", "h2", "h3", "h4",
    "p", "a", "button", "img", "li", "footer"
  ].join(", ");

  const rawElements = Array.from(pageContainer.querySelectorAll(pageSelector));

  for (const el of rawElements) {
    if (siteNav && siteNav.contains(el)) continue;
    if (selectedSet.has(el)) continue;

    let hasAncestor = false;
    let curr = el.parentElement;
    while (curr && curr !== pageContainer && curr !== document.body) {
      if (selectedSet.has(curr)) {
        hasAncestor = true;
        break;
      }
      curr = curr.parentElement;
    }

    if (!hasAncestor) {
      const rect = el.getBoundingClientRect();
      if (
        rect.width > 6 &&
        rect.height > 6 &&
        rect.bottom > -20 &&
        rect.top < window.innerHeight + 20
      ) {
        selected.push({ el, rect, isNav: false });
        selectedSet.add(el);
      }
    }
  }

  return selected;
}

// -------------------------------------------------------------
// Stage 2: 420ms Suction with Tidal Spaghettification & Spiral Vortex
// Sucks all individual DOM elements into (targetX, targetY)
// -------------------------------------------------------------
function runElementSuction(targetX, targetY) {
  if (typeof window === "undefined") return;

  const tx = typeof targetX === "number" ? targetX : window.innerWidth / 2;
  const ty = typeof targetY === "number" ? targetY : window.innerHeight / 2;
  const maxDist = Math.hypot(window.innerWidth, window.innerHeight);

  fadeNavbar("out", 380);

  const elements = getSuckableElements();

  elements.forEach(({ el, rect }) => {
    const elX = rect.left + rect.width / 2;
    const elY = rect.top + rect.height / 2;
    const dx = tx - elX;
    const dy = ty - elY;
    const dist = Math.hypot(dx, dy);
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI;

    // Perpendicular vector for rotational vortex swirl (Archimedean spiral)
    const perpX = -dy * 0.32;
    const perpY = dx * 0.32;

    const normDist = Math.min(1, dist / maxDist);
    const delayMs = Math.round(normDist * 35);

    // True relativistic tidal spaghettification keyframes:
    // 1. Gravitational elongation along radial vector (scaleX stretch, scaleY squeeze)
    // 2. Transverse shear and helical vortex twist
    // 3. Compression through 48px event horizon
    const keyframes = [
      {
        transform: "translate3d(0, 0, 0) scale(1, 1) rotate(0deg) skew(0deg, 0deg)",
        opacity: 1,
        offset: 0,
      },
      {
        // Tidal pull & initial elongation
        transform: `translate3d(${dx * 0.28 + perpX * 0.18}px, ${dy * 0.28 + perpY * 0.18}px, 0) scale(1.15, 0.85) rotate(${angleDeg * 0.15}deg) skew(${angleDeg * 0.05}deg, 0deg)`,
        opacity: 1,
        offset: 0.35,
      },
      {
        // Spaghettification funnel: elongated along trajectory, spiraling into singularity
        transform: `translate3d(${dx * 0.72 + perpX * 0.42}px, ${dy * 0.72 + perpY * 0.42}px, 0) scale(0.45, 0.15) rotate(${angleDeg * 0.4}deg) skew(${angleDeg * 0.15}deg, ${angleDeg * 0.08}deg)`,
        opacity: 0.85,
        offset: 0.72,
      },
      {
        // Event horizon absorption: plunging into 48px singularity
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.001, 0.001) rotate(${angleDeg * 0.75}deg)`,
        opacity: 0,
        offset: 1,
      },
    ];

    try {
      const anim = el.animate(keyframes, {
        duration: Math.max(220, TIMING.SUCKING - delayMs),
        delay: delayMs,
        easing: "cubic-bezier(0.38, 0, 0.12, 1)",
        fill: "forwards",
      });
      activeAnimations.add(anim);
    } catch {}
  });
}

// -------------------------------------------------------------
// Stage 5: Big Bang Detonation & Element Release from Screen Center
// -------------------------------------------------------------
function runElementRelease(targetX, targetY) {
  if (typeof window === "undefined") return;

  const cx = typeof targetX === "number" ? targetX : window.innerWidth / 2;
  const cy = typeof targetY === "number" ? targetY : window.innerHeight / 2;
  const maxDist = Math.hypot(window.innerWidth, window.innerHeight);

  fadeNavbar("in", TIMING.RELEASING);

  const elements = getSuckableElements();

  elements.forEach(({ el, rect }) => {
    const elX = rect.left + rect.width / 2;
    const elY = rect.top + rect.height / 2;
    const dx = cx - elX;
    const dy = cy - elY;
    const dist = Math.hypot(dx, dy);

    const normDist = Math.min(1, dist / maxDist);
    const delayMs = Math.round(normDist * 25);

    const releaseKeyframes = [
      {
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.04, 0.04)`,
        opacity: 0,
        offset: 0,
      },
      {
        transform: `translate3d(${dx * -0.02}px, ${dy * -0.02}px, 0) scale(1.03, 1.03)`,
        opacity: 0.95,
        offset: 0.7,
      },
      {
        transform: "translate3d(0, 0, 0) scale(1, 1)",
        opacity: 1,
        offset: 1,
      },
    ];

    try {
      const anim = el.animate(releaseKeyframes, {
        duration: Math.max(240, TIMING.RELEASING - delayMs),
        delay: delayMs,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      });

      activeAnimations.add(anim);
      anim.onfinish = () => {
        activeAnimations.delete(anim);
        try {
          anim.cancel();
        } catch {}
        el.style.transform = "";
        el.style.opacity = "";
        el.style.filter = "";
        el.style.clipPath = "";
      };
    } catch {}
  });
}

// -------------------------------------------------------------
// The Cinematic Black Hole Singularity Overlay
// Monochromatic Apple aesthetic: Obsidian Black #000000 + Relativistic Photon Ring
// Start size: strictly 48x48px
// -------------------------------------------------------------
function BlackHoleVortexOverlay({ phase, singularityPos }) {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);

  // Ball Squash & Stretch physics state
  const lastPosRef = useRef({ x: 0, y: 0, time: 0, initialized: false });
  const prevAngleRef = useRef(0);
  const stopTimerRef = useRef(null);
  const [stretchState, setStretchState] = useState({
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
  });

  const isCentering = phase === "centering";
  const isReleasing = phase === "releasing";
  const isBloating = phase === "bloating";
  const isSucking = phase === "sucking";
  const isOpening = phase === "opening";
  const isTransitioning = phase !== "idle";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const isTouchOnly =
      !hasFinePointer &&
      (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
    setIsTouchDevice(isTouchOnly);
    if (isTouchOnly) return;

    document.documentElement.classList.add("black-hole-cursor-active");

    const handleMouseMove = (e) => {
      const now = performance.now();
      const prev = lastPosRef.current;

      if (!prev.initialized) {
        lastPosRef.current = { x: e.clientX, y: e.clientY, time: now, initialized: true };
        setMousePos({ x: e.clientX, y: e.clientY });
        setCursorVisible(true);
        return;
      }

      const dt = Math.max(1, now - prev.time);
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      const dist = Math.hypot(dx, dy);

      // Speed normalized to ~60fps frame displacement
      const speed = Math.min(dist / (dt / 16.67), 35);

      lastPosRef.current = { x: e.clientX, y: e.clientY, time: now, initialized: true };
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!cursorVisible) setCursorVisible(true);

      if (dist > 1.2) {
        // Continuous angle calculation along exact direction of velocity
        const rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const prevAngle = prevAngleRef.current;
        let diff = (rawAngle - prevAngle) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        const continuousAngle = prevAngle + diff;
        prevAngleRef.current = continuousAngle;

        // Ball stretch along movement direction, proportional squash across
        const stretch = 1 + Math.min(speed * 0.025, 0.55);
        const squash = 1 / Math.sqrt(stretch);

        setStretchState({
          scaleX: stretch,
          scaleY: squash,
          rotate: continuousAngle,
        });

        if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
        stopTimerRef.current = setTimeout(() => {
          setStretchState((curr) => ({
            scaleX: 1,
            scaleY: 1,
            rotate: curr.rotate,
          }));
        }, 70);
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("[data-flip-calendar]") ||
        target.closest("[data-magnetic]")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setCursorVisible(false);
    const handleMouseEnter = () => setCursorVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      document.documentElement.classList.remove("black-hole-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorVisible]);

  const screenCenter =
    typeof window !== "undefined"
      ? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      : { x: 0, y: 0 };

  // If mobile touch device and idle, nothing to render (touch has no hover cursor)
  if (isTouchDevice && !isTransitioning) {
    return null;
  }

  // Active coordinates
  // While idle: follows mouse cursor
  // While transitioning: starts at click position (which was cursor position), then centers
  const activeX = isCentering
    ? [singularityPos.x, screenCenter.x]
    : isReleasing
    ? screenCenter.x
    : isTransitioning
    ? singularityPos.x
    : mousePos.x;

  const activeY = isCentering
    ? [singularityPos.y, screenCenter.y]
    : isReleasing
    ? screenCenter.y
    : isTransitioning
    ? singularityPos.y
    : mousePos.y;

  return (
    <div
      className="fixed inset-0 z-[99998] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Handover Spatial Depth Veil during Transition */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={
            isCentering
              ? { opacity: [0, 0.12, 0.18] }
              : isReleasing
              ? { opacity: [0.18, 0.05, 0] }
              : { opacity: 0 }
          }
          transition={{
            duration: isCentering ? TIMING.CENTERING / 1000 : TIMING.RELEASING / 1000,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-black/10 backdrop-blur-[1.5px] pointer-events-none"
        />
      )}

      {/* The Black Hole Container (Mouse Pointer <-> Active Singularity) */}
      <motion.div
        animate={{
          left: activeX,
          top: activeY,
          opacity: isTransitioning ? 1 : cursorVisible ? 1 : 0,
        }}
        transition={
          isCentering
            ? { duration: TIMING.CENTERING / 1000, ease: [0.35, 0, 0.15, 1] }
            : isTransitioning
            ? { duration: 0 }
            : { duration: 0.02, ease: "linear" }
        }
        style={{
          position: "fixed",
          transform: "translate(-50%, -50%)",
        }}
        className="flex items-center justify-center pointer-events-none"
      >
        {/* Direction Rotator: Orient coordinate system along velocity trajectory */}
        <motion.div
          animate={{
            rotate: isTransitioning ? 0 : stretchState.rotate,
          }}
          transition={
            isTransitioning
              ? { duration: 0 }
              : { type: "spring", stiffness: 650, damping: 36, mass: 0.15 }
          }
          className="flex items-center justify-center pointer-events-none"
        >
          {/* The Black Hole Ball (with Squash & Stretch Physics in local trajectory coordinates) */}
          <motion.div
            animate={
              isOpening
                ? {
                    scaleX: [1, 5.2],
                    scaleY: [1, 5.2],
                    opacity: 1,
                    borderRadius: "50%",
                  }
                : isSucking
                ? {
                    scaleX: [5.2, 6.2, 5.5],
                    scaleY: [5.2, 6.2, 5.5],
                    opacity: 1,
                    borderRadius: "50%",
                  }
                : isBloating
                ? {
                    scaleX: [5.5, 4.2, 8.8, 7.8],
                    scaleY: [5.5, 4.2, 8.8, 7.8],
                    opacity: 1,
                    borderRadius: [
                      "50%",
                      "64% 36% 60% 40% / 38% 62% 38% 62%",
                      "38% 62% 40% 60% / 60% 40% 60% 40%",
                      "54% 46% 52% 48% / 48% 52% 48% 52%",
                      "50%",
                    ],
                  }
                : isCentering
                ? {
                    scaleX: [7.8, 8.8, 7.2],
                    scaleY: [7.8, 8.8, 7.2],
                    opacity: 1,
                    borderRadius: "50%",
                  }
                : isReleasing
                ? {
                    scaleX: [7.2, 14, 0],
                    scaleY: [7.2, 14, 0],
                    opacity: [1, 0.75, 0],
                  }
                : {
                    scaleX: isMouseDown
                      ? 0.88
                      : stretchState.scaleX * (isHovering ? 1.35 : 1),
                    scaleY: isMouseDown
                      ? 0.88
                      : stretchState.scaleY * (isHovering ? 1.35 : 1),
                    opacity: 1,
                    borderRadius: "50%",
                  }
            }
            transition={
              isOpening
                ? { duration: TIMING.OPENING / 1000, ease: [0.16, 1, 0.3, 1] }
                : isSucking
                ? { duration: TIMING.SUCKING / 1000, ease: "easeInOut" }
                : isBloating
                ? {
                    duration: TIMING.BLOATING / 1000,
                    ease: "easeInOut",
                    times: [0, 0.25, 0.6, 0.85, 1],
                  }
                : isCentering
                ? { duration: TIMING.CENTERING / 1000, ease: [0.35, 0, 0.15, 1] }
                : isReleasing
                ? { duration: TIMING.RELEASING / 1000, ease: [0.16, 1, 0.3, 1] }
                : {
                    scaleX: { type: "spring", stiffness: 450, damping: 25, mass: 0.25 },
                    scaleY: { type: "spring", stiffness: 450, damping: 25, mass: 0.25 },
                  }
            }
            className="relative z-10 w-[18px] h-[18px] bg-[#000000] flex items-center justify-center shrink-0 border border-white/20"
            style={{
              boxShadow: isTransitioning
                ? "0 0 35px 10px rgba(0, 0, 0, 0.95), 0 0 70px 20px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 0, 0, 1)"
                : "0 2px 10px rgba(0, 0, 0, 0.45), 0 0 4px rgba(0, 0, 0, 0.8), inset 0 0 4px rgba(255, 255, 255, 0.35)",
            }}
          />
        </motion.div>

        {/* Big Bang Shockwave Expansion on Release */}
        <AnimatePresence>
          {isReleasing && (
            <motion.div
              key="detonation-shockwave"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 5.5, opacity: 0 }}
              transition={{
                duration: TIMING.RELEASING / 1000,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute w-[86px] h-[86px] rounded-full pointer-events-none"
              style={{
                boxShadow: "0 0 50px 14px rgba(0,0,0,0.55)",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// -------------------------------------------------------------
// Provider & Transition Orchestrator with Route Synchronization
// -------------------------------------------------------------
export function BlackHoleTransitionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState("idle");
  const [singularityPos, setSingularityPos] = useState({ x: 0, y: 0 });

  const phaseRef = useRef("idle");
  phaseRef.current = phase;

  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const timersRef = useRef([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  }, []);

  // Quick fallback release
  const triggerInstantRelease = useCallback(() => {
    clearAllTimers();
    clearAllActiveElementAnimations();
    setPhase("releasing");
    phaseRef.current = "releasing";
    playReleaseDetonationSound();

    runElementRelease(window.innerWidth / 2, window.innerHeight / 2);

    const t = setTimeout(() => {
      setPhase("idle");
      phaseRef.current = "idle";
      clearAllActiveElementAnimations();
    }, TIMING.RELEASING + 50);
    timersRef.current.push(t);
  }, [clearAllTimers]);

  const lastMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  // Execute the exact 5-stage transition
  const navigate = useCallback(
    (href, clickPos) => {
      if (!href) return;
      if (phaseRef.current !== "idle") return;

      const cleanTarget = href.split("#")[0].split("?")[0];
      const cleanCurrent = (pathnameRef.current || "").split("#")[0].split("?")[0];
      if (cleanTarget === cleanCurrent) return;

      clearAllTimers();
      clearAllActiveElementAnimations();

      const rawX =
        clickPos && typeof clickPos.x === "number" && clickPos.x > 0
          ? clickPos.x
          : lastMousePosRef.current.x > 0
          ? lastMousePosRef.current.x
          : typeof window !== "undefined" ? window.innerWidth / 2 : 0;
      const rawY =
        clickPos && typeof clickPos.y === "number" && clickPos.y > 0
          ? clickPos.y
          : lastMousePosRef.current.y > 0
          ? lastMousePosRef.current.y
          : typeof window !== "undefined" ? window.innerHeight / 2 : 0;

      // Keep singularity fully inside viewport
      const margin = 60;
      const winW = typeof window !== "undefined" ? window.innerWidth : 800;
      const winH = typeof window !== "undefined" ? window.innerHeight : 600;
      const pos = {
        x: Math.max(margin, Math.min(winW - margin, rawX)),
        y: Math.max(margin, Math.min(winH - margin, rawY)),
      };

      setSingularityPos(pos);

      // Stage 1: Black hole opens at click point with strictly 48x48px start size (180ms)
      setPhase("opening");
      phaseRef.current = "opening";
      playOpeningSound();

      // Stage 2: Sucks all elements with tidal spaghettification & spiral vortex (420ms)
      const t1 = setTimeout(() => {
        setPhase("sucking");
        phaseRef.current = "sucking";
        playGravitationalTremorSound();
        runElementSuction(pos.x, pos.y);
      }, TIMING.OPENING);
      timersRef.current.push(t1);

      // Stage 3: Compressed to a bloated bubble wobbling under pressure (240ms)
      const t2 = setTimeout(() => {
        setPhase("bloating");
        phaseRef.current = "bloating";
        playBloatedBubbleSound();
      }, TIMING.OPENING + TIMING.SUCKING);
      timersRef.current.push(t2);

      // Stage 4: High-velocity gravitational slingshot to screen center (300ms)
      const t3 = setTimeout(() => {
        setPhase("centering");
        phaseRef.current = "centering";
        playRushToCenterSound();
      }, TIMING.OPENING + TIMING.SUCKING + TIMING.BLOATING);
      timersRef.current.push(t3);

      // Route Handover: Trigger route change & reset scroll position right at the peak of centering
      const t4 = setTimeout(() => {
        router.push(href);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      }, TIMING.OPENING + TIMING.SUCKING + TIMING.BLOATING + Math.round(TIMING.CENTERING * 0.75));
      timersRef.current.push(t4);

      // Stage 5: Big Bang Detonation & Release from screen center (320ms)
      const t5 = setTimeout(() => {
        setPhase("releasing");
        phaseRef.current = "releasing";
        playReleaseDetonationSound();

        // Clear previous suction animations
        clearAllActiveElementAnimations();

        // Reset scroll strictly to top
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }

        // Run element release explosion from center
        runElementRelease(window.innerWidth / 2, window.innerHeight / 2);
      }, TIMING.OPENING + TIMING.SUCKING + TIMING.BLOATING + TIMING.CENTERING);
      timersRef.current.push(t5);

      // Reset to idle with safety buffer
      const t6 = setTimeout(() => {
        setPhase("idle");
        phaseRef.current = "idle";
        clearAllActiveElementAnimations();
      }, TIMING.OPENING + TIMING.SUCKING + TIMING.BLOATING + TIMING.CENTERING + TIMING.RELEASING + 60);
      timersRef.current.push(t6);
    },
    [router, clearAllTimers]
  );

  // Guarantee clean DOM restoration and scroll reset on route changes
  useEffect(() => {
    clearAllActiveElementAnimations();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  useEffect(() => {
    if (phase === "idle") {
      clearAllActiveElementAnimations();
    }
  }, [phase]);

  useEffect(() => {
    globalTriggerTransition = navigate;
    if (typeof window !== "undefined") {
      window.blackHoleNavigate = navigate;
    }
    return () => {
      globalTriggerTransition = null;
    };
  }, [navigate]);

  // Intercept Global Internal Link Clicks and Capture Click Coordinates
  useEffect(() => {
    const handleDocumentClick = (e) => {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return;
      }

      const current = window.location.pathname;
      const target = href.split("?")[0].split("#")[0];
      if (target === current) {
        return;
      }

      e.preventDefault();
      navigate(href, { x: e.clientX, y: e.clientY });
    };

    document.addEventListener("click", handleDocumentClick, true);

    const handlePopState = () => {
      if (phaseRef.current === "idle") {
        triggerInstantRelease();
      }
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, triggerInstantRelease]);

  return (
    <BlackHoleContext.Provider value={{ phase, navigate }}>
      <div id="black-hole-page" className="w-full min-h-screen">
        {children}
      </div>

      <BlackHoleVortexOverlay
        phase={phase}
        singularityPos={singularityPos}
      />
    </BlackHoleContext.Provider>
  );
}
