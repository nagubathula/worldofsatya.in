"use client";

import { useEffect, useRef, useState } from "react";

let globalAudioCtx = null;
let soundEnabled = true;

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

export function isSoundEnabled() {
  return soundEnabled;
}

export function toggleSound() {
  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem("portfolio-sound", soundEnabled ? "true" : "false");
  } catch {}
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio-sound-change", { detail: soundEnabled }));
  }
  if (soundEnabled) {
    play8BitCoinSound();
  }
  return soundEnabled;
}

/**
 * Retro 8-Bit Coin Ping — Super Mario / Game Boy style
 */
export function play8BitCoinSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    // B5 (987.77 Hz) to E6 (1318.51 Hz)
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.setValueAtTime(0.04, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.33);
  } catch {}
}

/**
 * Retro 8-Bit Menu Blip — Game Boy / Pokémon menu selection
 */
export function play8BitBlipSound(freq = 587.33) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.035);

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {}
}

/**
 * Retro 8-Bit Click / Tap
 */
export function play8BitTapSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch {}
}

/**
 * Apple Soft Pop — fluid, juicy bubble pop sound
 */
export function playPopSound(freq = 560, volume = 0.14) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // Pitch envelope: snappy rise, then soft buoyant drop
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + 0.02);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.75, now + 0.055);

    // Amplitude envelope: prevent initial click with tiny linear ramp then exponential decay
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
    osc.onended = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {}
    };
  } catch {}
}

// Play multi-pop cascade synchronized with the projectile launches
export function playSocialBurstSound({ count = 5, interval = 0.15, delay = 0.12 } = {}) {
  const timeouts = [];
  const cancel = () => {
    timeouts.forEach((t) => clearTimeout(t));
    timeouts.length = 0;
  };

  try {
    if (!soundEnabled) return cancel;
    const ctx = getAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // Immediate tactile pop on trigger press
    playPopSound(520, 0.15);

    // Timed pops for each social projectile launch
    for (let i = 0; i < count; i++) {
      const ms = Math.max(10, Math.round((delay + i * interval) * 1000));
      const pitch = 560 + i * 55;
      const t = setTimeout(() => {
        playPopSound(pitch, 0.13);
      }, ms);
      timeouts.push(t);
    }
  } catch {
    cancel();
  }

  return cancel;
}

export default function SoundEffects() {
  const lastPlayedRef = useRef(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("portfolio-sound");
      if (stored === "false") {
        soundEnabled = false;
      } else {
        soundEnabled = true;
      }
    } catch {}

    const handlePointerDown = (e) => {
      const now = Date.now();
      if (now - lastPlayedRef.current < 40) return;

      const target = e.target;
      if (!target || typeof target.closest !== "function") return;

      const interactiveEl = target.closest(
        'button, a, [role="button"], input[type="button"], input[type="submit"], .retro-btn, [data-retro-action]'
      );

      if (interactiveEl) {
        lastPlayedRef.current = now;

        const isPrimaryAction =
          interactiveEl.classList?.contains("primaryPill") ||
          interactiveEl.classList?.contains("retro-btn-primary") ||
          interactiveEl.getAttribute("href")?.includes("mailto") ||
          interactiveEl.getAttribute("data-retro-action") === "equip";

        if (isPrimaryAction) {
          play8BitCoinSound();
        } else {
          play8BitBlipSound();
        }
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return null;
}
