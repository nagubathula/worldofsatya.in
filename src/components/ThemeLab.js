"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Moon, Sparkles, Sun, Terminal } from "lucide-react";
import { playTickSound, playWhooshSound } from "./SoundEffects";
import { scaleDuration, useLabTuner } from "@/lib/labTuning";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { TOKENS } from "@/lib/tokens";

const THEMES = {
  paper: {
    id: "paper",
    name: "Paper",
    icon: Sun,
    surface: "#f7f6f3",
    card: "#ffffff",
    cardBorder: "rgba(0,0,0,0.07)",
    text: TOKENS.ink,
    muted: TOKENS.inkMuted,
    accent: "#5b4cf0",
    accentInk: "#ffffff",
    codeBg: "#f1f0ec",
    track: "rgba(0,0,0,0.08)",
  },
  dim: {
    id: "dim",
    name: "Dim",
    icon: Sparkles,
    surface: "#23252a",
    card: "#2c2f36",
    cardBorder: "rgba(255,255,255,0.09)",
    text: "#f3f4f6",
    muted: "#9ca3af",
    accent: "#38bdf8",
    accentInk: "#091825",
    codeBg: "#1b1d22",
    track: "rgba(255,255,255,0.12)",
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    icon: Moon,
    surface: "#0d0f14",
    card: "#151923",
    cardBorder: "rgba(255,255,255,0.1)",
    text: "#f8fafc",
    muted: "#94a3b8",
    accent: "#a78bfa",
    accentInk: "#130c29",
    codeBg: "#0a0c10",
    track: "rgba(255,255,255,0.12)",
  },
  terminal: {
    id: "terminal",
    name: "Terminal",
    icon: Terminal,
    surface: "#0c1410",
    card: "#121f19",
    cardBorder: "rgba(52,211,153,0.18)",
    text: "#e6fff2",
    muted: "#6ee7b7",
    accent: "#34d399",
    accentInk: "#052014",
    codeBg: "#080e0b",
    track: "rgba(52,211,153,0.18)",
  },
};

const THEME_KEYS = ["paper", "dim", "midnight", "terminal"];

function ScopedWorkspace({
  theme,
  autoSave,
  onToggleAutoSave,
  onSelectTheme,
  onCycleTheme,
  interactive = true,
}) {
  const ActiveIcon = theme.icon;
  return (
    <div
      className="flex h-full w-full flex-col justify-between gap-4 p-4 sm:p-6"
      style={{ backgroundColor: theme.surface, color: theme.text }}
    >
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="grid h-8 w-8 place-items-center rounded-xl"
            style={{ backgroundColor: theme.accent, color: theme.accentInk }}
          >
            <ActiveIcon size={15} />
          </span>
          <div>
            <p className="text-[13.5px] font-semibold leading-none">{theme.name} Canvas</p>
            <p className="mt-1 font-mono text-[10.5px]" style={{ color: theme.muted }}>
              Scoped CSS surface · site stays light
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className="flex items-center gap-1 rounded-full p-1"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}
          >
            {THEME_KEYS.map((key) => {
              const t = THEMES[key];
              const isCurrent = t.id === theme.id;
              return (
                <button
                  key={key}
                  type="button"
                  tabIndex={interactive ? 0 : -1}
                  onClick={(e) => interactive && onSelectTheme(key, e)}
                  aria-label={`Switch preview to ${t.name}`}
                  aria-pressed={isCurrent}
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
                  style={{
                    backgroundColor: isCurrent ? theme.accent : "transparent",
                    color: isCurrent ? theme.accentInk : theme.muted,
                  }}
                >
                  <span
                    className="h-2 w-2 rounded-full border"
                    style={{
                      backgroundColor: t.surface,
                      borderColor: isCurrent ? theme.accentInk : theme.cardBorder,
                    }}
                  />
                  <span className="hidden sm:inline">{t.name}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            tabIndex={interactive ? 0 : -1}
            onClick={(e) => interactive && onCycleTheme(e)}
            aria-label="Cycle theme with circular reveal"
            className="grid h-8 w-8 place-items-center rounded-full outline-none transition-transform active:scale-90 focus-visible:ring-2 focus-visible:ring-[#0879a0]"
            style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}`, color: theme.text }}
          >
            {theme.id === "paper" ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      </div>

      {/* Preview cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: theme.muted }}>
            Radial clip-path
          </p>
          <p className="mt-1.5 text-[14.5px] font-semibold tracking-[-0.01em]">
            Origin-anchored reveal
          </p>
          <pre
            className="mt-3 overflow-x-auto rounded-xl p-2.5 font-mono text-[11px] leading-relaxed"
            style={{ backgroundColor: theme.codeBg, color: theme.muted }}
          >
            <code>
              {`clip-path: circle(\n  ${theme.id === "paper" ? "0px" : "maxR"} at x y\n)`}
            </code>
          </pre>
        </div>

        <div
          className="flex flex-col justify-between rounded-2xl p-4"
          style={{ backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[13px] font-semibold">Auto-contrast tokens</p>
              <p className="mt-0.5 text-[11.5px]" style={{ color: theme.muted }}>
                {autoSave ? "Synced locally" : "Manual commit"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              tabIndex={interactive ? 0 : -1}
              aria-checked={autoSave}
              aria-label="Toggle local token sync"
              onClick={() => interactive && onToggleAutoSave()}
              className="relative h-6 w-11 shrink-0 rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
              style={{ backgroundColor: autoSave ? theme.accent : theme.track }}
            >
              <motion.span
                className="absolute top-0.5 block h-5 w-5 rounded-full bg-white shadow-sm"
                animate={{ left: autoSave ? 22 : 2 }}
                transition={SPRING.press}
              />
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between font-mono text-[10.5px]" style={{ color: theme.muted }}>
              <span>Contrast ratio</span>
              <span className="inline-flex items-center gap-1" style={{ color: theme.accent }}>
                <Check size={11} /> AAA 12.4:1
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: theme.track }}>
              <div className="h-full w-4/5 rounded-full" style={{ backgroundColor: theme.accent }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThemeLab({ reduceMotion = false }) {
  const tuner = useLabTuner("theme-transition", { revealDuration: 0.56 });
  const containerRef = useRef(null);
  const [baseId, setBaseId] = useState("paper");
  const [reveal, setReveal] = useState(null); // { id, x, y, r, seq }
  const [autoSave, setAutoSave] = useState(true);
  const seqRef = useRef(0);

  const triggerTheme = (nextId, event) => {
    const activeCurrent = reveal ? reveal.id : baseId;
    if (nextId === activeCurrent) return;

    if (reveal) {
      setBaseId(reveal.id);
    }

    if (reduceMotion || !containerRef.current) {
      setBaseId(nextId);
      setReveal(null);
      playTickSound(1600, 0.04);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const hasCoords = event && typeof event.clientX === "number" && (event.clientX !== 0 || event.clientY !== 0);
    const x = hasCoords ? event.clientX - rect.left : rect.width - 36;
    const y = hasCoords ? event.clientY - rect.top : 36;
    const r = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));

    seqRef.current += 1;
    setReveal({ id: nextId, x, y, r, seq: seqRef.current });
    playWhooshSound({ pitch: nextId === "paper" ? 1.15 : 0.9, volume: 0.08, duration: 0.32 });
  };

  const cycleTheme = (event) => {
    const active = reveal ? reveal.id : baseId;
    const idx = THEME_KEYS.indexOf(active);
    const next = THEME_KEYS[(idx + 1) % THEME_KEYS.length];
    triggerTheme(next, event);
  };

  const toggleAutoSave = () => {
    setAutoSave((v) => !v);
    playTickSound(1700, 0.04);
  };

  return (
    <div className="w-full p-3 sm:p-6">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
      >
        <ScopedWorkspace
          theme={THEMES[baseId]}
          autoSave={autoSave}
          onToggleAutoSave={toggleAutoSave}
          onSelectTheme={triggerTheme}
          onCycleTheme={cycleTheme}
          interactive
        />

        {reveal && (
          <motion.div
            key={reveal.seq}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            initial={{ clipPath: `circle(0px at ${reveal.x}px ${reveal.y}px)` }}
            animate={{ clipPath: `circle(${reveal.r}px at ${reveal.x}px ${reveal.y}px)` }}
            transition={{ duration: scaleDuration(tuner.revealDuration, tuner.timeScale), ease: EASE_OUT }}
            onAnimationComplete={() => {
              setBaseId(reveal.id);
              setReveal(null);
            }}
          >
            <ScopedWorkspace
              theme={THEMES[reveal.id]}
              autoSave={autoSave}
              onToggleAutoSave={toggleAutoSave}
              onSelectTheme={triggerTheme}
              onCycleTheme={cycleTheme}
              interactive={false}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
