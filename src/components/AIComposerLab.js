"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Copy, Cpu, RotateCcw, Send, Sparkles } from "lucide-react";
import { playPopSound, playTickSound, playTingSound } from "./SoundEffects";
import { scaleSpring, useLabTuner } from "@/lib/labTuning";
import { SPRING } from "@/lib/motion";

const SCENARIOS = [
  {
    id: "tokens",
    prompt: "Generate a studio light-mode token palette with AA contrast pairs",
    steps: [
      { label: "Sample base luminance", ms: 42 },
      { label: "Verify WCAG AA ratios (>= 4.5:1)", ms: 68 },
      { label: "Mount interactive token grid", ms: 34 },
    ],
    tokens: [
      { name: "--bg-canvas", hex: "#FBFBFD", ratio: "16.8:1" },
      { name: "--surface-card", hex: "#FFFFFF", ratio: "17.4:1" },
      { name: "--accent-cyan", hex: "#0879A0", ratio: "5.1:1" },
      { name: "--accent-violet", hex: "#5B4CF0", ratio: "5.8:1" },
    ],
  },
  {
    id: "telemetry",
    prompt: "Audit a 60fps 16.6ms frame budget for interactive motion stages",
    steps: [
      { label: "Inspect main-thread script slices", ms: 36 },
      { label: "Isolate compositor transform layers", ms: 54 },
      { label: "Render live frame-budget breakdown", ms: 29 },
    ],
    slices: [
      { label: "Input & Physics", ms: 2.4, color: "#0879a0" },
      { label: "Layout (0 CLS)", ms: 0.8, color: "#0d8a38" },
      { label: "Composite / GPU", ms: 3.1, color: "#5b4cf0" },
      { label: "Idle Headroom", ms: 10.3, color: "#d1d5db" },
    ],
  },
  {
    id: "eq",
    prompt: "Synthesize a 5-band parametric EQ widget for Web Audio feedback",
    steps: [
      { label: "Allocate peaking filter bands", ms: 48 },
      { label: "Bind pointer capture faders", ms: 41 },
      { label: "Hydrate SVG frequency curve", ms: 38 },
    ],
  },
];

export default function AIComposerLab({ reduceMotion = false }) {
  const tuner = useLabTuner("ai-composer", {
    streamSpeed: 1.0,
    blurPx: 8,
    stiffness: 360,
    damping: 28,
  });

  const [selectedId, setSelectedId] = useState("tokens");
  const [inputValue, setInputValue] = useState(SCENARIOS[0].prompt);
  const [phase, setPhase] = useState("ready");
  const [visibleSteps, setVisibleSteps] = useState(3);
  const [traceOpen, setTraceOpen] = useState(true);
  const [copiedHex, setCopiedHex] = useState(null);
  const [eqBands, setEqBands] = useState([3, -2, 4, 2, -1]);
  const [contrastMode, setContrastMode] = useState("AA");

  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const runScenario = useCallback(
    (scenarioId, customPrompt) => {
      clearTimers();
      const sc = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];
      setSelectedId(sc.id);
      if (customPrompt !== undefined) setInputValue(customPrompt);
      setTraceOpen(true);

      if (reduceMotion) {
        setVisibleSteps(sc.steps.length);
        setPhase("ready");
        return;
      }

      setPhase("streaming");
      setVisibleSteps(0);
      playTickSound(1700, 0.045);

      const baseMs = 260 / Math.max(0.25, tuner.streamSpeed * (tuner.timeScale || 1));

      sc.steps.forEach((_, idx) => {
        const t = window.setTimeout(() => {
          setVisibleSteps(idx + 1);
          playTickSound(1500 + idx * 180, 0.035);
          if (idx === sc.steps.length - 1) {
            const doneTimer = window.setTimeout(() => {
              setPhase("ready");
              playTingSound(1860, 0.045);
            }, baseMs * 0.9);
            timersRef.current.push(doneTimer);
          }
        }, baseMs * (idx + 0.6));
        timersRef.current.push(t);
      });
    },
    [clearTimers, reduceMotion, tuner.streamSpeed, tuner.timeScale],
  );

  const activeScenario = SCENARIOS.find((s) => s.id === selectedId) || SCENARIOS[0];
  const cardSpring = scaleSpring({ type: "spring", stiffness: tuner.stiffness, damping: tuner.damping }, tuner.timeScale);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = inputValue.toLowerCase();
    const matched = q.includes("eq") || q.includes("audio")
      ? "eq"
      : q.includes("fps") || q.includes("frame") || q.includes("telemetry")
      ? "telemetry"
      : "tokens";
    runScenario(matched, inputValue);
  };

  return (
    <div className="flex min-h-[380px] w-full items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl rounded-2xl border border-black/[0.07] bg-white p-4 text-ink shadow-[0_12px_36px_-14px_rgba(0,0,0,0.07)] sm:p-5">
        {/* Prompt Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-xl border border-black/[0.08] bg-[#f7f7fa] p-1.5 pl-3">
          <Sparkles size={14} className="shrink-0 text-[#0879a0]" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            aria-label="Generative UI prompt"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-muted"
            placeholder="Describe an interface widget to synthesize…"
          />
          <button
            type="submit"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 font-labMono text-[11px] font-medium text-white transition-opacity hover:opacity-90"
          >
            <Send size={11} />
            Run
          </button>
        </form>

        {/* Quick scenario pills */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {SCENARIOS.map((sc) => {
            const active = sc.id === selectedId;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => runScenario(sc.id, sc.prompt)}
                className={`rounded-full border px-2.5 py-1 font-labMono text-[10px] uppercase tracking-[0.08em] transition-colors ${
                  active
                    ? "border-[#0879a0]/35 bg-[#2ec4f0]/15 font-medium text-[#0879a0]"
                    : "border-black/[0.07] bg-[#f7f7fa] text-ink-muted hover:text-ink"
                }`}
              >
                {sc.id === "tokens" ? "Token Palette" : sc.id === "telemetry" ? "Frame Budget" : "Parametric EQ"}
              </button>
            );
          })}
        </div>

        {/* Collapsible Reasoning Trace */}
        <div className="mt-4 rounded-xl border border-black/[0.07] bg-[#fafafa]">
          <button
            type="button"
            onClick={() => setTraceOpen((v) => !v)}
            className="flex w-full items-center justify-between px-3.5 py-2.5 text-left"
          >
            <span className="flex items-center gap-2 font-labMono text-[10.5px] uppercase tracking-[0.12em] text-ink-secondary">
              <Cpu size={12} className={phase === "streaming" ? "animate-pulse text-[#d97706]" : "text-[#0d8a38]"} />
              {phase === "streaming" ? "Synthesizing component tree…" : "Reasoning trace · 3 steps"}
            </span>
            <ChevronDown
              size={14}
              className={`text-ink-muted transition-transform ${traceOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence initial={false}>
            {traceOpen && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-black/[0.06] px-3.5 py-2.5"
              >
                {activeScenario.steps.map((st, idx) => {
                  const done = idx < visibleSteps;
                  return (
                    <motion.li
                      key={st.label}
                      initial={{ opacity: 0, filter: `blur(${tuner.blurPx}px)`, y: 4 }}
                      animate={{
                        opacity: done ? 1 : 0.35,
                        filter: done ? "blur(0px)" : `blur(${Math.min(4, tuner.blurPx)}px)`,
                        y: 0,
                      }}
                      transition={cardSpring}
                      className="flex items-center justify-between py-1 font-labMono text-[11px]"
                    >
                      <span className="flex items-center gap-2 text-ink-secondary">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            done ? "bg-[#0d8a38]" : "bg-black/15"
                          }`}
                        />
                        {st.label}
                      </span>
                      <span className="tabular-nums text-ink-muted">{done ? `${st.ms}ms` : "…"}</span>
                    </motion.li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Generated Live Widget Output */}
        <AnimatePresence mode="wait">
          {phase === "ready" && (
            <motion.div
              key={activeScenario.id}
              initial={{ opacity: 0, y: 12, filter: `blur(${tuner.blurPx}px)` }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8 }}
              transition={cardSpring}
              className="mt-3.5 rounded-xl border border-black/[0.08] bg-white p-4 shadow-sm"
            >
              {activeScenario.id === "tokens" && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-labMono text-[10.5px] uppercase tracking-[0.12em] text-ink-muted">
                      Generated Surface Tokens
                    </span>
                    <div className="flex rounded-full border border-black/[0.06] bg-[#f5f5f7] p-0.5">
                      {["AA", "AAA"].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setContrastMode(mode)}
                          className={`rounded-full px-2 py-0.5 font-labMono text-[10px] ${
                            contrastMode === mode ? "bg-ink text-white" : "text-ink-muted"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {activeScenario.tokens.map((tk) => (
                      <button
                        key={tk.name}
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(tk.hex).catch(() => {});
                          setCopiedHex(tk.hex);
                          playPopSound(700, 0.06);
                          window.setTimeout(() => setCopiedHex(null), 1200);
                        }}
                        className="flex items-center justify-between rounded-lg border border-black/[0.07] bg-[#f7f7fa] p-2.5 text-left transition-colors hover:border-black/20"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="h-6 w-6 rounded-md border border-black/[0.1]" style={{ backgroundColor: tk.hex }} />
                          <div>
                            <p className="font-labMono text-[11px] font-medium text-ink">{tk.name}</p>
                            <p className="font-labMono text-[10px] text-ink-muted">
                              {tk.hex} · {contrastMode} {tk.ratio}
                            </p>
                          </div>
                        </div>
                        {copiedHex === tk.hex ? (
                          <Check size={13} className="text-[#0d8a38]" />
                        ) : (
                          <Copy size={13} className="text-ink-muted" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeScenario.id === "telemetry" && (
                <div>
                  <div className="mb-3 flex items-center justify-between font-labMono text-[10.5px] uppercase tracking-[0.12em]">
                    <span className="text-ink-muted">60fps Frame Budget (16.6 ms)</span>
                    <span className="font-medium text-[#0d8a38]">6.3 ms used · 10.3 ms free</span>
                  </div>
                  <div className="flex h-6 w-full overflow-hidden rounded-lg border border-black/[0.08]">
                    {activeScenario.slices.map((sl) => (
                      <motion.div
                        key={sl.label}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={SPRING.enter}
                        style={{
                          width: `${(sl.ms / 16.6) * 100}%`,
                          backgroundColor: sl.color,
                          transformOrigin: "left",
                        }}
                        title={`${sl.label}: ${sl.ms}ms`}
                      />
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {activeScenario.slices.map((sl) => (
                      <div key={sl.label} className="rounded-lg border border-black/[0.06] bg-[#f7f7fa] px-2.5 py-2">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: sl.color }} />
                          <span className="font-labMono text-[10px] text-ink-muted">{sl.label}</span>
                        </div>
                        <p className="mt-1 font-labMono text-[12px] font-medium tabular-nums text-ink">{sl.ms} ms</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeScenario.id === "eq" && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-labMono text-[10.5px] uppercase tracking-[0.12em] text-ink-muted">
                      5-Band Parametric EQ
                    </span>
                    <button
                      type="button"
                      onClick={() => setEqBands([0, 0, 0, 0, 0])}
                      className="inline-flex items-center gap-1 font-labMono text-[10px] font-medium text-[#0879a0] hover:underline"
                    >
                      <RotateCcw size={10} /> Flat
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {["60Hz", "250Hz", "1kHz", "4kHz", "12kHz"].map((band, i) => (
                      <div key={band} className="flex flex-col items-center gap-1.5 rounded-lg border border-black/[0.06] bg-[#f7f7fa] py-2.5">
                        <span className="font-labMono text-[10px] font-medium tabular-nums text-[#0879a0]">
                          {eqBands[i] > 0 ? `+${eqBands[i]}` : eqBands[i]}dB
                        </span>
                        <input
                          type="range"
                          min="-12"
                          max="12"
                          step="1"
                          value={eqBands[i]}
                          aria-label={`${band} gain`}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setEqBands((prev) => prev.map((x, idx) => (idx === i ? val : x)));
                          }}
                          className="h-16 w-1.5 cursor-pointer accent-[#0879a0]"
                          style={{ writingMode: "vertical-lr", direction: "rtl" }}
                        />
                        <span className="font-labMono text-[9.5px] text-ink-muted">{band}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
