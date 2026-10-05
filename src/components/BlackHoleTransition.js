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
// Stage Timings (Strict adherence to the 5-phase choreography):
// 1. opening   (200ms) - Black hole opens at click point (48x48px start size)
// 2. sucking   (400ms) - Sucks all elements (with visible Genie funnel & spacetime distortion)
// 3. bloating  (300ms) - Wobbles & pulsates like a bloated bubble under pressure
// 4. centering (400ms) - Rushes from click point to screen center (50vw, 50vh)
// 5. releasing (300ms) - New page + navbar erupt from the black hole at center
// Total: 1600ms
// -------------------------------------------------------------
const TIMING = {
  OPENING: 200,
  SUCKING: 400,
  BLOATING: 300,
  CENTERING: 400,
  RELEASING: 300,
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
// Web Audio: Monochromatic Synthesized Gravitational Sounds
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
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.18);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);

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

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(62, now);
    osc.frequency.exponentialRampToValueAtTime(22, now + 0.38);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.12, now + 0.08);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.39);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);

    const bufferSize = Math.floor(ctx.sampleRate * 0.38);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(130, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(40, now + 0.38);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.045, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.39);

    setTimeout(() => {
      try { ctx.close(); } catch {}
    }, 550);
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
    osc.frequency.setValueAtTime(38, now);
    osc.frequency.linearRampToValueAtTime(52, now + 0.12);
    osc.frequency.linearRampToValueAtTime(34, now + 0.22);
    osc.frequency.linearRampToValueAtTime(44, now + 0.29);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.29);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);

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
    osc.frequency.setValueAtTime(32, now);
    osc.frequency.exponentialRampToValueAtTime(95, now + 0.35);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);

    setTimeout(() => {
      try { ctx.close(); } catch {}
    }, 550);
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
    osc.frequency.setValueAtTime(30, now);
    osc.frequency.exponentialRampToValueAtTime(85, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.28);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.29);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);

    setTimeout(() => {
      try { ctx.close(); } catch {}
    }, 450);
  } catch {}
}

// -------------------------------------------------------------
// Track active element animations to ensure 100% clean DOM restoration
// -------------------------------------------------------------
const activeAnimations = new Set();

function clearAllActiveElementAnimations() {
  // 1. Cancel all tracked active animations
  activeAnimations.forEach((anim) => {
    try {
      anim.cancel();
    } catch {}
  });
  activeAnimations.clear();

  if (typeof document !== "undefined") {
    // 2. Global W3C Web Animations API cancellation across the entire document
    if (typeof document.getAnimations === "function") {
      try {
        document.getAnimations().forEach((anim) => {
          try {
            anim.cancel();
          } catch {}
        });
      } catch {}
    }

    // 3. Cancel and reset ALL inline styles on header, navbar clusters, and page elements
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
// (Fades ONLY background glass, keeping buttons/text 100% visible to distort!)
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
    // 1. Bento & Grid Card Divisions (Crucial for sucking entire card boxes!)
    ".grid > div",
    ".grid > figure",
    ".grid > article",
    ".grid > a",
    // 2. Semantic card containers & divisions
    "figure",
    "article",
    "[data-card]",
    ".retro-card",
    "[data-flip-calendar]",
    // 3. Styled card divisions with rounded corners & backgrounds
    "div[class*='rounded-3xl']",
    "div[class*='rounded-[28px]']",
    "div[class*='rounded-2xl']",
    "div[class*='rounded-[30px]']",
    "div[class*='rounded-[22px]']",
    "div[class*='rounded-[26px]']",
    // 4. Project card links
    "a.group",
    "a[href^='/works/']",
    "a[href^='/case-studies/']",
    // 5. Standalone headings, paragraphs, and controls outside cards
    "h1", "h2", "h3", "h4",
    "p",
    "button", "a",
    "img",
    "li",
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
        rect.bottom > 0 &&
        rect.top < window.innerHeight
      ) {
        selected.push({ el, rect, isNav: false });
        selectedSet.add(el);
      }
    }
  }

  return selected;
}

// -------------------------------------------------------------
// Stage 2: 400ms Suction with macOS Genie Funnel & Spaghettification
// Sucks all individual DOM elements (including navbar items) into (targetX, targetY)
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

    // Perpendicular vector for rotational vortex swirl
    const perpX = -dy * 0.28;
    const perpY = dx * 0.28;

    const normDist = Math.min(1, dist / maxDist);
    const delayMs = Math.round(normDist * 40);

    const keyframes = [
      {
        transform: "translate3d(0, 0, 0) scale(1, 1) rotate(0deg) skew(0deg, 0deg)",
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        filter: "blur(0px) brightness(1)",
        opacity: 1,
        offset: 0,
      },
      {
        // Stage 1: Gravitational pull & initial tidal elongation into funnel
        transform: `translate3d(${dx * 0.25 + perpX * 0.3}px, ${dy * 0.25 + perpY * 0.3}px, 0) scale(1.35, 0.75) rotate(${angleDeg * 0.15}deg) skew(${angleDeg > 0 ? 12 : -12}deg, 0deg)`,
        clipPath: "polygon(8% 0%, 92% 0%, 80% 100%, 20% 100%)",
        filter: "blur(0.5px) brightness(1.08)",
        opacity: 1,
        offset: 0.3,
      },
      {
        // Stage 2: Apple Genie Funnel (elongated into spaghettified beam spiraling into the vortex)
        transform: `translate3d(${dx * 0.75 + perpX * 0.65}px, ${dy * 0.75 + perpY * 0.65}px, 0) scale(2.2, 0.22) rotate(${angleDeg * 0.45}deg) skew(${angleDeg > 0 ? 25 : -25}deg, 0deg)`,
        clipPath: "polygon(18% 0%, 82% 0%, 60% 100%, 40% 100%)",
        filter: "blur(2px) brightness(1.2)",
        opacity: 0.95,
        offset: 0.68,
      },
      {
        // Stage 3: Plunging into Singularity Event Horizon (48x48px)
        transform: `translate3d(${dx * 0.96}px, ${dy * 0.96}px, 0) scale(0.25, 0.05) rotate(${angleDeg * 0.8}deg)`,
        clipPath: "polygon(40% 0%, 60% 0%, 52% 100%, 48% 100%)",
        filter: "blur(5px) brightness(1.5)",
        opacity: 0.6,
        offset: 0.92,
      },
      {
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.001, 0.001) rotate(${angleDeg}deg)`,
        clipPath: "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)",
        filter: "blur(10px) brightness(2)",
        opacity: 0,
        offset: 1,
      },
    ];

    try {
      const anim = el.animate(keyframes, {
        duration: Math.max(260, 400 - delayMs),
        delay: delayMs,
        easing: "cubic-bezier(0.5, 0, 0.2, 1)",
        fill: "forwards",
      });
      activeAnimations.add(anim);
      // Suction animation remains tracked in activeAnimations until explicitly cancelled at Stage 5
    } catch {
      try {
        const fallbackKeyframes = keyframes.map(({ clipPath, ...rest }) => rest);
        const anim = el.animate(fallbackKeyframes, {
          duration: Math.max(260, 400 - delayMs),
          delay: delayMs,
          easing: "cubic-bezier(0.5, 0, 0.2, 1)",
          fill: "forwards",
        });
        activeAnimations.add(anim);
        // Suction animation remains tracked in activeAnimations until explicitly cancelled at Stage 5
      } catch {}
    }
  });
}

// -------------------------------------------------------------
// Stage 5: 300ms Element Release from Black Hole at Screen Center
// -------------------------------------------------------------
function runElementRelease(targetX, targetY) {
  if (typeof window === "undefined") return;

  const cx = typeof targetX === "number" ? targetX : window.innerWidth / 2;
  const cy = typeof targetY === "number" ? targetY : window.innerHeight / 2;
  const maxDist = Math.hypot(window.innerWidth, window.innerHeight);

  fadeNavbar("in", 300);

  const elements = getSuckableElements();

  elements.forEach(({ el, rect }) => {
    const elX = rect.left + rect.width / 2;
    const elY = rect.top + rect.height / 2;
    const dx = cx - elX;
    const dy = cy - elY;
    const dist = Math.hypot(dx, dy);
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI;

    const normDist = Math.min(1, dist / maxDist);
    const delayMs = Math.round(normDist * 25);

    const releaseKeyframes = [
      {
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.02, 0.02) rotate(${angleDeg}deg)`,
        clipPath: "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)",
        filter: "blur(10px) brightness(1.6)",
        opacity: 0,
        offset: 0,
      },
      {
        transform: `translate3d(${dx * -0.04}px, ${dy * -0.04}px, 0) scale(1.04, 1.04) rotate(${-angleDeg * 0.05}deg)`,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        filter: "blur(0.5px) brightness(1.05)",
        opacity: 0.95,
        offset: 0.65,
      },
      {
        transform: "translate3d(0, 0, 0) scale(1, 1) rotate(0deg) skew(0deg, 0deg)",
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        filter: "blur(0px) brightness(1)",
        opacity: 1,
        offset: 1,
      },
    ];

    try {
      const anim = el.animate(releaseKeyframes, {
        duration: Math.max(240, 280 - delayMs),
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
        // Explicitly clear inline styles to guarantee 100% natural, visible layout
        el.style.transform = "";
        el.style.opacity = "";
        el.style.filter = "";
        el.style.clipPath = "";
      };
    } catch {
      try {
        const fallbackRelease = releaseKeyframes.map(({ clipPath, ...rest }) => rest);
        const anim = el.animate(fallbackRelease, {
          duration: Math.max(240, 280 - delayMs),
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
    }
  });
}

// -------------------------------------------------------------
// The Black Hole Singularity Overlay
// Monochromatic Apple aesthetic: Obsidian Black #000000 + Silver/White Ring
// Start size: 48x48px
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
        Handover Veil:
        STRICTLY 0% opacity during opening, sucking, and bloating so user clearly
        sees page and navbar elements distort into the 48x48px click point!
        Only conceals DOM replacement at the end of centering -> releasing.
      */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={
          isCentering
            ? { opacity: [0, 0, 0.85, 1] }
            : isReleasing
            ? { opacity: [1, 0.35, 0] }
            : { opacity: 0 }
        }
        transition={
          isCentering
            ? { duration: 0.4, times: [0, 0.6, 0.85, 1], ease: "easeInOut" }
            : isReleasing
            ? { duration: 0.3, ease: "easeOut" }
            : { duration: 0 }
        }
        className="absolute inset-0 bg-[#000000]"
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
            ? { duration: 0.4, ease: [0.35, 0, 0.15, 1] }
            : { duration: 0 }
        }
        style={{
          position: "fixed",
          transform: "translate(-50%, -50%)",
        }}
        className="flex items-center justify-center pointer-events-none"
      >
        {/* Monochromatic Accretion Photon Ring (proportional to 48px core) */}
        <motion.div
          animate={
            isOpening
              ? { scale: [0, 1], rotate: [0, 90], opacity: [0, 0.85] }
              : isSucking
              ? { scale: [1, 1.2, 1], rotate: [90, 270], opacity: 0.9 }
              : isBloating
              ? {
                  scale: [1, 0.8, 2.5, 2.1],
                  rotate: [270, 360],
                  opacity: [0.9, 1, 0.9],
                  borderRadius: [
                    "50%",
                    "62% 38% 58% 42% / 42% 58% 42% 58%",
                    "40% 60% 38% 62% / 62% 38% 62% 38%",
                    "50%",
                  ],
                }
              : isCentering
              ? { scale: [2.1, 2.4, 2.0], rotate: [360, 480], opacity: 0.95 }
              : isReleasing
              ? { scale: [2.0, 4.2], opacity: [0.95, 0] }
              : { scale: 0, opacity: 0 }
          }
          transition={
            isOpening
              ? { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
              : isSucking
              ? { duration: 0.4, ease: "easeInOut" }
              : isBloating
              ? { duration: 0.3, ease: "easeInOut", times: [0, 0.25, 0.65, 1] }
              : isCentering
              ? { duration: 0.4, ease: [0.35, 0, 0.15, 1] }
              : isReleasing
              ? { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0 }
          }
          className="absolute w-[84px] h-[84px] rounded-full pointer-events-none"
          style={{
            boxShadow: "0 0 35px 12px rgba(0,0,0,0.7), inset 0 0 20px rgba(0,0,0,0.8)",
          }}
        />

        {/* 
          The Black Hole Core / Event Horizon (Obsidian Void):
          Start size is exactly 48x48px!
          Pure obsidian black with deep gravitational lensing — NO white borders!
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
                  scale: [1, 0.72, 2.35, 1.95],
                  opacity: 1,
                  borderRadius: [
                    "50%",
                    "66% 34% 62% 38% / 36% 64% 36% 64%",
                    "35% 65% 38% 62% / 62% 38% 62% 38%",
                    "58% 42% 54% 46% / 46% 54% 46% 54%",
                    "50%",
                  ],
                }
              : isCentering
              ? { scale: [1.95, 2.2, 1.8], opacity: 1, borderRadius: "50%" }
              : isReleasing
              ? { scale: [1.8, 2.3, 0], opacity: [1, 0.7, 0] }
              : { scale: 0, opacity: 0 }
          }
          transition={
            isOpening
              ? { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
              : isSucking
              ? { duration: 0.4, ease: "easeInOut" }
              : isBloating
              ? { duration: 0.3, ease: "easeInOut", times: [0, 0.25, 0.6, 0.85, 1] }
              : isCentering
              ? { duration: 0.4, ease: [0.35, 0, 0.15, 1] }
              : isReleasing
              ? { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
              : { duration: 0 }
          }
          className="relative z-10 w-[48px] h-[48px] bg-[#000000] flex items-center justify-center shrink-0"
          style={{
            boxShadow: `
              0 0 20px 4px rgba(0, 0, 0, 0.95),
              0 0 45px 12px rgba(0, 0, 0, 0.85),
              inset 0 0 16px rgba(0, 0, 0, 1)
            `,
          }}
        />

        {/* Explosive Gravitational Shockwave on Release (Pure Void Shockwave) */}
        <AnimatePresence>
          {isReleasing && (
            <motion.div
              key="detonation-shockwave"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 4.5, opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute w-[84px] h-[84px] rounded-full pointer-events-none"
              style={{
                boxShadow: "0 0 40px 10px rgba(0,0,0,0.5)",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// -------------------------------------------------------------
// Provider & Transition Orchestrator with 5-Stage Storyboard & Camera Shake
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

  // Quick fallback release (e.g. for popstate/back button)
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

      const pos =
        clickPos &&
        typeof clickPos.x === "number" &&
        typeof clickPos.y === "number"
          ? { x: clickPos.x, y: clickPos.y }
          : {
              x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
              y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
            };

      setSingularityPos(pos);

      // Stage 1: Black hole opens at click point with 48x48px start size (200ms)
      setPhase("opening");
      phaseRef.current = "opening";
      playOpeningSound();

      // Stage 2: Sucks all elements with Genie funnel & spacetime distortion (400ms)
      const t1 = setTimeout(() => {
        setPhase("sucking");
        phaseRef.current = "sucking";
        playGravitationalTremorSound();
        runElementSuction(pos.x, pos.y);
      }, TIMING.OPENING);
      timersRef.current.push(t1);

      // Stage 3: Compressed to a bloated bubble wobbling under pressure (300ms)
      const t2 = setTimeout(() => {
        setPhase("bloating");
        phaseRef.current = "bloating";
        playBloatedBubbleSound();
      }, TIMING.OPENING + TIMING.SUCKING);
      timersRef.current.push(t2);

      // Stage 4: Can't take more and rushes to screen center (400ms)
      const t3 = setTimeout(() => {
        setPhase("centering");
        phaseRef.current = "centering";
        playRushToCenterSound();
      }, TIMING.OPENING + TIMING.SUCKING + TIMING.BLOATING);
      timersRef.current.push(t3);

      // Handover: Push route near climax of centering (350ms into centering)
      const t4 = setTimeout(() => {
        router.push(href);
      }, TIMING.OPENING + TIMING.SUCKING + TIMING.BLOATING + 350);
      timersRef.current.push(t4);

      // Stage 5: New page & navbar come out of the black hole at center (300ms)
      const t5 = setTimeout(() => {
        setPhase("releasing");
        phaseRef.current = "releasing";
        playReleaseDetonationSound();

        // Clear previous suction fill:"forwards" animations so all DOM nodes restore natural coordinates
        clearAllActiveElementAnimations();

        // Synchronously run element release so all keyframes bind immediately
        runElementRelease(window.innerWidth / 2, window.innerHeight / 2);
      }, TIMING.OPENING + TIMING.SUCKING + TIMING.BLOATING + TIMING.CENTERING);
      timersRef.current.push(t5);

      // Reset to idle with safety buffer to allow all release animations to finish completely
      const t6 = setTimeout(() => {
        setPhase("idle");
        phaseRef.current = "idle";
        clearAllActiveElementAnimations();
      }, TIMING.OPENING + TIMING.SUCKING + TIMING.BLOATING + TIMING.CENTERING + TIMING.RELEASING + 60);
      timersRef.current.push(t6);
    },
    [router, clearAllTimers]
  );

  // Guarantee clean DOM restoration whenever idle or route changes
  useEffect(() => {
    if (phase === "idle") {
      clearAllActiveElementAnimations();
    }
  }, [pathname, phase]);

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
      clearAllTimers();
      clearAllActiveElementAnimations();
    };
  }, [navigate, triggerInstantRelease, clearAllTimers]);

  const isOpening = phase === "opening";
  const isSucking = phase === "sucking";
  const isBloating = phase === "bloating";
  const isCentering = phase === "centering";
  const isReleasing = phase === "releasing";

  return (
    <BlackHoleContext.Provider value={{ phase, navigate }}>
      {/* Gravitational Spacetime Wave Distortion Filter */}
      <svg
        className="fixed -top-[9999px] -left-[9999px] w-0 h-0 pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <filter
            id="black-hole-spacetime-distortion"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="32"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* The Central / Moving Black Hole Singularity Overlay */}
      <BlackHoleVortexOverlay phase={phase} singularityPos={singularityPos} />

      {/* 
        CAMERA SHAKE & SPACETIME DISTORTION WRAPPER:
        - In Sucking phase: Spacetime Gravitational Lensing dynamically bends all pixels!
        - Opening: subtle micro-vibration
        - Sucking: heavy gravitational tremors as matter accelerates
        - Bloating: rapid fluid bubble vibration
        - Centering: inertia shift
        - Releasing: explosive detonation recoil
      */}
      <motion.div
        className="w-full min-h-screen origin-center"
        style={{
          filter: isSucking ? "url(#black-hole-spacetime-distortion)" : "none",
        }}
        animate={
          isOpening
            ? {
                x: [0, -1, 1, -1, 0],
                y: [0, 1, -1, 1, 0],
              }
            : isSucking
            ? {
                x: [0, -4, 5, -7, 8, -6, 5, -2, 0],
                y: [0, 4, -5, 7, -6, 5, -4, 1, 0],
                rotate: [0, -0.7, 0.9, -1.2, 1.1, -0.5, 0],
              }
            : isBloating
            ? {
                x: [0, 2, -2, 3, -3, 2, 0],
                y: [0, -2, 3, -2, 2, -1, 0],
              }
            : isCentering
            ? {
                x: [0, -3, 2, -1, 0],
                y: [0, 3, -2, 1, 0],
              }
            : isReleasing
            ? {
                x: [0, 8, -6, 4, -2, 0],
                y: [0, -7, 5, -3, 1, 0],
                rotate: [0, 1.2, -0.8, 0.4, 0],
              }
            : { x: 0, y: 0, rotate: 0 }
        }
        transition={{
          duration: isOpening
            ? 0.2
            : isSucking
            ? 0.4
            : isBloating
            ? 0.3
            : isCentering
            ? 0.4
            : isReleasing
            ? 0.3
            : 0,
          ease: "easeInOut",
        }}
      >
        {children}
      </motion.div>
    </BlackHoleContext.Provider>
  );
}
