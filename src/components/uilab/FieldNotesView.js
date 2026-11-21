"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRightLeft, BookOpen, Volume2 } from "lucide-react";
import { playPopSound, playTickSound, playTingSound, playWhooshSound } from "@/components/SoundEffects";
import { UI_LAB_NOTES } from "@/data/uiLabNotes";

function InterruptibleDemo() {
  const [targetRight, setTargetRight] = useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-black/[0.06] bg-[#f7f7fa] p-4">
      <div className="flex items-center justify-between">
        <span className="font-labMono text-[10.5px] uppercase tracking-[0.12em] text-ink-muted">
          Tap mid-flight to reverse
        </span>
        <button
          type="button"
          onClick={() => {
            setTargetRight((v) => !v);
            playTickSound(1700, 0.04);
          }}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 font-labMono text-[10.5px] font-medium text-white"
        >
          <ArrowRightLeft size={11} />
          Flip Target
        </button>
      </div>

      {/* Spring lane */}
      <div>
        <div className="mb-1 flex justify-between font-labMono text-[10px] font-medium text-[#0879a0]">
          <span>SPRING (k=120, c=14)</span>
          <span>Preserves velocity</span>
        </div>
        <div className="relative h-8 rounded-full border border-black/[0.06] bg-white p-1">
          <motion.div
            animate={{ left: targetRight ? "calc(100% - 28px)" : "4px" }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="absolute top-1 h-6 w-6 rounded-full bg-[#0879a0] shadow-sm"
          />
        </div>
      </div>

      {/* Duration curve lane */}
      <div>
        <div className="mb-1 flex justify-between font-labMono text-[10px] font-medium text-[#d97706]">
          <span>CUBIC-BEZIER (950 ms)</span>
          <span>Resets easing curve</span>
        </div>
        <div className="relative h-8 rounded-full border border-black/[0.06] bg-white p-1">
          <motion.div
            animate={{ left: targetRight ? "calc(100% - 28px)" : "4px" }}
            transition={{ duration: 0.95, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-1 h-6 w-6 rounded-full bg-[#d97706]"
          />
        </div>
      </div>
    </div>
  );
}

function RubberBandPlotDemo() {
  const [overPx, setOverPx] = useState(64);
  const M = 48;
  const R = 72;
  const result = M * (1 - Math.exp(-overPx / R));

  const W = 280;
  const H = 96;
  const points = Array.from({ length: 30 }, (_, i) => {
    const x = (i / 29) * 240;
    const y = M * (1 - Math.exp(-x / R));
    const sx = 12 + (x / 240) * (W - 24);
    const sy = H - 14 - (y / M) * (H - 28);
    return `${i === 0 ? "M" : "L"}${sx.toFixed(1)},${sy.toFixed(1)}`;
  }).join(" ");

  const dotX = 12 + (overPx / 240) * (W - 24);
  const dotY = H - 14 - (result / M) * (H - 28);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-black/[0.06] bg-[#f7f7fa] p-4">
      <div className="flex items-center justify-between font-labMono text-[10.5px]">
        <span className="text-ink-muted">Over-drag: {overPx} px</span>
        <span className="font-medium text-[#0d8a38]">Stretch: {result.toFixed(1)} px / {M} px cap</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full">
        <line x1="12" y1={14} x2={W - 12} y2={14} stroke="rgba(217,119,6,0.45)" strokeDasharray="3 3" />
        <path d={points} fill="none" stroke="#0d8a38" strokeWidth="2" />
        <circle cx={dotX} cy={dotY} r="4.5" fill="#0879a0" stroke="#ffffff" strokeWidth="1.5" />
      </svg>

      <input
        type="range"
        min="0"
        max="240"
        step="2"
        value={overPx}
        aria-label="Over-drag distance in pixels"
        onChange={(e) => setOverPx(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer accent-[#0d8a38]"
      />
    </div>
  );
}

function AudioSynthDemo() {
  const [lastSound, setLastSound] = useState("Tap any envelope");

  const pads = [
    { label: "Tick", desc: "1800→900 Hz · 30 ms", fn: () => playTickSound(1800, 0.06) },
    { label: "Pop", desc: "560→756→420 Hz · 65 ms", fn: () => playPopSound(560, 0.14) },
    { label: "Chime", desc: "1 + 2.76 + 5.4 partials", fn: () => playTingSound(1568, 0.08) },
    { label: "Whoosh", desc: "Bandpass noise sweep", fn: () => playWhooshSound({ pitch: 1.05, volume: 0.14 }) },
  ];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-black/[0.06] bg-[#f7f7fa] p-4">
      <div className="flex items-center justify-between font-labMono text-[10.5px]">
        <span className="inline-flex items-center gap-1.5 text-ink-muted">
          <Volume2 size={12} className="text-[#0879a0]" />
          Procedural Web Audio
        </span>
        <span className="font-medium text-[#0879a0]">{lastSound}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {pads.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              p.fn();
              setLastSound(`${p.label} (${p.desc})`);
            }}
            className="rounded-xl border border-black/[0.07] bg-white px-3 py-2.5 text-left transition-colors hover:border-[#0879a0]/45"
          >
            <p className="font-labMono text-[11.5px] font-semibold text-ink">{p.label}</p>
            <p className="mt-0.5 font-labMono text-[9.5px] text-ink-muted">{p.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ZeroRenderTrackerDemo() {
  const padRef = useRef(null);
  const rawX = useMotionValue(120);
  const rawY = useMotionValue(44);
  const x = useSpring(rawX, { stiffness: 320, damping: 24 });
  const y = useSpring(rawY, { stiffness: 320, damping: 24 });
  const [renders, setRenders] = useState(1);

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-black/[0.06] bg-[#f7f7fa] p-4">
      <div className="flex items-center justify-between font-labMono text-[10.5px]">
        <span className="text-ink-muted">MotionValue Trackpad</span>
        <div className="flex items-center gap-2">
          <span className="font-medium text-[#0d8a38]">React renders: {renders}</span>
          <button
            type="button"
            onClick={() => setRenders((r) => r + 1)}
            className="rounded-full border border-black/[0.08] bg-white px-2 py-0.5 text-[9.5px] text-ink-secondary hover:text-ink"
          >
            Force render
          </button>
        </div>
      </div>
      <div
        ref={padRef}
        onPointerMove={(e) => {
          const r = padRef.current?.getBoundingClientRect();
          if (!r) return;
          rawX.set(e.clientX - r.left - 12);
          rawY.set(e.clientY - r.top - 12);
        }}
        className="relative h-28 w-full overflow-hidden rounded-xl border border-black/[0.06] bg-white"
      >
        <motion.span
          style={{ x, y }}
          className="pointer-events-none absolute left-0 top-0 h-6 w-6 rounded-full bg-[#0879a0] shadow-[0_0_16px_rgba(46,196,240,0.55)]"
        />
        <span className="pointer-events-none absolute bottom-2 left-3 font-labMono text-[10px] text-ink-muted">
          Glide pointer inside — 0 JSX diffs
        </span>
      </div>
    </div>
  );
}

const NOTE_WIDGETS = {
  "interruptible-springs": InterruptibleDemo,
  "rubber-banding": RubberBandPlotDemo,
  "zero-asset-audio": AudioSynthDemo,
  "60fps-discipline": ZeroRenderTrackerDemo,
};

export default function FieldNotesView() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-10 sm:px-8 sm:pt-14">
      <div className="mb-10 border-b border-black/[0.08] pb-8">
        <Link
          href="/ui"
          className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1 font-labMono text-[11px] text-ink-secondary shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-[#f5f5f7] hover:text-ink"
        >
          <ArrowLeft size={12} />
          Back to Specimens
        </Link>

        <div className="mt-6 flex items-center gap-2 font-labMono text-[11px] font-medium uppercase tracking-[0.16em] text-[#0879a0]">
          <BookOpen size={13} />
          Engineering Field Notes
        </div>
        <h1 className="mt-2 text-5xl font-semibold tracking-[-0.045em] text-ink sm:text-7xl">
          Craft Notes<span className="text-sage">.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-secondary">
          Interactive memos on the physics, audio synthesis, and performance budgets behind every UI Labs specimen.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {UI_LAB_NOTES.map((note) => {
          const Widget = NOTE_WIDGETS[note.id];
          return (
            <article
              key={note.id}
              id={note.id}
              className="scroll-mt-24 rounded-[28px] border border-black/[0.07] bg-white/85 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm sm:p-8"
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2 font-labMono text-[10.5px]">
                    <span className="font-semibold text-[#0879a0]">NOTE {note.num}</span>
                    <span className="text-black/15">·</span>
                    <span className="text-ink-muted">{note.readTime}</span>
                    <span className="rounded-full border border-black/[0.06] bg-[#f5f5f7] px-2.5 py-0.5 text-[#5b4cf0]">
                      {note.formula}
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-ink">
                    {note.title}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-secondary">{note.subtitle}</p>

                  <ul className="mt-4 flex flex-col gap-2.5 border-t border-black/[0.06] pt-4">
                    {note.takeaways.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-secondary">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0879a0]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>{Widget && <Widget />}</div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
