"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  Gauge,
  Loader2,
  Maximize2,
  Minimize2,
  Monitor,
  RotateCcw,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import StageFrame from "./StageFrame";
import SpringCurvePlot from "./SpringCurvePlot";
import LabSourceViewport from "./LabSourceHighlight";
import { playTickSound, playTingSound } from "@/components/SoundEffects";
import { smoothNavigate, SPRING } from "@/lib/motion";
import { useReducedMotionAfterHydration } from "@/lib/reducedMotion";
import { openInCodeSandbox } from "@/lib/codesandbox";

const TIME_SCALES = [
  { value: 1, label: "1×" },
  { value: 0.25, label: "0.25×" },
  { value: 0.1, label: "0.1×" },
];

const BACKDROPS = [
  { id: "light", label: "Studio" },
  { id: "paper", label: "Paper" },
  { id: "blueprint", label: "Grid" },
];

function defaultsFor(piece) {
  const out = {};
  for (const ctrl of piece.tunerControls || []) {
    out[ctrl.key] = ctrl.default;
  }
  return out;
}

export default function SpecimenTheater({
  piece,
  pieceIndex,
  totalCount,
  prevPiece,
  nextPiece,
  files = [],
  gzipKb,
  sharedSources = {},
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotionAfterHydration();

  const [timeScale, setTimeScale] = useState(1);
  const [telemetryOn, setTelemetryOn] = useState(false);
  const [viewportMode, setViewportMode] = useState("fluid");
  const [backdrop, setBackdrop] = useState(piece.defaultBackdrop || "light");
  const [fullscreen, setFullscreen] = useState(false);
  const [inspectorTab, setInspectorTab] = useState(
    (piece.tunerControls?.length || piece.springPreview) ? "tuner" : "craft",
  );
  const [tunerValues, setTunerValues] = useState(() => defaultsFor(piece));
  const [resetKey, setResetKey] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [sandboxBusy, setSandboxBusy] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1);
    setInteracted(false);
    playTickSound(1450, 0.045);
  }, []);

  // Theater keyboard shortcuts: [ prev, ] next, R reset, F fullscreen, Esc back
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.querySelector("[aria-modal='true']")) return;
      if (
        e.target instanceof Element &&
        e.target.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (fullscreen) {
          setFullscreen(false);
        } else {
          smoothNavigate(router, "/ui");
        }
        return;
      }

      if (e.key === "[") {
        e.preventDefault();
        smoothNavigate(router, `/ui/${prevPiece.id}`);
      } else if (e.key === "]") {
        e.preventDefault();
        smoothNavigate(router, `/ui/${nextPiece.id}`);
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleReset();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        setFullscreen((f) => !f);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, prevPiece.id, nextPiece.id, router, handleReset]);

  const handleOpenSandbox = async () => {
    setSandboxBusy(true);
    try {
      await openInCodeSandbox(piece, files, sharedSources);
    } finally {
      setSandboxBusy(false);
    }
  };

  const handleCopyConfig = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify({ id: piece.id, timeScale, ...tunerValues }, null, 2));
    } catch {}
    setCopiedConfig(true);
    playTingSound(2093, 0.04);
    window.setTimeout(() => setCopiedConfig(false), 1500);
  };

  const springStiffness = tunerValues.stiffness ?? tunerValues.odometerStiffness ?? piece.springPreview?.stiffness;
  const springDamping = tunerValues.damping ?? piece.springPreview?.damping;
  const springMass = piece.springPreview?.mass ?? 1;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-8 sm:pt-8">
      {/* Top Specimen Theater Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.08] pb-5">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/ui"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 font-labMono text-[11px] text-ink-secondary shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[#f5f5f7] hover:text-ink"
          >
            <ArrowLeft size={13} />
            All Specimens
          </Link>

          <span className="font-labMono text-[11px] font-medium text-[#0879a0]">
            {String(pieceIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
          </span>
          <h1 className="text-xl font-semibold tracking-[-0.03em] text-ink sm:text-2xl">
            {piece.title}
          </h1>
          <span className="hidden rounded-full border border-black/[0.06] bg-[#f5f5f7] px-2.5 py-0.5 font-labMono text-[10px] uppercase tracking-[0.12em] text-ink-muted sm:inline-block">
            {piece.category}
          </span>
        </div>

        {/* Prev / Next navigation */}
        <div className="flex items-center gap-2">
          <Link
            href={`/ui/${prevPiece.id}`}
            title={`Previous: ${prevPiece.title} ([)`}
            className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 font-labMono text-[11px] text-ink-secondary shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[#f5f5f7] hover:text-ink"
          >
            <ChevronLeft size={13} />
            <span className="hidden sm:inline">{prevPiece.shortTitle}</span>
            <kbd className="hidden text-[9.5px] text-ink-muted md:inline">[</kbd>
          </Link>
          <Link
            href={`/ui/${nextPiece.id}`}
            title={`Next: ${nextPiece.title} (])`}
            className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 font-labMono text-[11px] text-ink-secondary shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[#f5f5f7] hover:text-ink"
          >
            <kbd className="hidden text-[9.5px] text-ink-muted md:inline">]</kbd>
            <span className="hidden sm:inline">{nextPiece.shortTitle}</span>
            <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      {/* Main Theater Workspace */}
      <div className={`grid gap-6 ${fullscreen ? "grid-cols-1" : "lg:grid-cols-[1fr_380px]"}`}>
        {/* Left: Stage + Instrument Toolbar */}
        <div className="flex min-w-0 flex-col gap-3">
          {/* Instrument Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-black/[0.07] bg-white/85 px-3 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.02)] backdrop-blur-xl">
            {/* Slow-Motion Time Scale */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-labMono text-[10px] uppercase tracking-[0.12em] text-ink-muted">
                <Gauge size={12} className="text-[#0879a0]" />
                Speed
              </span>
              <div className="flex rounded-full border border-black/[0.06] bg-[#f5f5f7] p-0.5" role="group" aria-label="Playback time scale">
                {TIME_SCALES.map((ts) => {
                  const active = timeScale === ts.value;
                  return (
                    <button
                      key={ts.value}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setTimeScale(ts.value);
                        playTickSound(ts.value === 1 ? 1750 : 1300, 0.04);
                      }}
                      className={`rounded-full px-2.5 py-0.5 font-labMono text-[10.5px] transition-colors ${
                        active ? "bg-ink font-medium text-white" : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      {ts.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* HUD, Viewport, Backdrop, Reset, Fullscreen */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                aria-pressed={telemetryOn}
                onClick={() => {
                  setTelemetryOn((v) => !v);
                  playTickSound(1600, 0.035);
                }}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-labMono text-[10.5px] transition-colors ${
                  telemetryOn
                    ? "border-[#5b4cf0]/35 bg-[#5b4cf0]/10 text-[#5b4cf0]"
                    : "border-black/[0.08] bg-white text-ink-secondary hover:text-ink"
                }`}
              >
                <Activity size={11.5} />
                HUD
              </button>

              {/* Viewport Mode */}
              <div className="flex rounded-full border border-black/[0.06] bg-[#f5f5f7] p-0.5" role="group" aria-label="Viewport size">
                <button
                  type="button"
                  aria-label="Fluid desktop viewport"
                  aria-pressed={viewportMode === "fluid"}
                  onClick={() => setViewportMode("fluid")}
                  className={`rounded-full p-1 transition-colors ${
                    viewportMode === "fluid" ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <Monitor size={12} />
                </button>
                <button
                  type="button"
                  aria-label="Mobile 390px viewport"
                  aria-pressed={viewportMode === "mobile"}
                  onClick={() => setViewportMode("mobile")}
                  className={`rounded-full p-1 transition-colors ${
                    viewportMode === "mobile" ? "bg-white text-ink shadow-sm" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <Smartphone size={12} />
                </button>
              </div>

              {/* Backdrop switcher */}
              <div className="flex rounded-full border border-black/[0.06] bg-[#f5f5f7] p-0.5" role="group" aria-label="Stage backdrop">
                {BACKDROPS.map((bg) => {
                  const active = backdrop === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setBackdrop(bg.id)}
                      className={`rounded-full px-2 py-0.5 font-labMono text-[10px] transition-colors ${
                        active ? "bg-white font-medium text-ink shadow-sm" : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      {bg.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleReset}
                title="Reset specimen (R)"
                className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-white px-2.5 py-1 font-labMono text-[10.5px] text-ink-secondary hover:bg-[#f5f5f7] hover:text-ink"
              >
                <RotateCcw size={11} />
                Reset
              </button>

              <button
                type="button"
                onClick={() => setFullscreen((f) => !f)}
                aria-label={fullscreen ? "Exit fullscreen stage" : "Expand stage fullscreen"}
                title="Toggle fullscreen (F)"
                className="grid h-7 w-7 place-items-center rounded-full border border-black/[0.08] bg-white text-ink-secondary hover:bg-[#f5f5f7] hover:text-ink"
              >
                {fullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
              </button>
            </div>
          </div>

          <StageFrame
            piece={piece}
            mounted
            inView
            reduceMotion={reduceMotion}
            backdrop={backdrop}
            viewportMode={viewportMode}
            timeScale={timeScale}
            tunerValues={tunerValues}
            telemetryOn={telemetryOn}
            resetKey={resetKey}
            interacted={interacted}
            onInteract={() => setInteracted(true)}
            stageHeightClass={fullscreen ? "min-h-[68vh]" : piece.stage}
          />
        </div>

        {/* Right: 3-Tab Precision Inspector */}
        {!fullscreen && (
          <aside className="flex flex-col overflow-hidden rounded-[24px] border border-black/[0.07] bg-white/85 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl">
            {/* Inspector Tabs */}
            <div className="flex border-b border-black/[0.06] bg-[#fafafa] p-1.5" role="tablist">
              {[
                { id: "tuner", label: "Tuner", icon: SlidersHorizontal },
                { id: "craft", label: "Craft", icon: Sparkles },
                { id: "source", label: "Source", icon: Code2 },
              ].map((tab) => {
                const active = inspectorTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setInspectorTab(tab.id);
                      playTickSound(1600, 0.035);
                    }}
                    className="relative flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 font-labMono text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
                  >
                    {active && (
                      <motion.span
                        layoutId="theater-inspector-tab"
                        transition={SPRING.pill}
                        className="absolute inset-0 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                      />
                    )}
                    <Icon size={12} className={`relative z-10 ${active ? "text-[#0879a0]" : "text-ink-muted"}`} />
                    <span className={`relative z-10 ${active ? "text-ink" : "text-ink-muted"}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto p-4 sm:p-5">
              {inspectorTab === "tuner" && (
                <div className="flex flex-col gap-5">
                  {piece.tunerControls?.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {piece.tunerControls.map((ctrl) => {
                        const val = tunerValues[ctrl.key] ?? ctrl.default;
                        return (
                          <label key={ctrl.key} className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between font-labMono text-[11px]">
                              <span className="text-ink-secondary">{ctrl.label}</span>
                              <span className="tabular-nums font-medium text-[#0879a0]">
                                {ctrl.step < 1 ? Number(val).toFixed(2) : Math.round(val)}
                                {ctrl.unit}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={ctrl.min}
                              max={ctrl.max}
                              step={ctrl.step}
                              value={val}
                              onChange={(e) => {
                                const next = Number(e.target.value);
                                setTunerValues((prev) => ({ ...prev, [ctrl.key]: next }));
                              }}
                              className="h-1.5 w-full cursor-pointer accent-[#0879a0]"
                            />
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-black/[0.06] bg-[#f7f7fa] p-3 font-labMono text-[11px] leading-relaxed text-ink-secondary">
                      This specimen uses fixed choreographed springs. Switch Speed (<span className="font-medium text-[#0879a0]">0.25×</span> / <span className="font-medium text-[#0879a0]">0.1×</span>) or HUD Telemetry in the toolbar to inspect every frame.
                    </p>
                  )}

                  {springStiffness && springDamping && (
                    <SpringCurvePlot
                      stiffness={springStiffness}
                      damping={springDamping}
                      mass={springMass}
                      timeScale={timeScale}
                      accent={piece.accent || "#5b4cf0"}
                    />
                  )}

                  <div className="flex items-center gap-2 border-t border-black/[0.06] pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setTunerValues(defaultsFor(piece));
                        setTimeScale(1);
                        playTickSound(1500, 0.04);
                      }}
                      className="flex-1 rounded-full border border-black/[0.08] bg-white py-2 font-labMono text-[11px] text-ink-secondary transition-colors hover:bg-[#f5f5f7] hover:text-ink"
                    >
                      Reset Defaults
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyConfig}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink py-2 font-labMono text-[11px] font-medium text-white transition-opacity hover:opacity-90"
                    >
                      {copiedConfig ? <Check size={12} /> : <Copy size={12} />}
                      {copiedConfig ? "Copied JSON" : "Copy Config"}
                    </button>
                  </div>
                </div>
              )}

              {inspectorTab === "craft" && (
                <div className="flex flex-col gap-4">
                  <p className="text-[13.5px] leading-relaxed text-ink-secondary">{piece.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {piece.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/[0.06] bg-[#f5f5f7] px-2.5 py-0.5 font-labMono text-[10px] text-ink-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {gzipKb && (
                    <div className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-[#f7f7fa] px-3 py-2 font-labMono text-[11px]">
                      <span className="text-ink-muted">Component payload</span>
                      <span className="font-medium text-[#0d8a38]">{gzipKb} kB gzip</span>
                    </div>
                  )}

                  {piece.howItWorks?.steps && (
                    <ol className="flex flex-col gap-2.5 border-t border-black/[0.06] pt-3">
                      {piece.howItWorks.steps.map(([label, detail], idx) => (
                        <li key={label} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#f5f5f7] font-labMono text-[10px] font-semibold text-ink">
                            {idx + 1}
                          </span>
                          <div>
                            <span className="font-semibold text-ink">{label}: </span>
                            <span className="text-ink-secondary">{detail}</span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}

                  {piece.howItWorks?.snippet && (
                    <pre className="overflow-x-auto rounded-xl border border-black/[0.06] bg-[#f7f7fa] p-3 font-labMono text-[11px] leading-relaxed text-ink">
                      <code>{piece.howItWorks.snippet}</code>
                    </pre>
                  )}

                  <button
                    type="button"
                    disabled={sandboxBusy}
                    onClick={handleOpenSandbox}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink py-2.5 font-labMono text-[11.5px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {sandboxBusy ? <Loader2 size={13} className="animate-spin" /> : <ExternalLink size={13} />}
                    {sandboxBusy ? "Preparing CodeSandbox…" : "Open in CodeSandbox"}
                  </button>
                </div>
              )}

              {inspectorTab === "source" && (
                <div className="flex flex-col gap-3">
                  <LabSourceViewport key={piece.id} files={files} maxHeightClass="max-h-[420px]" />
                  <button
                    type="button"
                    disabled={sandboxBusy}
                    onClick={handleOpenSandbox}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white py-2 font-labMono text-[11px] font-medium text-ink transition-colors hover:bg-[#f5f5f7] disabled:opacity-60"
                  >
                    {sandboxBusy ? <Loader2 size={12.5} className="animate-spin" /> : <ExternalLink size={12.5} />}
                    {sandboxBusy ? "Preparing…" : "Launch Live CodeSandbox"}
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
