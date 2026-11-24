"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Activity, Cpu, FileText, Layers, Music2, Palette, Sparkles, Terminal, X } from "lucide-react";
import { playPopSound, playTickSound } from "./SoundEffects";
import { scaleSpring, useLabTuner } from "@/lib/labTuning";
import { SPRING } from "@/lib/motion";

const APPS = [
  {
    id: "studio",
    name: "Studio",
    tag: "Grid & Spacing",
    accent: "#0879a0",
    icon: Layers,
    summary: "8pt spatial layout snapping & container queries",
  },
  {
    id: "shaders",
    name: "Shaders",
    tag: "GLSL Optics",
    accent: "#5b4cf0",
    icon: Sparkles,
    summary: "Real-time refraction IOR & caustic dispersion",
  },
  {
    id: "physics",
    name: "Physics",
    tag: "480Hz Solver",
    accent: "#0d8a38",
    icon: Cpu,
    summary: "Verlet constraints, spring damping & momentum",
  },
  {
    id: "tokens",
    name: "Tokens",
    tag: "Color System",
    accent: "#d97706",
    icon: Palette,
    summary: "Daylight luminance & WCAG AA contrast pairs",
  },
  {
    id: "audio",
    name: "Audio",
    tag: "Web Audio API",
    accent: "#e11d48",
    icon: Music2,
    summary: "Zero-asset synthesized ticks, chimes & envelopes",
  },
  {
    id: "terminal",
    name: "Console",
    tag: "Telemetry",
    accent: "#0879a0",
    icon: Terminal,
    summary: "Live gesture coordinates & layout-shift probes",
  },
  {
    id: "notes",
    name: "Notes",
    tag: "Craft Essays",
    accent: "#0d8a38",
    icon: FileText,
    summary: "Field notes on interruptible motion & velocity",
  },
];

function DockTile({ app, mouseX, maxScale, spread, stiffness, damping, isOpen, onOpen }) {
  const ref = useRef(null);
  const Icon = app.icon;

  const distance = useTransform(mouseX, (val) => {
    const el = ref.current;
    if (!el || !Number.isFinite(val)) return 9999;
    const rect = el.getBoundingClientRect();
    return val - (rect.left + rect.width / 2);
  });

  const targetSize = useTransform(distance, (d) => {
    const base = 46;
    if (!Number.isFinite(d) || Math.abs(d) > spread * 2.5) return base;
    const gaussian = Math.exp(-(d * d) / (2 * (spread * 0.48) ** 2));
    return base * (1 + (maxScale - 1) * gaussian);
  });

  const size = useSpring(targetSize, { stiffness, damping, mass: 0.45 });

  return (
    <div className="group relative flex flex-col items-center">
      {/* Hover tooltip */}
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 font-labMono text-[10px] text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
        {app.name}
      </span>

      <motion.button
        ref={ref}
        type="button"
        onClick={() => onOpen(app.id)}
        aria-label={`Launch ${app.name}`}
        aria-pressed={isOpen}
        style={{ width: size, height: size }}
        whileTap={{ scale: 0.9 }}
        className="relative grid shrink-0 place-items-center rounded-2xl border border-black/[0.08] bg-gradient-to-b from-white to-[#f5f5f8] shadow-[0_4px_12px_rgba(0,0,0,0.06)] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-35"
          style={{
            background: `radial-gradient(circle at 30% 25%, ${app.accent}2a, transparent 70%)`,
          }}
        />
        <Icon size={20} style={{ color: app.accent }} className="relative z-10" />
      </motion.button>

      <span
        aria-hidden="true"
        className="mt-1.5 h-1 w-1 rounded-full transition-all duration-200"
        style={{
          backgroundColor: isOpen ? app.accent : "transparent",
        }}
      />
    </div>
  );
}

function MiniWindowBody({ appId }) {
  const [gridDensity, setGridDensity] = useState("24px");
  const [iorVal, setIorVal] = useState(1.38);
  const [gainDb, setGainDb] = useState(-4);

  switch (appId) {
    case "studio":
      return (
        <div className="flex flex-wrap items-center gap-2">
          {["16px", "24px", "32px"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGridDensity(g)}
              className={`rounded-lg border px-2.5 py-1 font-labMono text-[11px] ${
                gridDensity === g
                  ? "border-[#0879a0]/40 bg-[#2ec4f0]/15 text-[#0879a0] font-medium"
                  : "border-black/[0.08] bg-white text-ink-secondary"
              }`}
            >
              Grid {g}
            </button>
          ))}
        </div>
      );
    case "shaders":
      return (
        <div className="flex items-center gap-3">
          <span className="font-labMono text-[11px] text-ink-muted">IOR</span>
          <input
            type="range"
            min="1.1"
            max="2.2"
            step="0.02"
            value={iorVal}
            onChange={(e) => setIorVal(Number(e.target.value))}
            aria-label="Preview IOR"
            className="flex-1 accent-[#5b4cf0]"
          />
          <span className="font-labMono text-[11px] tabular-nums text-ink">{iorVal.toFixed(2)}</span>
        </div>
      );
    case "tokens":
      return (
        <div className="flex flex-wrap items-center gap-2">
          {["#fbfbfd", "#0879a0", "#5b4cf0", "#0d8a38", "#d97706"].map((hex) => (
            <div key={hex} className="flex items-center gap-1.5 rounded-lg border border-black/[0.06] bg-white px-2 py-1">
              <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: hex }} />
              <span className="font-labMono text-[10px] text-ink-secondary">{hex}</span>
            </div>
          ))}
        </div>
      );
    case "audio":
      return (
        <div className="flex items-center gap-3">
          <span className="font-labMono text-[11px] text-ink-muted">GAIN</span>
          <input
            type="range"
            min="-18"
            max="0"
            step="1"
            value={gainDb}
            onChange={(e) => setGainDb(Number(e.target.value))}
            aria-label="Master gain"
            className="flex-1 accent-[#e11d48]"
          />
          <span className="font-labMono text-[11px] tabular-nums text-ink">{gainDb} dB</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2 font-labMono text-[11px] text-[#0d8a38]">
          <Activity size={13} />
          <span>Running @ 60 fps · Zero layout shift</span>
        </div>
      );
  }
}

export default function SpatialDockLab() {
  const tuner = useLabTuner("spatial-dock", {
    maxScale: 1.72,
    spread: 112,
    stiffness: 420,
    damping: 26,
  });

  const mouseX = useMotionValue(Infinity);
  const [activeId, setActiveId] = useState("shaders");
  const activeApp = APPS.find((a) => a.id === activeId) || null;
  const windowSpring = scaleSpring(SPRING.enter, tuner.timeScale);

  const scaledStiffness = Math.max(20, tuner.stiffness * (tuner.timeScale || 1) ** 2);
  const scaledDamping = Math.max(2, tuner.damping * (tuner.timeScale || 1));

  return (
    <div className="relative flex min-h-[360px] w-full flex-col items-center justify-between gap-8 p-5 sm:p-8">
      {/* Upper stage: spring-morphed mini window */}
      <div className="flex w-full max-w-lg flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          {activeApp ? (
            <motion.div
              key={activeApp.id}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={windowSpring}
              className="w-full rounded-2xl border border-black/[0.08] bg-white/95 p-4 text-ink shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3 border-b border-black/[0.06] pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-xl border border-black/[0.06]"
                    style={{ backgroundColor: `${activeApp.accent}15`, color: activeApp.accent }}
                  >
                    <activeApp.icon size={15} />
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold leading-none text-ink">{activeApp.name}</p>
                    <p className="mt-1 font-labMono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                      {activeApp.tag}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Close ${activeApp.name}`}
                  onClick={() => {
                    setActiveId(null);
                    playTickSound(1300, 0.04);
                  }}
                  className="grid h-7 w-7 place-items-center rounded-full border border-black/[0.08] bg-[#f5f5f7] text-ink-muted transition-colors hover:bg-[#e9e9ef] hover:text-ink"
                >
                  <X size={13} />
                </button>
              </div>
              <p className="mt-3 text-[13px] text-ink-secondary">{activeApp.summary}</p>
              <div className="mt-3.5 rounded-xl border border-black/[0.06] bg-[#f7f7fa] p-3">
                <MiniWindowBody appId={activeApp.id} />
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-labMono text-[11px] uppercase tracking-[0.14em] text-ink-muted"
            >
              Click any dock app to launch
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Spatial Dock Shelf */}
      <div
        onPointerMove={(e) => {
          if (e.pointerType !== "touch") mouseX.set(e.clientX);
        }}
        onPointerLeave={() => mouseX.set(Infinity)}
        className="flex h-[74px] items-end gap-2.5 rounded-[24px] border border-black/[0.08] bg-white/80 px-3.5 pb-2.5 shadow-[0_16px_40px_-10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl sm:gap-3 sm:px-4"
      >
        {APPS.map((app) => (
          <DockTile
            key={app.id}
            app={app}
            mouseX={mouseX}
            maxScale={tuner.maxScale}
            spread={tuner.spread}
            stiffness={scaledStiffness}
            damping={scaledDamping}
            isOpen={activeId === app.id}
            onOpen={(id) => {
              setActiveId((cur) => (cur === id ? null : id));
              playPopSound(660, 0.08);
            }}
          />
        ))}
      </div>
    </div>
  );
}
