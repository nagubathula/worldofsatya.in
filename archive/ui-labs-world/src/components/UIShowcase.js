"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useLenis } from "lenis/react";
import {
  Activity,
  Check,
  ChevronDown,
  Code2,
  ExternalLink,
  Hash,
  Loader2,
  RotateCcw,
} from "lucide-react";
import WorksFan from "./WorksFan";
import ButtonLab from "./ButtonLab";
import SensorLab from "./SensorLab";
import LayoutLab from "./LayoutLab";
import TypeLab from "./TypeLab";
import CommandPaletteLab from "./CommandPaletteLab";
import DrawerLab from "./DrawerLab";
import FormLab from "./FormLab";
import ChartLab from "./ChartLab";
import ThemeLab from "./ThemeLab";
import SourceDrawer from "./SourceDrawer";
import { calendarSections } from "./FlipCalendarNav";
import { useBlackHoleTransition } from "./BlackHoleTransition";
import { playTickSound, playTingSound } from "./SoundEffects";
import { PIECE_META } from "@/data/uiLabMeta";
import { SPRING, EASE_OUT } from "@/lib/motion";
import { useReducedMotionAfterHydration } from "@/lib/reducedMotion";
import { openInCodeSandbox } from "@/lib/codesandbox";

const worksPreview = calendarSections.find((section) => section.isWorks).previewItems;

// WebGL, so it loads in the browser only, after the page.
const LanyardWall = dynamic(() => import("./LanyardWall"), { ssr: false });

function WorksHandDemo({ reduceMotion }) {
  const { navigate } = useBlackHoleTransition();
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <div className="relative aspect-[100/124] w-[min(360px,84vw)] sm:aspect-[780/380] sm:w-[min(720px,88%)]">
        <WorksFan items={worksPreview} onNavigate={navigate} interactive reduceMotion={reduceMotion} />
      </div>
    </div>
  );
}

const DEMOS = {
  "id-badge": LanyardWall,
  buttons: ButtonLab,
  layout: LayoutLab,
  type: TypeLab,
  sensors: SensorLab,
  "works-hand": WorksHandDemo,
  "command-palette": CommandPaletteLab,
  "bottom-sheet": DrawerLab,
  forms: FormLab,
  "data-viz": ChartLab,
  "theme-transition": ThemeLab,
};

function JumpNav({ activeId, onJump }) {
  const navScrollRef = useRef(null);
  const chipRefs = useRef({});
  const [makeWayForFace, setMakeWayForFace] = useState(false);

  // HomeFace appears at top-center on scroll-up past 80px; shift down so chips never collide with it.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 6) return;
      const up = y < lastY && y > 80;
      setMakeWayForFace(up);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the active chip centered inside the horizontal strip.
  useEffect(() => {
    const container = navScrollRef.current;
    const chip = chipRefs.current[activeId];
    if (!container || !chip) return;
    const targetLeft = chip.offsetLeft - container.clientWidth / 2 + chip.clientWidth / 2;
    container.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  }, [activeId]);

  return (
    <div
      className={`sticky z-30 mb-8 transition-[top] duration-300 sm:mb-12 ${
        makeWayForFace ? "top-[72px] sm:top-[82px]" : "top-3 sm:top-4"
      }`}
    >
      <nav
        ref={navScrollRef}
        aria-label="Jump to UI Lab piece"
        data-lenis-prevent
        className="mx-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-black/[0.07] bg-white/80 p-1.5 shadow-[0_8px_28px_-10px_rgba(0,0,0,0.12)] backdrop-blur-xl"
      >
        {PIECE_META.map((piece, idx) => {
          const active = activeId === piece.id;
          const num = String(idx + 1).padStart(2, "0");
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
              className="relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
            >
              {active && (
                <motion.span
                  layoutId="ui-lab-jump-chip"
                  transition={SPRING.pill}
                  className="absolute inset-0 rounded-full bg-ink shadow-sm"
                />
              )}
              <span className={`relative z-10 font-mono text-[10.5px] ${active ? "text-white/70" : "text-ink-muted"}`}>
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

function PerfBadge({ inView, stageActive, gzipKb }) {
  const [fps, setFps] = useState(null);
  const [cls, setCls] = useState("0.00");

  // Sample FPS only while this stage is visible and actively interacted with.
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
      setFps(null);
    };
  }, [inView, stageActive]);

  // Read live Cumulative Layout Shift for the page via PerformanceObserver.
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

  const fpsLabel = inView && stageActive && fps !== null ? `${fps} fps` : "idle";

  return (
    <div
      aria-label="Runtime performance telemetry"
      className="inline-flex flex-wrap items-center gap-2 rounded-full border border-black/[0.06] bg-[#f5f5f7]/90 px-2.5 py-1 font-mono text-[10.5px] text-ink-muted"
    >
      <span className="inline-flex items-center gap-1 text-ink-secondary">
        <Activity size={10.5} className={fpsLabel === "idle" ? "text-ink-muted" : "text-[#0d8a38]"} />
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

function PieceSection({
  piece,
  index,
  reduceMotion,
  gzipKb,
  sandboxBusy,
  onOpenSource,
  onOpenSandbox,
  registerRef,
}) {
  const { id, title, description, tags, hint, stage, minHeight, howItWorks } = piece;
  const Demo = DEMOS[id];

  const articleRef = useRef(null);
  const settleTimerRef = useRef(null);

  const [mounted, setMounted] = useState(index === 0);
  const [inView, setInView] = useState(index === 0);
  const [stageActive, setStageActive] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [builtOpen, setBuiltOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Lazy-mount when approaching the viewport, and track on-screen visibility to pause off-screen work.
  useEffect(() => {
    const el = articleRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const mountObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          mountObserver.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
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
    const url = `${window.location.origin}/ui#${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
    try {
      window.history.replaceState(null, "", `#${id}`);
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
      className="scroll-mt-28"
      aria-labelledby={`${id}-title`}
    >
      {/* Interactive Stage */}
      <div
        // Interactive demos own their gestures: the site's swipe and flip handlers skip them.
        data-prevent-flip="true"
        data-stage-paused={!inView ? "true" : undefined}
        onPointerEnter={activateStage}
        onPointerLeave={deactivateStageSoon}
        onPointerDown={() => {
          activateStage();
          setInteracted(true);
        }}
        onFocusCapture={activateStage}
        onBlurCapture={deactivateStageSoon}
        onKeyDown={(e) => {
          if (["Enter", " ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) || e.key.length === 1) {
            setInteracted(true);
          }
        }}
        className={`relative w-full overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm ${stage}`}
      >
        {/* Replay / reset button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleReplay();
          }}
          aria-label={`Replay or reset ${title}`}
          title={`Reset ${title}`}
          className="absolute right-3.5 top-3.5 z-20 inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/85 px-2.5 py-1.5 font-mono text-[10.5px] font-medium text-ink-secondary shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
        >
          <RotateCcw size={12} />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {mounted ? (
          <Demo
            key={resetKey}
            reduceMotion={reduceMotion || !inView}
            paused={!inView}
          />
        ) : (
          <div className={`flex w-full items-center justify-center ${minHeight}`}>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              Loading {piece.shortTitle}…
            </span>
          </div>
        )}

        <p
          className={`pointer-events-none absolute inset-x-0 bottom-4 px-4 text-center font-mono text-[11px] tracking-[0.02em] text-ink-muted transition-opacity duration-500 ${
            interacted ? "opacity-0" : "opacity-100"
          }`}
        >
          {hint}
        </p>
      </div>

      {/* Piece Details */}
      <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-[1fr_1.45fr] sm:gap-10">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="font-mono text-[11px] text-ink-muted">{String(index + 1).padStart(2, "0")}</p>
            <PerfBadge inView={inView} stageActive={stageActive} gzipKb={gzipKb} />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <h2 id={`${id}-title`} className="text-xl font-semibold tracking-[-0.03em] text-ink sm:text-2xl">
              {title}
            </h2>
            <button
              type="button"
              onClick={handleCopyPermalink}
              aria-label={`Copy link to ${title}`}
              title={`Copy /ui#${id}`}
              className="inline-flex items-center gap-1 rounded-full border border-black/[0.07] bg-white px-2 py-0.5 font-mono text-[11px] text-ink-muted transition-colors hover:border-black/15 hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
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
              <li key={tag} className="rounded-full border border-black/[0.06] bg-white px-2.5 py-1 text-[11px] font-medium text-ink-secondary">
                {tag}
              </li>
            ))}
          </ul>

          {/* Engineering depth controls */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
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
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${builtOpen ? "rotate-180" : ""}`}
              />
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
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#f5f5f7] font-mono text-[10.5px] font-semibold text-ink">
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
                    <pre className="mt-3 overflow-x-auto rounded-xl border border-black/[0.05] bg-[#f7f7fa] p-3 font-mono text-[11.5px] leading-relaxed text-ink">
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

export default function UIShowcase({ sourcesById = {}, gzipKbById = {}, sharedSources = {} }) {
  const reduceMotion = useReducedMotionAfterHydration();
  const lenis = useLenis();

  const [activeId, setActiveId] = useState(PIECE_META[0].id);
  const [openSourceId, setOpenSourceId] = useState(null);
  const [sandboxBusyId, setSandboxBusyId] = useState(null);
  const sectionRefs = useRef({});

  const registerRef = useCallback((id, el) => {
    sectionRefs.current[id] = el;
  }, []);

  // Track which piece section is currently in view for the sticky jump bar.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
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

    for (const piece of PIECE_META) {
      const el = sectionRefs.current[piece.id];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const handleJump = useCallback(
    (id) => {
      setActiveId(id);
      playTickSound(1650, 0.035);
      try {
        window.history.replaceState(null, "", `#${id}`);
      } catch {}
      const target = sectionRefs.current[id] || document.getElementById(id);
      if (!target) return;
      if (lenis) {
        lenis.scrollTo(target, { offset: -96 });
      } else {
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    },
    [lenis, reduceMotion],
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
    <>
      <JumpNav activeId={activeId} onJump={handleJump} />

      <div className="flex flex-col gap-16 sm:gap-24">
        {PIECE_META.map((piece, index) => (
          <PieceSection
            key={piece.id}
            piece={piece}
            index={index}
            reduceMotion={reduceMotion}
            gzipKb={gzipKbById[piece.id]}
            sandboxBusy={sandboxBusyId === piece.id}
            onOpenSource={setOpenSourceId}
            onOpenSandbox={handleOpenSandbox}
            registerRef={registerRef}
          />
        ))}
      </div>

      <SourceDrawer
        piece={drawerPiece}
        pieceIndex={drawerIndex}
        files={drawerPiece ? sourcesById[drawerPiece.id] || [] : []}
        gzipKb={drawerPiece ? gzipKbById[drawerPiece.id] : undefined}
        sandboxBusy={Boolean(drawerPiece && sandboxBusyId === drawerPiece.id)}
        onOpenSandbox={() => drawerPiece && handleOpenSandbox(drawerPiece.id)}
        onClose={() => setOpenSourceId(null)}
      />
    </>
  );
}
