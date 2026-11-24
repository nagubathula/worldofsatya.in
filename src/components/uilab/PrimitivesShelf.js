"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Box, Check, Copy } from "lucide-react";
import { playPopSound, playTickSound, playTingSound } from "@/components/SoundEffects";
import { useMagnetic } from "@/lib/useMagnetic";
import { SPRING } from "@/lib/motion";
import { UI_LAB_PRIMITIVES } from "@/data/uiLabPrimitives";

function MagneticPreview() {
  const magnet = useMagnetic({ max: 14, strength: 0.32 });
  return (
    <motion.button
      type="button"
      style={{ x: magnet.x, y: magnet.y }}
      onPointerMove={magnet.move}
      onPointerLeave={magnet.reset}
      whileTap={{ scale: 0.94 }}
      className="rounded-full bg-ink px-4 py-2 font-labMono text-[11.5px] font-medium text-white shadow-sm"
    >
      Hover to pull
    </motion.button>
  );
}

function SpringPreview() {
  const [preset, setPreset] = useState("pop");
  const [on, setOn] = useState(false);

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex flex-wrap gap-1">
        {Object.keys(SPRING).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setPreset(key);
              setOn((v) => !v);
              playTickSound(1600, 0.035);
            }}
            className={`rounded-full px-2.5 py-1 font-labMono text-[10px] ${
              preset === key ? "bg-ink text-white" : "border border-black/[0.08] bg-white text-ink-secondary"
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      <motion.div
        animate={{ x: on ? 20 : -6, scale: on ? 1.15 : 1 }}
        transition={SPRING[preset]}
        className="mr-4 h-6 w-6 shrink-0 rounded-lg bg-[#0879a0]"
      />
    </div>
  );
}

function AudioPreview() {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => playTickSound(1800, 0.06)}
        className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 font-labMono text-[11px] text-ink hover:bg-[#efeff4]"
      >
        Tick
      </button>
      <button
        type="button"
        onClick={() => playPopSound(620, 0.12)}
        className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 font-labMono text-[11px] text-ink hover:bg-[#efeff4]"
      >
        Pop
      </button>
      <button
        type="button"
        onClick={() => playTingSound(1568, 0.07)}
        className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 font-labMono text-[11px] text-ink hover:bg-[#efeff4]"
      >
        Chime
      </button>
    </div>
  );
}

function RubberBandPreview() {
  const [dist, setDist] = useState(40);
  const val = 36 * (1 - Math.exp(-dist / 72));
  return (
    <div className="flex w-full items-center gap-3">
      <input
        type="range"
        min="0"
        max="180"
        value={dist}
        aria-label="Rubber band test input"
        onChange={(e) => setDist(Number(e.target.value))}
        className="flex-1 accent-[#0d8a38]"
      />
      <span className="font-labMono text-[11px] font-medium tabular-nums text-[#0d8a38]">{val.toFixed(1)} px</span>
    </div>
  );
}

function VelocitySnapPreview() {
  const [vel, setVel] = useState(400);
  const detents = [0, 120, 240];
  const projected = 90 + vel * 0.18;
  const best = detents.reduce((a, b) => (Math.abs(projected - b) < Math.abs(projected - a) ? b : a));

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <input
        type="range"
        min="-800"
        max="800"
        step="50"
        value={vel}
        aria-label="Release velocity"
        onChange={(e) => setVel(Number(e.target.value))}
        className="flex-1 accent-[#5b4cf0]"
      />
      <span className="font-labMono text-[10.5px] font-medium tabular-nums text-[#5b4cf0]">
        v={vel} → {best}px
      </span>
    </div>
  );
}

function RadialRevealPreview() {
  const [radius, setRadius] = useState(142);
  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        setRadius(Math.round(Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y))));
        playTickSound(1650, 0.035);
      }}
      className="w-full rounded-xl border border-black/[0.08] bg-white px-3 py-2 font-labMono text-[11px] text-ink-secondary hover:border-[#0879a0]/45"
    >
      Click anywhere here · maxR = <span className="font-semibold text-[#0879a0]">{radius} px</span>
    </button>
  );
}

const PREVIEWS = {
  "use-magnetic": MagneticPreview,
  "spring-presets": SpringPreview,
  "synth-audio": AudioPreview,
  "rubber-band": RubberBandPreview,
  "velocity-snap": VelocitySnapPreview,
  "scoped-radial-reveal": RadialRevealPreview,
};

export default function PrimitivesShelf() {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.code);
    } catch {}
    setCopiedId(item.id);
    playTingSound(2093, 0.04);
    window.setTimeout(() => setCopiedId((cur) => (cur === item.id ? null : cur)), 1600);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-8 sm:pt-14">
      <div className="mb-10 border-b border-black/[0.08] pb-8">
        <Link
          href="/ui"
          className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1 font-labMono text-[11px] text-ink-secondary shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-[#f5f5f7] hover:text-ink"
        >
          <ArrowLeft size={12} />
          Back to Specimens
        </Link>

        <div className="mt-6 flex items-center gap-2 font-labMono text-[11px] font-medium uppercase tracking-[0.16em] text-[#0d8a38]">
          <Box size={13} />
          Zero-Bloat Building Blocks
        </div>
        <h1 className="mt-2 text-5xl font-semibold tracking-[-0.045em] text-ink sm:text-7xl">
          Primitives Shelf<span className="text-sage">.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-secondary">
          Production-hardened hooks, gesture math helpers, and tactile audio synthesizers powering UI Labs — ready to drop straight into your codebase.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {UI_LAB_PRIMITIVES.map((item) => {
          const Preview = PREVIEWS[item.id];
          const copied = copiedId === item.id;
          return (
            <section
              key={item.id}
              id={item.id}
              className="scroll-mt-24 flex flex-col justify-between rounded-[24px] border border-black/[0.07] bg-white/85 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm sm:p-6"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-black/[0.06] bg-[#f5f5f7] px-2.5 py-0.5 font-labMono text-[10px] font-medium uppercase tracking-[0.12em] text-[#0879a0]">
                      {item.category}
                    </span>
                    <span className="font-labMono text-[10.5px] text-ink-muted">
                      {item.deps} · {item.sizeLabel}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1 font-labMono text-[10.5px] font-medium text-ink transition-colors hover:bg-[#f5f5f7]"
                  >
                    {copied ? <Check size={11.5} className="text-[#0d8a38]" /> : <Copy size={11.5} />}
                    {copied ? "Copied Source" : "Copy Source"}
                  </button>
                </div>

                <h2 className="mt-3 font-labMono text-lg font-semibold text-ink">{item.name}</h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-secondary">{item.description}</p>

                {/* Live Mini Preview */}
                {Preview && (
                  <div className="mt-4 flex min-h-[60px] items-center justify-center rounded-xl border border-black/[0.06] bg-[#f7f7fa] px-4 py-3">
                    <Preview />
                  </div>
                )}

                {/* Source Block */}
                <pre className="mt-4 overflow-x-auto rounded-xl border border-black/[0.06] bg-[#f7f7fa] p-3.5 font-labMono text-[11px] leading-relaxed text-ink">
                  <code>{item.code}</code>
                </pre>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
