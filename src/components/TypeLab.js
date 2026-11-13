"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { RotateCcw, Volume1, Volume2 } from "lucide-react";
import { playPopSound, playTickSound } from "./SoundEffects";
import { SPRING } from "@/lib/motion";

// Six pieces about type and texture: letters, numbers, light and goo.
const VIOLET = "#5b4cf0";

function Cell({ label, children }) {
  return (
    <div className="relative flex min-h-[190px] flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border border-black/[0.05] bg-white/70 px-4 py-6">
      <div className="flex min-h-[72px] w-full items-center justify-center">{children}</div>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#6e6e73]">{label}</p>
    </div>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";
const WORDS = ["DESIGN ENGINEER", "MOTION + CODE", "PIXELS THAT MOVE"];

// Letters spin through random glyphs and lock in left to right.
function ScrambleText({ reduceMotion }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(WORDS[0]);
  const timer = useRef(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const run = useCallback(
    (target) => {
      clearInterval(timer.current);
      // Reduced motion: no spinning glyphs, the next frame just shows the word.
      let frame = reduceMotion ? target.length * 2 : 0;
      timer.current = setInterval(() => {
        frame += 1;
        const settled = Math.floor(frame / 2);
        setText(
          target
            .split("")
            .map((ch, i) => (ch === " " || i < settled ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join("")
        );
        if (frame % 3 === 0) playTickSound(2400 + Math.random() * 600, 0.015);
        if (settled >= target.length) clearInterval(timer.current);
      }, 32);
    },
    [reduceMotion]
  );

  useEffect(() => {
    if (inView) run(WORDS[0]);
  }, [inView, run]);
  useEffect(() => () => clearInterval(timer.current), []);

  const nextWord = () => {
    const i = (index + 1) % WORDS.length;
    setIndex(i);
    run(WORDS[i]);
  };

  return (
    <button
      ref={ref}
      type="button"
      onPointerEnter={(e) => e.pointerType === "mouse" && run(WORDS[index])}
      onClick={nextWord}
      aria-label={`Scramble text: ${WORDS[index]}. Click for the next phrase.`}
      className="rounded-lg px-2 py-1 font-mono text-[17px] font-semibold tracking-[0.08em] text-[#1d1d1f] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
    >
      <span aria-hidden="true">{text}</span>
    </button>
  );
}

// One column of 0–9 per digit; each slides to its number on its own spring.
function Digit({ value }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        animate={{ y: `${-value}em` }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block h-[1em] text-center leading-none">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function Odometer() {
  const [value, setValue] = useState(4096);
  const digits = String(value).padStart(5, "0").split("").map(Number);
  const bump = (by) => {
    setValue((v) => Math.max(0, Math.min(99999, v + by)));
    playTickSound(1700, 0.04);
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="flex text-[40px] font-semibold leading-none tracking-[-0.02em] text-[#1d1d1f] tabular-nums" aria-live="polite" aria-label={String(value)}>
        {digits.map((d, i) => (
          <span key={i} className="flex" aria-hidden="true">
            {i === 2 && <span className="w-[0.3em] text-center leading-none">,</span>}
            <Digit value={d} />
          </span>
        ))}
      </p>
      <div className="flex gap-1.5">
        {[
          ["+1", () => bump(1)],
          ["+250", () => bump(250)],
          ["Random", () => { setValue(Math.floor(Math.random() * 99999)); playTickSound(1500, 0.04); }],
        ].map(([label, onClick]) => (
          <motion.button
            key={label}
            type="button"
            onClick={onClick}
            whileTap={{ scale: 0.92 }}
            transition={SPRING.press}
            className="h-8 rounded-full border border-black/[0.08] bg-white px-3 text-[12px] font-medium text-[#1d1d1f] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// One light follows the cursor across all four tiles, lighting borders as it passes.
function SpotlightGrid() {
  const grid = useRef(null);
  const tiles = useRef([]);
  const move = (e) => {
    tiles.current.forEach((tile) => {
      if (!tile) return;
      const r = tile.getBoundingClientRect();
      tile.style.setProperty("--x", `${e.clientX - r.left}px`);
      tile.style.setProperty("--y", `${e.clientY - r.top}px`);
    });
  };
  return (
    <div
      ref={grid}
      onPointerMove={move}
      onPointerLeave={() => tiles.current.forEach((t) => t?.style.setProperty("--x", "-999px"))}
      className="grid w-full max-w-[240px] grid-cols-2 gap-2"
    >
      {["Grid", "Type", "Color", "Motion"].map((label, i) => (
        <div
          key={label}
          ref={(el) => (tiles.current[i] = el)}
          style={{ "--x": "-999px", "--y": "-999px" }}
          className="group relative h-16 rounded-xl bg-[#e8e8ed] p-px"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-xl"
            style={{ background: `radial-gradient(120px circle at var(--x) var(--y), ${VIOLET}, transparent 70%)` }}
          />
          <span className="relative flex h-full items-end overflow-hidden rounded-[11px] bg-white px-2.5 py-2 text-[12px] font-medium text-[#515154]">
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "radial-gradient(90px circle at var(--x) var(--y), rgba(91,76,240,0.12), transparent 70%)" }}
            />
            <span className="relative">{label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

const GOO_MODES = {
  orbit: [
    { x: [0, 22, 0, -22, 0], y: [-22, 0, 22, 0, -22] },
    { x: [0, -22, 0, 22, 0], y: [22, 0, -22, 0, 22] },
    { x: [22, 0, -22, 0, 22], y: [0, 22, 0, -22, 0] },
  ],
  pulse: [
    { x: [-28, 0, -28], y: [0, 0, 0] },
    { x: [0, 0, 0], y: [0, 0, 0], scale: [1, 1.5, 1] },
    { x: [28, 0, 28], y: [0, 0, 0] },
  ],
  wave: [
    { x: [-26, -26, -26], y: [-10, 10, -10] },
    { x: [0, 0, 0], y: [10, -10, 10] },
    { x: [26, 26, 26], y: [-10, 10, -10] },
  ],
};
const MODE_NAMES = Object.keys(GOO_MODES);

// Three dots under a blur-and-threshold filter: where they overlap, they melt together.
function GooeyLoader({ reduceMotion }) {
  const [mode, setMode] = useState(0);
  const filterId = "goo-filter";
  const frames = GOO_MODES[MODE_NAMES[mode]];
  return (
    <button
      type="button"
      onClick={() => {
        setMode((m) => (m + 1) % MODE_NAMES.length);
        playPopSound(480 + mode * 80, 0.09);
      }}
      aria-label={`Gooey loader, ${MODE_NAMES[mode]}. Click to change.`}
      className="relative grid h-24 w-40 place-items-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
    >
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <filter id={filterId}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
        </filter>
      </svg>
      <span className="relative h-24 w-40" style={{ filter: `url(#${filterId})` }}>
        {frames.map((frame, i) => (
          <motion.span
            key={`${mode}-${i}`}
            className="absolute left-1/2 top-1/2 -ml-[13px] -mt-[13px] h-[26px] w-[26px] rounded-full"
            style={{ backgroundColor: [VIOLET, "#ff375f", "#ff9f0a"][i] }}
            animate={reduceMotion ? { x: frame.x[0], y: frame.y[0] } : frame}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
          />
        ))}
      </span>
      <span className="absolute bottom-0 font-mono text-[10px] text-[#a1a1a6]">{MODE_NAMES[mode]}</span>
    </button>
  );
}

const LINE = "Good motion feels like it was always there.";

// Words rise out of a blur one after another, then replay on demand.
function WordReveal({ reduceMotion }) {
  const [run, setRun] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.8 });
  return (
    <div ref={ref} className="flex flex-col items-center gap-3">
      <p key={run} className="max-w-[230px] text-center text-[19px] font-semibold leading-tight tracking-[-0.02em] text-[#1d1d1f]">
        {LINE.split(" ").map((word, i) => (
          <motion.span
            key={i}
            className="mr-[0.25em] inline-block"
            initial={reduceMotion ? false : { opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
            transition={{ ...SPRING.enter, delay: i * 0.07 }}
          >
            {word}
          </motion.span>
        ))}
      </p>
      <motion.button
        type="button"
        onClick={() => setRun((r) => r + 1)}
        whileTap={{ scale: 0.9, rotate: -90 }}
        transition={SPRING.press}
        aria-label="Replay"
        className="grid h-8 w-8 place-items-center rounded-full border border-black/[0.08] bg-white text-[#515154] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
      >
        <RotateCcw size={13} />
      </motion.button>
    </div>
  );
}

// Pull past either end and the track stretches like rubber, then snaps back on release.
function ElasticSlider() {
  const track = useRef(null);
  const [value, setValue] = useState(0.5);
  const [dragging, setDragging] = useState(false);
  const held = useRef(false);
  const overflow = useMotionValue(0);
  const lastTick = useRef(5);
  const scaleX = useTransform(overflow, (o) => 1 + Math.abs(o) / 180);
  const scaleY = useTransform(overflow, (o) => 1 - Math.min(Math.abs(o) / 90, 0.35));
  const origin = useTransform(overflow, (o) => (o < 0 ? "100% 50%" : "0% 50%"));
  const lowScale = useTransform(overflow, (o) => (o < 0 ? 1 + Math.abs(o) / 60 : 1));
  const highScale = useTransform(overflow, (o) => (o > 0 ? 1 + o / 60 : 1));

  const update = (clientX) => {
    const r = track.current.getBoundingClientRect();
    const raw = (clientX - r.left) / r.width;
    const v = Math.min(1, Math.max(0, raw));
    setValue(v);
    const over = raw < 0 ? raw * r.width : raw > 1 ? (raw - 1) * r.width : 0;
    // Diminishing returns: the further you pull, the less it gives.
    overflow.set(Math.sign(over) * 28 * (1 - Math.exp(-Math.abs(over) / 60)));
    const tick = Math.round(v * 10);
    if (tick !== lastTick.current) {
      lastTick.current = tick;
      playTickSound(1200 + tick * 80, 0.025);
    }
  };

  const release = () => {
    if (!held.current) return;
    held.current = false;
    setDragging(false);
    animate(overflow, 0, { type: "spring", stiffness: 500, damping: 15 });
  };

  return (
    <div className="flex w-full max-w-[240px] items-center gap-3 text-[#6e6e73]">
      <motion.span style={{ scale: lowScale }}><Volume1 size={16} /></motion.span>
      <motion.div
        ref={track}
        role="slider"
        tabIndex={0}
        aria-label="Elastic slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") setValue((v) => Math.min(1, v + 0.05));
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") setValue((v) => Math.max(0, v - 0.05));
        }}
        onPointerDown={(e) => {
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {}
          held.current = true;
          setDragging(true);
          update(e.clientX);
        }}
        onPointerMove={(e) => held.current && update(e.clientX)}
        onPointerUp={release}
        onPointerCancel={release}
        style={{ scaleX, scaleY, transformOrigin: origin }}
        className="relative h-3 flex-1 cursor-pointer touch-none rounded-full bg-[#e5e5ea] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] focus-visible:ring-offset-2"
      >
        <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${value * 100}%`, backgroundColor: VIOLET }} />
        <motion.span
          className="absolute -top-8 rounded-md bg-[#111111] px-1.5 py-0.5 font-mono text-[10.5px] text-white"
          style={{ left: `${value * 100}%`, x: "-50%" }}
          animate={{ opacity: dragging ? 1 : 0, y: dragging ? 0 : 6 }}
          transition={SPRING.press}
        >
          {Math.round(value * 100)}
        </motion.span>
      </motion.div>
      <motion.span style={{ scale: highScale }}><Volume2 size={16} /></motion.span>
    </div>
  );
}

export default function TypeLab({ reduceMotion }) {
  return (
    <div className="grid w-full grid-cols-1 gap-3 p-3 sm:grid-cols-3 sm:gap-4 sm:p-6">
      <Cell label="Scramble text"><ScrambleText reduceMotion={reduceMotion} /></Cell>
      <Cell label="Odometer"><Odometer /></Cell>
      <Cell label="Cursor spotlight"><SpotlightGrid /></Cell>
      <Cell label="Gooey loader"><GooeyLoader reduceMotion={reduceMotion} /></Cell>
      <Cell label="Word reveal"><WordReveal reduceMotion={reduceMotion} /></Cell>
      <Cell label="Elastic slider"><ElasticSlider /></Cell>
    </div>
  );
}
