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
 * Retro 8-Bit Coin Ping — Super Mario / Game Boy style
 */
export function play8BitCoinSound() {
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

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.setValueAtTime(0.06, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch {}
}

/**
 * Retro 8-Bit Menu Blip — Game Boy / Pokémon menu selection
 */
export function play8BitBlipSound(freq = 587.33) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.035);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch {}
}

export default function SoundEffects() {
  const lastPlayedRef = useRef(0);

  useEffect(() => {
    const handlePointerDown = (e) => {
      const now = Date.now();
      if (now - lastPlayedRef.current < 45) return;

      const target = e.target;
      if (!target || typeof target.closest !== "function") return;

      const interactiveEl = target.closest(
        'button, a, [role="button"], input[type="button"], input[type="submit"], .segmentedTab, .lensBtn, [data-retro-action]'
      );

      if (interactiveEl) {
        lastPlayedRef.current = now;

        const isPrimaryAction =
          interactiveEl.classList?.contains("primaryPill") ||
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
