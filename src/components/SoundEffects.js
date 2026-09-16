"use client";

import { useEffect, useRef } from "react";

let globalAudioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!globalAudioCtx) {
      globalAudioCtx = new Ctx();
    }
    if (globalAudioCtx.state === "suspended") {
      globalAudioCtx.resume().catch(() => {});
    }
    return globalAudioCtx;
  } catch {
    return null;
  }
}

/**
 * Apple Haptic Click — crisp, tactile mechanical impulse
 * Similar to macOS Force Touch and iOS haptic selection
 */
export function playClickSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 1. Primary tactile sine transient (850Hz down to 120Hz)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(850, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.028);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.032);

    // 2. Micro high-frequency noise impulse for tactile snap
    const noiseDuration = 0.006;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * noiseDuration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.035;
    }

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 1400;

    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(ctx.destination);

    noiseSrc.start(now);
  } catch {
    // Audio is decorative — never throw
  }
}

/**
 * Apple Soft Pop — for theme toggles, tabs, and lens switching
 */
export function playPopSound(freq = 560) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.02);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.75, now + 0.055);

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.065);
  } catch {}
}

export default function SoundEffects() {
  const lastPlayedRef = useRef(0);

  useEffect(() => {
    // Listen for pointerdown or click on any interactive element
    const handlePointerDown = (e) => {
      // Throttle rapid double-clicks (min 40ms interval)
      const now = Date.now();
      if (now - lastPlayedRef.current < 40) return;

      const target = e.target;
      if (!target || typeof target.closest !== "function") return;

      // Check if clicking an interactive control
      const interactiveEl = target.closest(
        'button, a, [role="button"], input[type="button"], input[type="submit"], .segmentedTab, .lensBtn'
      );

      if (interactiveEl) {
        lastPlayedRef.current = now;

        // If it's a theme button or tab, play the softer pop; otherwise play tactile click
        const isThemeToggle = interactiveEl.getAttribute("aria-label")?.includes("appearance") ||
                              interactiveEl.getAttribute("aria-label")?.includes("theme") ||
                              interactiveEl.classList.contains("themeBtn");

        if (isThemeToggle) {
          playPopSound(620);
        } else {
          playClickSound();
        }
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return null;
}
