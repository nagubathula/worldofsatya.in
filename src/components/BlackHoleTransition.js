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
    // Reset any inline styles on header, navbar clusters, and page elements
    const allTargetEls = document.querySelectorAll(
      "header, header *, [data-nav-cluster], [data-nav-cluster] *, #black-hole-page, #black-hole-page *, main, main *"
    );
    allTargetEls.forEach((el) => {
      el.style.transform = "";
      el.style.opacity = "";
      el.style.filter = "";
      el.style.clipPath = "";
    });

    const header = document.querySelector("header");
    if (header) {
      header.style.backgroundColor = "";
      header.style.borderBottomColor = "";
      header.style.opacity = "";
      header.style.filter = "";
      header.style.transform = "";
    }
  }
}

// -------------------------------------------------------------
// Navbar background container gentle fade handler
// -------------------------------------------------------------
function fadeNavbar(inOut, duration) {
  if (typeof document === "undefined") return;
  const header = document.querySelector("header");
  if (!header) return;

  try {
    const anim = header.animate(
      inOut === "out"
        ? [
            { backgroundColor: "rgba(251, 251, 253, 0.8)", borderBottomColor: "rgba(0, 0, 0, 0.06)" },
            { backgroundColor: "rgba(251, 251, 253, 0)", borderBottomColor: "rgba(0, 0, 0, 0)" },
          ]
        : [
            { backgroundColor: "rgba(251, 251, 253, 0)", borderBottomColor: "rgba(0, 0, 0, 0)" },
            { backgroundColor: "rgba(251, 251, 253, 0.8)", borderBottomColor: "rgba(0, 0, 0, 0.06)" },
          ],
      {
        duration,
        easing:
          inOut === "out"
            ? "cubic-bezier(0.5, 0, 0.2, 1)"
            : "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      }
    );

    activeAnimations.add(anim);
    anim.onfinish = () => {
      activeAnimations.delete(anim);
      if (inOut === "in") {
        try {
          anim.cancel();
        } catch {}
        header.style.backgroundColor = "";
        header.style.borderBottomColor = "";
      }
    };
  } catch {}
}

// -------------------------------------------------------------
// Element Selection for Individual Apple-Style Suction & Release
// -------------------------------------------------------------
function getSuckableElements() {
  if (typeof window === "undefined" || typeof document === "undefined") return [];

  const selected = [];
  const selectedSet = new Set();

  // 1. Target Navbar cluster divisions (Brand, Segmented Pill, CTA)
  const header = document.querySelector("header");
  if (header) {
    const navClusters = Array.from(
      header.querySelectorAll("[data-nav-cluster]")
    );
    const clusters = navClusters.length > 0
      ? navClusters
      : Array.from(header.querySelectorAll(".max-w-6xl > div, .max-w-6xl > nav"));

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
    // Top-level sections & direct content containers
    "main > *",
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
    if (header && header.contains(el)) continue;
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
  if (phase === "idle") return null;

  const isCentering = phase === "centering";
  const isReleasing = phase === "releasing";
  const isBloating = phase === "bloating";
  const isSucking = phase === "sucking";
  const isOpening = phase === "opening";

  const screenCenter = typeof window !== "undefined"
    ? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    : { x: 0, y: 0 };

  return (
    <div
      className="fixed inset-0 z-[99998] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* 
        Handover Spatial Depth Veil:
        Subtle spatial dimming during centering & release — NO harsh pitch-black flashing!
      */}
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

      {/* 
        The Moving Black Hole Singularity Container:
        Positions at (singularityPos.x, singularityPos.y) during opening/sucking/bloating.
        Rushes to screen center during centering.
        Bursts at screen center during releasing.
      */}
      <motion.div
        initial={false}
        animate={
          isCentering
            ? {
                left: [singularityPos.x, screenCenter.x],
                top: [singularityPos.y, screenCenter.y],
              }
            : isReleasing
            ? {
                left: screenCenter.x,
                top: screenCenter.y,
              }
            : {
                left: singularityPos.x,
                top: singularityPos.y,
              }
        }
        transition={
          isCentering
            ? { duration: TIMING.CENTERING / 1000, ease: [0.35, 0, 0.15, 1] }
            : { duration: 0 }
        }
        style={{
          position: "fixed",
          transform: "translate(-50%, -50%)",
        }}
        className="flex items-center justify-center pointer-events-none"
      >
        {/* 
          Relativistic Accretion Halo & Doppler Photon Ring:
          Monochromatic, organic luminosity orbiting the 48px event horizon
        */}
        <motion.div
          animate={
            isOpening
              ? { scale: [0, 1], rotate: [0, 90], opacity: [0, 0.9] }
              : isSucking
              ? { scale: [1, 1.25, 1.1], rotate: [90, 360], opacity: 1 }
              : isBloating
              ? {
                  scale: [1.1, 0.9, 2.3, 2.0],
                  rotate: [360, 480],
                  opacity: [1, 0.95, 1],
                  borderRadius: [
                    "50%",
                    "60% 40% 58% 42% / 42% 58% 42% 58%",
                    "42% 58% 40% 60% / 60% 40% 60% 40%",
                    "50%",
                  ],
                }
              : isCentering
              ? { scale: [2.0, 2.3, 1.9], rotate: [480, 640], opacity: 1 }
              : isReleasing
              ? { scale: [1.9, 4.2], opacity: [1, 0] }
              : { scale: 0, opacity: 0 }
          }
          transition={
            isOpening
              ? { duration: TIMING.OPENING / 1000, ease: [0.16, 1, 0.3, 1] }
              : isSucking
              ? { duration: TIMING.SUCKING / 1000, ease: "linear" }
              : isBloating
              ? { duration: TIMING.BLOATING / 1000, ease: "easeInOut", times: [0, 0.25, 0.65, 1] }
              : isCentering
              ? { duration: TIMING.CENTERING / 1000, ease: [0.35, 0, 0.15, 1] }
              : isReleasing
              ? { duration: TIMING.RELEASING / 1000, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0 }
          }
          className="absolute w-[86px] h-[86px] rounded-full pointer-events-none"
          style={{
            background: "conic-gradient(from 180deg at 50% 50%, rgba(0,0,0,0.85) 0deg, rgba(0,0,0,0.95) 140deg, rgba(29,29,31,0.6) 260deg, rgba(0,0,0,0.9) 360deg)",
            boxShadow: `
              0 0 25px 8px rgba(0, 0, 0, 0.65),
              inset 0 0 15px rgba(0, 0, 0, 0.9)
            `,
          }}
        />

        {/* 
          The Black Hole Event Horizon (Singularity Core):
          Initial size: strictly 48x48px!
          Pure Obsidian Abyss (#000000) with deep gravitational gradient lensing.
          Bloated bubble physics in Stage 3: morphing border radius & pulsating scale!
        */}
        <motion.div
          animate={
            isOpening
              ? { scale: [0, 1], opacity: 1, borderRadius: "50%" }
              : isSucking
              ? { scale: [1, 1.15, 1], opacity: 1, borderRadius: "50%" }
              : isBloating
              ? {
                  scale: [1, 0.82, 2.2, 1.9],
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
              ? { scale: [1.9, 2.1, 1.75], opacity: 1, borderRadius: "50%" }
              : isReleasing
              ? { scale: [1.75, 2.4, 0], opacity: [1, 0.75, 0] }
              : { scale: 0, opacity: 0 }
          }
          transition={
            isOpening
              ? { duration: TIMING.OPENING / 1000, ease: [0.16, 1, 0.3, 1] }
              : isSucking
              ? { duration: TIMING.SUCKING / 1000, ease: "easeInOut" }
              : isBloating
              ? { duration: TIMING.BLOATING / 1000, ease: "easeInOut", times: [0, 0.25, 0.6, 0.85, 1] }
              : isCentering
              ? { duration: TIMING.CENTERING / 1000, ease: [0.35, 0, 0.15, 1] }
              : isReleasing
              ? { duration: TIMING.RELEASING / 1000, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0 }
          }
          className="relative z-10 w-[48px] h-[48px] bg-[#000000] flex items-center justify-center shrink-0"
          style={{
            boxShadow: `
              0 0 24px 6px rgba(0, 0, 0, 0.95),
              0 0 55px 14px rgba(0, 0, 0, 0.8),
              inset 0 0 18px rgba(0, 0, 0, 1)
            `,
          }}
        />

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
        clickPos && typeof clickPos.x === "number"
          ? clickPos.x
          : typeof window !== "undefined" ? window.innerWidth / 2 : 0;
      const rawY =
        clickPos && typeof clickPos.y === "number"
          ? clickPos.y
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
