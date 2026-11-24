"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Box,
  Check,
  ChevronDown,
  Code2,
  ExternalLink,
  Grid2x2,
  Hash,
  Layers,
  Loader2,
  MousePointer2,
  SlidersHorizontal,
} from "lucide-react";
import StageFrame from "./StageFrame";
import DarkSourceModal from "./DarkSourceModal";
import { playTickSound, playTingSound } from "@/components/SoundEffects";
import { LAB_CATEGORIES, PIECE_META, UI_LAB_LAST_ADDED } from "@/data/uiLabMeta";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionAfterHydration } from "@/lib/reducedMotion";
import { openInCodeSandbox } from "@/lib/codesandbox";

function defaultTunerFor(piece) {
  const out = {};
  for (const ctrl of piece.tunerControls || []) {
    out[ctrl.key] = ctrl.default;
  }
  return out;
}

function PerfBadge({ inView, stageActive, gzipKb }) {
  const [fps, setFps] = useState(null);
  const [cls, setCls] = useState("0.00");

  useEffect(() => {
    if (!inView || !stageActive) return undefined;
    let rafId = 0;
    let frames = 0;
    let windowStart = performance.now();

    const tick = (now) => {
      frames += 1;
      const elapsed = now - windowStart;
      if (elapsed >= 500) {
        setFps(Math.min(120, Math.round((frames * 1000) / elapsed)));
        frames = 0;
        windowStart = now;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [inView, stageActive]);

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return undefined;
    let total = 0;
    let observer;
    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            total += entry.value;
            setCls(total.toFixed(2));
          }
        }
      });
      observer.observe({ type: "layout-shift", buffered: true });
    } catch {
      return undefined;
    }
    return () => observer?.disconnect();
  }, []);

  const live = inView && stageActive && fps !== null;
  const fpsLabel = live ? `${fps} fps` : "idle";

  return (
    <div
      aria-label="Runtime performance telemetry"
      className="inline-flex flex-wrap items-center gap-2 rounded-full border border-black/[0.06] bg-[#f5f5f7]/90 px-2.5 py-1 font-labMono text-[10.5px] text-ink-muted"
    >
      <span className="inline-flex items-center gap-1 text-ink-secondary">
        <Activity size={10.5} className={live ? "text-[#0d8a38]" : "text-ink-muted"} />
        <span className="tabular-nums">{fpsLabel}</span>
      </span>
      <span aria-hidden="true" className="text-black/15">·</span>
      <span className="tabular-nums">{cls} CLS</span>
      {gzipKb && (
        <>
          <span aria-hidden="true" className="text-black/15">·</span>
          <span className="tabular-nums">{gzipKb} kB gz</span>
        </>
      )}
    </div>
  );
}

function JumpNav({ pieces, activeId, onJump }) {
  const navScrollRef = useRef(null);
  const chipRefs = useRef({});

  useEffect(() => {
    const container = navScrollRef.current;
    const chip = chipRefs.current[activeId];
    if (!container || !chip) return;
    const targetLeft = chip.offsetLeft - container.clientWidth / 2 + chip.clientWidth / 2;
    container.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  }, [activeId]);

  if (pieces.length <= 1) return null;

  return (
    <div className="sticky top-[74px] z-30 mb-10 sm:top-[78px]">
      <nav
        ref={navScrollRef}
        aria-label="Jump to UI Labs specimen"
        data-lenis-prevent
        className="mx-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-black/[0.07] bg-white/85 p-1.5 shadow-[0_8px_28px_-10px_rgba(0,0,0,0.1)] backdrop-blur-xl"
      >
        {pieces.map((piece) => {
          const globalIndex = PIECE_META.findIndex((p) => p.id === piece.id);
          const active = activeId === piece.id;
          const num = String(globalIndex + 1).padStart(2, "0");
          return (
            <a
              key={piece.id}
              ref={(el) => {
                chipRefs.current[piece.id] = el;
              }}
              href={`#${piece.id}`}
              aria-current={active ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                onJump(piece.id);
              }}
              className="relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 font-labMono text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
            >
              {active && (
                <motion.span
                  layoutId="ui-labs-jump-chip"
                  transition={SPRING.pill}
                  className="absolute inset-0 rounded-full bg-ink shadow-sm"
                />
              )}
              <span className={`relative z-10 text-[10px] ${active ? "text-white/70" : "text-ink-muted"}`}>
                {num}
              </span>
              <span className={`relative z-10 ${active ? "text-white" : "text-ink-secondary hover:text-ink"}`}>
                {piece.shortTitle}
              </span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}

function SpecimenWorkbenchCard({
  piece,
  globalIndex,
  reduceMotion,
  gzipKb,
  sandboxBusy,
  onOpenSource,
  onOpenSandbox,
  registerRef,
}) {
  const { id, title, description, tags, category, howItWorks, tunerControls = [] } = piece;

  const articleRef = useRef(null);
  const settleTimerRef = useRef(null);

  const [mounted, setMounted] = useState(globalIndex === 0);
  const [inView, setInView] = useState(globalIndex === 0);
  const [stageActive, setStageActive] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [builtOpen, setBuiltOpen] = useState(false);
  const [tunerOpen, setTunerOpen] = useState(false);
  const [telemetryOn, setTelemetryOn] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [tunerValues, setTunerValues] = useState(() => defaultTunerFor(piece));

  useEffect(() => {
    const el = articleRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;

    const mountObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          mountObserver.disconnect();
        }
      },
      { rootMargin: "360px 0px" },
    );

    const viewObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setInView(entry.isIntersecting);
      },
      { rootMargin: "40px 0px" },
    );

    mountObserver.observe(el);
    viewObserver.observe(el);

    return () => {
      mountObserver.disconnect();
      viewObserver.disconnect();
    };
  }, []);

  useEffect(() => () => clearTimeout(settleTimerRef.current), []);

  const activateStage = () => {
    clearTimeout(settleTimerRef.current);
    setStageActive(true);
  };

  const deactivateStageSoon = () => {
    clearTimeout(settleTimerRef.current);
    settleTimerRef.current = window.setTimeout(() => setStageActive(false), 1200);
  };

  const handleReplay = () => {
    setResetKey((k) => k + 1);
    setInteracted(false);
    playTickSound(1400, 0.045);
  };

  const handleCopyPermalink = async () => {
    const url = `${window.location.origin}/ui/${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
    setLinkCopied(true);
    playTingSound(2093, 0.04);
    window.setTimeout(() => setLinkCopied(false), 1600);
  };

  return (
    <article
      ref={(el) => {
        articleRef.current = el;
        registerRef(id, el);
      }}
      id={id}
      className="scroll-mt-32"
      aria-labelledby={`${id}-title`}
    >
      {/* Top Specimen Instrument Strip */}
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="font-labMono text-[11px] font-semibold text-[#0879a0]">
            {String(globalIndex + 1).padStart(2, "0")}
          </span>
          <span className="rounded-full border border-black/[0.06] bg-white px-2.5 py-0.5 font-labMono text-[10px] uppercase tracking-[0.12em] text-ink-muted shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            {category}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {tunerControls.length > 0 && (
            <button
              type="button"
              aria-expanded={tunerOpen}
              onClick={() => {
                setTunerOpen((v) => !v);
                playTickSound(1550, 0.035);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-labMono text-[10.5px] transition-colors ${
                tunerOpen
                  ? "border-[#0879a0]/35 bg-[#2ec4f0]/15 text-[#0879a0]"
                  : "border-black/[0.07] bg-white text-ink-secondary hover:bg-[#f5f5f7] hover:text-ink"
              }`}
            >
              <SlidersHorizontal size={11} />
              Tuner
            </button>
          )}

          <button
            type="button"
            aria-pressed={telemetryOn}
            onClick={() => {
              setTelemetryOn((v) => !v);
              playTickSound(1650, 0.035);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-labMono text-[10.5px] transition-colors ${
              telemetryOn
                ? "border-[#5b4cf0]/35 bg-[#5b4cf0]/10 text-[#5b4cf0]"
                : "border-black/[0.07] bg-white text-ink-secondary hover:bg-[#f5f5f7] hover:text-ink"
            }`}
          >
            <Activity size={11} />
            HUD
          </button>

          <Link
            href={`/ui/${id}`}
            className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-white px-3 py-1 font-labMono text-[10.5px] font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:border-[#0879a0]/40 hover:text-[#0879a0]"
          >
            Open Theater
            <ArrowUpRight size={11.5} />
          </Link>
        </div>
      </div>

      {/* Inline Quick Tuner Drawer */}
      <AnimatePresence initial={false}>
        {tunerOpen && tunerControls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="mb-3 overflow-hidden"
          >
            <div className="grid gap-3 rounded-2xl border border-black/[0.07] bg-white/90 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] sm:grid-cols-2 lg:grid-cols-4">
              {tunerControls.map((ctrl) => {
                const val = tunerValues[ctrl.key] ?? ctrl.default;
                return (
                  <label key={ctrl.key} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between font-labMono text-[10.5px]">
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Stage Frame */}
      <StageFrame
        piece={piece}
        mounted={mounted}
        inView={inView}
        reduceMotion={reduceMotion}
        tunerValues={tunerValues}
        telemetryOn={telemetryOn}
        resetKey={resetKey}
        interacted={interacted}
        onReset={handleReplay}
        onInteract={() => setInteracted(true)}
        onStageEnter={activateStage}
        onStageLeave={deactivateStageSoon}
      />

      {/* Specimen Details */}
      <div className="mt-5 grid gap-5 sm:mt-6 sm:grid-cols-[1fr_1.45fr] sm:gap-10">
        <div>
          <PerfBadge inView={inView} stageActive={stageActive} gzipKb={gzipKb} />
          <div className="mt-3 flex items-center gap-2.5">
            <h2 id={`${id}-title`} className="text-xl font-semibold tracking-[-0.03em] text-ink sm:text-2xl">
              <Link href={`/ui/${id}`} className="transition-colors hover:text-[#0879a0]">
                {title}
              </Link>
            </h2>
            <button
              type="button"
              onClick={handleCopyPermalink}
              aria-label={`Copy link to ${title}`}
              title={`Copy /ui/${id}`}
              className="inline-flex items-center gap-1 rounded-full border border-black/[0.07] bg-white px-2 py-0.5 font-labMono text-[10.5px] text-ink-muted transition-colors hover:border-black/15 hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
            >
              {linkCopied ? <Check size={11} className="text-[#0d8a38]" /> : <Hash size={11} />}
              {linkCopied && <span className="text-[#0d8a38]">Copied</span>}
            </button>
          </div>
        </div>

        <div>
          <p className="text-[14px] leading-relaxed text-ink-secondary">{description}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Techniques">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-black/[0.06] bg-white px-2.5 py-1 text-[11px] font-medium text-ink-secondary"
              >
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href={`/ui/${id}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 font-labMono text-[11.5px] font-medium text-white transition-opacity hover:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
            >
              <span>Theater & Tuner</span>
              <ArrowUpRight size={13} />
            </Link>

            <button
              type="button"
              aria-expanded={builtOpen}
              onClick={() => {
                setBuiltOpen((v) => !v);
                playTickSound(1600, 0.04);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-ink transition-colors hover:bg-[#f5f5f7] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
            >
              <span>How it&apos;s built</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${builtOpen ? "rotate-180" : ""}`} />
            </button>

            <button
              type="button"
              onClick={() => {
                playTickSound(1700, 0.04);
                onOpenSource(id);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-ink transition-colors hover:bg-[#f5f5f7] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
            >
              <Code2 size={13} />
              <span>Source</span>
            </button>

            <button
              type="button"
              disabled={sandboxBusy}
              onClick={() => {
                playTickSound(1750, 0.04);
                onOpenSandbox(id);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-ink transition-colors hover:bg-[#f5f5f7] disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
            >
              {sandboxBusy ? <Loader2 size={12.5} className="animate-spin" /> : <ExternalLink size={12.5} />}
              <span>{sandboxBusy ? "Opening…" : "CodeSandbox"}</span>
            </button>
          </div>

          <AnimatePresence initial={false}>
            {builtOpen && howItWorks && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: EASE_OUT }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-2xl border border-black/[0.07] bg-white/90 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <ol className="flex flex-col gap-2.5">
                    {howItWorks.steps.map(([label, detail], stepIdx) => (
                      <li key={label} className="flex items-start gap-2.5 text-[13px] leading-relaxed">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#f5f5f7] font-labMono text-[10.5px] font-semibold text-ink">
                          {stepIdx + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-ink">{label}: </span>
                          <span className="text-ink-secondary">{detail}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                  {howItWorks.snippet && (
                    <pre className="mt-3 overflow-x-auto rounded-xl border border-black/[0.05] bg-[#f7f7fa] p-3 font-labMono text-[11.5px] leading-relaxed text-ink">
                      <code>{howItWorks.snippet}</code>
                    </pre>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </article>
  );
}

export default function LabIndex({ sourcesById = {}, gzipKbById = {}, sharedSources = {} }) {
  const reduceMotion = useReducedMotionAfterHydration();

  const [category, setCategory] = useState("All");
  const [viewMode, setViewMode] = useState("workbench"); // "workbench" | "matrix"
  const [activeId, setActiveId] = useState(PIECE_META[0].id);
  const [openSourceId, setOpenSourceId] = useState(null);
  const [sandboxBusyId, setSandboxBusyId] = useState(null);
  const sectionRefs = useRef({});

  const filteredPieces = useMemo(
    () => (category === "All" ? PIECE_META : PIECE_META.filter((p) => p.category === category)),
    [category],
  );

  const registerRef = useCallback((id, el) => {
    sectionRefs.current[id] = el;
  }, []);

  useEffect(() => {
    if (viewMode !== "workbench" || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-25% 0px -55% 0px" },
    );

    for (const piece of filteredPieces) {
      const el = sectionRefs.current[piece.id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [filteredPieces, viewMode]);

  const handleJump = useCallback(
    (id) => {
      setActiveId(id);
      playTickSound(1650, 0.035);
      const target = sectionRefs.current[id] || document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    },
    [reduceMotion],
  );

  const handleOpenSandbox = useCallback(
    async (id) => {
      const meta = PIECE_META.find((p) => p.id === id);
      if (!meta) return;
      setSandboxBusyId(id);
      try {
        await openInCodeSandbox(meta, sourcesById[id] || [], sharedSources);
      } finally {
        setSandboxBusyId((cur) => (cur === id ? null : cur));
      }
    },
    [sourcesById, sharedSources],
  );

  const drawerIndex = PIECE_META.findIndex((p) => p.id === openSourceId);
  const drawerPiece = drawerIndex >= 0 ? PIECE_META[drawerIndex] : null;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-8 sm:pt-16">
      {/* World Hero */}
      <header className="mb-10 border-b border-black/[0.08] pb-10">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.04] bg-[#f5f5f7] px-3 py-1 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-[#626267]">
            <MousePointer2 size={11} className="text-sage" /> Autonomous UI World · lab.worldofsatya.in
          </span>
        </div>

        <h1 className="text-6xl font-semibold tracking-[-0.05em] text-ink sm:text-8xl">
          UI Labs<span className="text-sage">.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-secondary sm:text-lg">
          A dedicated workbench for interfaces that answer back — live WebGL physics, tactile audio synthesis, optical shaders, generative UI, and micro-interactions you can tune in real time.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-labMono text-[12px] text-ink-muted">
            {PIECE_META.length} interactive specimens · Last added {UI_LAB_LAST_ADDED} · Slow-Mo &amp; Telemetry enabled
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/ui/notes"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 font-labMono text-[11px] font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[#f5f5f7]"
            >
              <BookOpen size={12.5} className="text-[#0879a0]" />
              Field Notes
            </Link>
            <Link
              href="/ui/primitives"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3.5 py-1.5 font-labMono text-[11px] font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[#f5f5f7]"
            >
              <Box size={12.5} className="text-[#0d8a38]" />
              Primitives Shelf
            </Link>
          </div>
        </div>
      </header>

      {/* Category Filter + View Mode Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter specimens by category">
          {LAB_CATEGORIES.map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setCategory(cat);
                  const first = cat === "All" ? PIECE_META[0] : PIECE_META.find((p) => p.category === cat);
                  if (first) setActiveId(first.id);
                  playTickSound(1600, 0.035);
                }}
                className="relative rounded-full px-3 py-1.5 font-labMono text-[11px] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
              >
                {active && (
                  <motion.span
                    layoutId="lab-category-pill"
                    transition={SPRING.pill}
                    className="absolute inset-0 rounded-full bg-ink shadow-sm"
                  />
                )}
                <span className={`relative z-10 ${active ? "text-white" : "text-ink-secondary hover:text-ink"}`}>
                  {cat}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 rounded-full border border-black/[0.07] bg-[#f5f5f7] p-1" role="group" aria-label="View mode">
          {[
            { id: "workbench", label: "Workbench", icon: Layers },
            { id: "matrix", label: "Matrix", icon: Grid2x2 },
          ].map((mode) => {
            const active = viewMode === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setViewMode(mode.id);
                  playTickSound(1700, 0.035);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-labMono text-[11px] transition-colors ${
                  active ? "bg-white font-medium text-ink shadow-sm" : "text-ink-muted hover:text-ink"
                }`}
              >
                <Icon size={12} />
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Workbench View vs Matrix Catalog */}
      {viewMode === "workbench" ? (
        <>
          <JumpNav pieces={filteredPieces} activeId={activeId} onJump={handleJump} />
          <div className="flex flex-col gap-16 sm:gap-24">
            {filteredPieces.map((piece) => {
              const globalIndex = PIECE_META.findIndex((p) => p.id === piece.id);
              return (
                <SpecimenWorkbenchCard
                  key={piece.id}
                  piece={piece}
                  globalIndex={globalIndex}
                  reduceMotion={reduceMotion}
                  gzipKb={gzipKbById[piece.id]}
                  sandboxBusy={sandboxBusyId === piece.id}
                  onOpenSource={setOpenSourceId}
                  onOpenSandbox={handleOpenSandbox}
                  registerRef={registerRef}
                />
              );
            })}
          </div>
        </>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredPieces.map((piece) => {
            const globalIndex = PIECE_META.findIndex((p) => p.id === piece.id);
            return (
              <div
                key={piece.id}
                className="group flex flex-col justify-between rounded-[22px] border border-black/[0.07] bg-white/85 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm transition-colors hover:border-black/[0.14]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: piece.accent || "#0879a0" }}
                      />
                      <span className="font-labMono text-[11px] text-ink-muted">
                        {String(globalIndex + 1).padStart(2, "0")} · {piece.category}
                      </span>
                    </div>
                    {gzipKbById[piece.id] && (
                      <span className="font-labMono text-[10.5px] text-ink-muted">
                        {gzipKbById[piece.id]} kB gz
                      </span>
                    )}
                  </div>

                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-ink">
                    <Link href={`/ui/${piece.id}`} className="transition-colors group-hover:text-[#0879a0]">
                      {piece.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-ink-secondary">
                    {piece.description}
                  </p>

                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {piece.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/[0.06] bg-[#f5f5f7] px-2.5 py-0.5 font-labMono text-[10px] text-ink-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-4">
                  <Link
                    href={`/ui/${piece.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 font-labMono text-[11px] font-medium text-white transition-opacity hover:opacity-90"
                  >
                    Open Theater
                    <ArrowUpRight size={12.5} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setOpenSourceId(piece.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 font-labMono text-[11px] text-ink-secondary hover:bg-[#f5f5f7] hover:text-ink"
                  >
                    <Code2 size={12.5} />
                    Source
                  </button>
                  <button
                    type="button"
                    disabled={sandboxBusyId === piece.id}
                    onClick={() => handleOpenSandbox(piece.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 font-labMono text-[11px] text-ink-secondary hover:bg-[#f5f5f7] hover:text-ink disabled:opacity-60"
                  >
                    <ExternalLink size={12} />
                    Sandbox
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DarkSourceModal
        piece={drawerPiece}
        pieceIndex={drawerIndex}
        files={drawerPiece ? sourcesById[drawerPiece.id] || [] : []}
        gzipKb={drawerPiece ? gzipKbById[drawerPiece.id] : undefined}
        sandboxBusy={Boolean(drawerPiece && sandboxBusyId === drawerPiece.id)}
        onOpenSandbox={() => drawerPiece && handleOpenSandbox(drawerPiece.id)}
        onClose={() => setOpenSourceId(null)}
      />
    </main>
  );
}
