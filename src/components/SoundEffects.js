"use client";

import { useEffect } from "react";

let globalAudioCtx = null;
// On by default, but browsers keep a page silent until the first tap or key, so
// nothing plays on arrival. M mutes (and remembers it); every sound checks this.
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
    playTingSound();
  }
  return soundEnabled;
}

// One gesture often triggers a sound from two places (the global tap handler and
// the component). A short gap per sound keeps that to one.
const lastPlayed = {};
function ready(name, gap) {
  if (!soundEnabled) return null;
  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  if (now - (lastPlayed[name] || 0) < gap) return null;
  lastPlayed[name] = now;
  return getAudioContext();
}

function release(...nodes) {
  return () => {
    for (const node of nodes) {
      try {
        node.disconnect();
      } catch {}
    }
  };
}

let noiseBuffer = null;
function noise(ctx) {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  return source;
}

/**
 * Whoosh — air moving past: noise through a band-pass that sweeps up and back
 * down. Page changes, card flips and swipes. `pitch` > 1 is brighter and quicker.
 */
export function playWhooshSound({ pitch = 1, volume = 0.16, duration = 0.42 } = {}) {
  try {
    const ctx = ready("whoosh", 120);
    if (!ctx) return;
    const now = ctx.currentTime;
    const length = duration / Math.sqrt(pitch);

    const source = noise(ctx);
    const band = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    band.type = "bandpass";
    band.Q.value = 1.1;
    band.frequency.setValueAtTime(320 * pitch, now);
    band.frequency.exponentialRampToValueAtTime(2600 * pitch, now + length * 0.45);
    band.frequency.exponentialRampToValueAtTime(700 * pitch, now + length);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + length * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + length);

    source.connect(band);
    band.connect(gain);
    gain.connect(ctx.destination);
    source.start(now, Math.random() * 0.5);
    source.stop(now + length + 0.02);
    source.onended = release(source, band, gain);
  } catch {}
}

/**
 * Ting — a small glass bell: a sine with two quiet inharmonic partials and a
 * long soft tail. Opening something, turning sound on.
 */
export function playTingSound(freq = 1568, volume = 0.07) {
  try {
    const ctx = ready("ting", 80);
    if (!ctx) return;
    const now = ctx.currentTime;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, now);
    out.gain.exponentialRampToValueAtTime(volume, now + 0.006);
    out.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    out.connect(ctx.destination);

    const partials = [
      [1, 1],
      [2.76, 0.28],
      [5.4, 0.1],
    ];
    const nodes = [out];
    for (const [ratio, level] of partials) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * ratio, now);
      // Higher partials die first, so the ring settles onto the fundamental.
      gain.gain.setValueAtTime(level, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9 / ratio ** 0.5);
      osc.connect(gain);
      gain.connect(out);
      osc.start(now);
      osc.stop(now + 0.95);
      nodes.push(osc, gain);
    }
    nodes[1].onended = release(...nodes);
  } catch {}
}

/**
 * Tick — a soft, dry tap for ordinary buttons and links.
 */
export function playTickSound(freq = 1800, volume = 0.05) {
  try {
    const ctx = ready("tick", 60);
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.018);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
    osc.onended = release(osc, gain);
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
  useEffect(() => {
    try {
      // Only a visitor who muted keeps it muted.
      soundEnabled = localStorage.getItem("portfolio-sound") !== "false";
    } catch {}

    const handlePointerDown = (e) => {
      const target = e.target;
      if (!target || typeof target.closest !== "function") return;
      const interactiveEl = target.closest('button, a, [role="button"], input[type="button"], input[type="submit"]');
      if (!interactiveEl || interactiveEl.closest("[data-sound='off']")) return;

      const isPrimaryAction =
        interactiveEl.classList?.contains("primaryPill") ||
        interactiveEl.getAttribute("href")?.startsWith("mailto");
      if (isPrimaryAction) {
        playTingSound();
      } else {
        playTickSound();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key !== "m" && e.key !== "M") return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable='true']")) return;
      toggleSound();
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
