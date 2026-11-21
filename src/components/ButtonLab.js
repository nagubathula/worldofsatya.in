"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Check, Copy, Download, Heart, Trash2 } from "lucide-react";
import Magnetic from "./Magnetic";
import { playPopSound, playTickSound, playTingSound } from "./SoundEffects";
import { scaleDuration, scaleSpring, useLabTuner } from "@/lib/labTuning";
import { SPRING } from "@/lib/motion";

// Six small buttons, each with one interaction worth pressing twice.
const VIOLET = "#5b4cf0";

function Cell({ label, children }) {
  return (
    <div className="flex min-h-[150px] flex-col items-center justify-center gap-5 rounded-2xl border border-black/[0.05] bg-white/70 px-4 py-6">
      <div className="flex min-h-[56px] items-center justify-center">{children}</div>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">{label}</p>
    </div>
  );
}

// The label rolls up and its twin rolls in from below; the pill leans toward the cursor.
function MagneticPill({ spring }) {
  return (
    <Magnetic strength={0.35} max={14}>
      <motion.button
        type="button"
        initial="rest"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        className="group relative flex h-12 items-center gap-2 overflow-hidden rounded-full bg-[#111111] pl-5 pr-4 text-[14px] font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] focus-visible:ring-offset-2"
      >
        <span className="relative block h-5 overflow-hidden">
          <motion.span className="block" variants={{ rest: { y: 0 }, hover: { y: "-100%" } }} transition={spring}>
            Let&apos;s talk
          </motion.span>
          <motion.span
            aria-hidden="true"
            className="absolute left-0 top-full block"
            variants={{ rest: { y: 0 }, hover: { y: "-100%" } }}
            transition={spring}
          >
            Let&apos;s talk
          </motion.span>
        </span>
        <motion.span
          className="grid h-7 w-7 place-items-center rounded-full bg-white text-[#111111]"
          variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -45, scale: 1.08 } }}
          transition={spring}
        >
          <ArrowRight size={14} />
        </motion.span>
      </motion.button>
    </Magnetic>
  );
}

// The knob squashes wide while pressed, like a finger pushing it, then springs across.
function TactileSwitch({ spring }) {
  const [on, setOn] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Tactile switch"
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={() => {
        setOn((value) => !value);
        playTickSound(on ? 1200 : 2000, 0.07);
      }}
      className="relative h-9 w-16 rounded-full outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[#0879a0] focus-visible:ring-offset-2"
      style={{ backgroundColor: on ? VIOLET : "#d1d1d6" }}
    >
      <motion.span
        className="absolute top-1 block h-7 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.2)]"
        initial={false}
        animate={{
          width: pressed ? 34 : 28,
          left: on ? (pressed ? 26 : 32) : 4,
        }}
        transition={spring}
      />
    </button>
  );
}

// A heart that pops and fires a ring of sparks, each a little different.
function BurstLike({ particles = 12, spring, timeScale = 1 }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(128);
  const [burst, setBurst] = useState(0);
  const countNum = Math.max(4, Math.round(particles));
  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      onClick={() => {
        const next = !liked;
        setLiked(next);
        setCount((c) => c + (next ? 1 : -1));
        if (next) {
          setBurst((b) => b + 1);
          playPopSound(720, 0.12);
        }
      }}
      className="relative flex h-12 items-center gap-2 rounded-full border border-black/[0.08] bg-white pl-3 pr-4 text-[14px] font-medium text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] focus-visible:ring-offset-2"
    >
      <span className="relative grid h-7 w-7 place-items-center">
        <AnimatePresence>
          {burst > 0 && liked && (
            <motion.span key={burst} className="pointer-events-none absolute inset-0" aria-hidden="true">
              {Array.from({ length: countNum }, (_, i) => {
                const angle = (i / countNum) * Math.PI * 2;
                const distance = 22 + (i % 3) * 6;
                return (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: i % 2 ? "#ff375f" : VIOLET, marginLeft: -3, marginTop: -3 }}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, scale: 0, opacity: 0 }}
                    transition={{ duration: scaleDuration(0.6, timeScale), ease: [0.22, 1, 0.36, 1] }}
                  />
                );
              })}
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-[#ff375f]"
                initial={{ scale: 0.4, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: scaleDuration(0.45, timeScale) }}
              />
            </motion.span>
          )}
        </AnimatePresence>
        <motion.span
          key={liked ? "on" : "off"}
          initial={{ scale: liked ? 0.3 : 1 }}
          animate={{ scale: 1 }}
          transition={scaleSpring({ type: "spring", stiffness: 600, damping: 12 }, timeScale)}
        >
          <Heart size={20} className={liked ? "fill-[#ff375f] text-[#ff375f]" : "text-ink"} />
        </motion.span>
      </span>
      <span className="relative h-5 w-8 overflow-hidden tabular-nums">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={count}
            className="block"
            initial={{ y: liked ? 18 : -18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: liked ? -18 : 18, opacity: 0 }}
            transition={spring}
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}

function HoldLabel({ done = false, className = "" }) {
  return (
    <span className={`absolute inset-0 flex items-center justify-center gap-2 ${className}`}>
      {done ? <Check size={16} /> : <Trash2 size={15} />}
      {done ? "Deleted" : "Hold to delete"}
    </span>
  );
}

// Fills while held; letting go early drains it back. Full, it confirms.
function HoldToConfirm({ holdMs = 1200, timeScale = 1 }) {
  const progress = useMotionValue(0);
  const width = useTransform(progress, (p) => `${p * 100}%`);
  const clip = useTransform(progress, (p) => `inset(0 ${100 - p * 100}% 0 0)`);
  const [done, setDone] = useState(false);
  const fill = useRef(null);

  useEffect(() => () => fill.current?.stop(), []);

  const start = () => {
    if (done) return;
    fill.current?.stop();
    fill.current = animate(progress, 1, {
      duration: scaleDuration((holdMs / 1000) * (1 - progress.get()), timeScale),
      ease: "linear",
      onComplete: () => {
        setDone(true);
        playTingSound(1318, 0.07);
        window.setTimeout(() => {
          setDone(false);
          progress.set(0);
        }, 1800);
      },
    });
  };
  const cancel = () => {
    if (done) return;
    fill.current?.stop();
    fill.current = animate(progress, 0, { duration: scaleDuration(0.35, timeScale), ease: [0.22, 1, 0.36, 1] });
  };

  return (
    <button
      type="button"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && !e.repeat && start()}
      onKeyUp={(e) => (e.key === " " || e.key === "Enter") && cancel()}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={done ? "Deleted" : "Hold to delete"}
      className="relative h-12 w-44 touch-none select-none overflow-hidden rounded-full border border-[#ff3b30]/25 bg-[#fff1f0] text-[14px] font-medium text-[#c4211a] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] focus-visible:ring-offset-2"
    >
      <motion.span className="absolute inset-y-0 left-0 bg-[#ff3b30]" style={{ width }} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={done ? "done" : "hold"}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="absolute inset-0"
        >
          {/* Red label on the pale track, a white copy clipped to the fill: the text
              turns white exactly where the fill has reached. */}
          <HoldLabel done={done} className={done ? "text-white" : ""} />
          {!done && (
            <motion.span aria-hidden="true" className="absolute inset-0" style={{ clipPath: clip }}>
              <HoldLabel className="text-white" />
            </motion.span>
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

const RING = 2 * Math.PI * 18;

// Pill shrinks into a progress ring, the ring fills, a check lands, and it opens back up.
function DownloadMorph() {
  const [phase, setPhase] = useState("idle");
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    if (phase !== "idle") return;
    setPhase("loading");
    timers.current = [
      setTimeout(() => {
        setPhase("done");
        playTingSound(1568, 0.06);
      }, 1500),
      setTimeout(() => setPhase("idle"), 3000),
    ];
  };

  const round = phase !== "idle";
  return (
    <motion.button
      type="button"
      onClick={run}
      aria-label={phase === "done" ? "Downloaded" : phase === "loading" ? "Downloading" : "Download"}
      initial={false}
      animate={{ width: round ? 48 : 148, backgroundColor: phase === "done" ? "#1f9d55" : "#111111" }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="relative flex h-12 items-center justify-center overflow-hidden rounded-full text-[14px] font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] focus-visible:ring-offset-2"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {phase === "idle" && (
          <motion.span key="label" className="flex items-center gap-2 whitespace-nowrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Download size={15} /> Download
          </motion.span>
        )}
        {phase === "loading" && (
          <motion.svg key="ring" width="40" height="40" viewBox="0 0 40 40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
            <motion.circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={RING}
              initial={{ strokeDashoffset: RING }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
              style={{ rotate: -90, transformOrigin: "50% 50%" }}
            />
          </motion.svg>
        )}
        {phase === "done" && (
          <motion.span key="done" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
            <Check size={20} strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// The label rolls over to "Copied", and the link really is on the clipboard.
function CopyRoll() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText("https://worldofsatya.in");
        } catch {}
        setCopied(true);
        playTingSound(2093, 0.045);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1600);
      }}
      className="relative flex h-12 items-center gap-2 overflow-hidden rounded-xl border border-black/[0.08] bg-white px-4 text-[14px] font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] focus-visible:ring-offset-2"
    >
      <span className="relative grid h-4 w-4 place-items-center">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={copied ? "check" : "copy"}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={SPRING.press}
            className={copied ? "text-[#1f9d55]" : ""}
          >
            {copied ? <Check size={16} strokeWidth={2.5} /> : <Copy size={15} />}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="relative h-5 overflow-hidden">
        <motion.span className="flex flex-col" animate={{ y: copied ? "-50%" : "0%" }} transition={SPRING.press}>
          <span className="h-5">Copy link</span>
          <span className="h-5 text-[#1f9d55]">Copied!</span>
        </motion.span>
      </span>
      <span className="sr-only" aria-live="polite">{copied ? "Link copied" : ""}</span>
    </button>
  );
}

export default function ButtonLab() {
  const tuner = useLabTuner("buttons", {
    stiffness: 450,
    damping: 24,
    holdMs: 1200,
    particles: 12,
  });

  const pressSpring = scaleSpring(
    { type: "spring", stiffness: tuner.stiffness, damping: tuner.damping },
    tuner.timeScale,
  );
  const switchSpring = scaleSpring(
    { type: "spring", stiffness: Math.max(220, tuner.stiffness + 70), damping: Math.max(12, tuner.damping + 6) },
    tuner.timeScale,
  );

  return (
    <div className="grid w-full grid-cols-1 gap-3 p-3 sm:grid-cols-3 sm:gap-4 sm:p-6">
      <Cell label="Magnetic pill"><MagneticPill spring={pressSpring} /></Cell>
      <Cell label="Tactile switch"><TactileSwitch spring={switchSpring} /></Cell>
      <Cell label="Burst like"><BurstLike particles={tuner.particles} spring={pressSpring} timeScale={tuner.timeScale} /></Cell>
      <Cell label="Hold to confirm"><HoldToConfirm holdMs={tuner.holdMs} timeScale={tuner.timeScale} /></Cell>
      <Cell label="Download morph"><DownloadMorph /></Cell>
      <Cell label="Copy link"><CopyRoll /></Cell>
    </div>
  );
}
