"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Layers, MapPin, Music2, Sparkles, X } from "lucide-react";
import { playPopSound, playTickSound, playWhooshSound } from "./SoundEffects";
import { scaleSpring, useLabTuner } from "@/lib/labTuning";
import { SPRING } from "@/lib/motion";

const FRAME_H = 440;
const SNAP_ORDER = ["full", "half", "peek", "closed"];
const SNAP_Y = {
  full: 26,
  half: 186,
  peek: 332,
  closed: FRAME_H + 16,
};

const SNAP_LABELS = {
  full: "Full",
  half: "Half",
  peek: "Peek",
  closed: "Dismiss",
};

const ITEMS = [
  { title: "Typography scale", sub: "15.5px · 1.85 leading · Tight / Relaxed", icon: Layers, accent: "#5b4cf0" },
  { title: "Haptic detents", sub: "Peek, Half, Full & velocity flick", icon: Sparkles, accent: "#0879a0" },
  { title: "Now playing", sub: "Ambient Engine · 60 fps spring", icon: Music2, accent: "#0d8a38" },
  { title: "Studio location", sub: "Hyderabad · Design & Engineering", icon: MapPin, accent: "#e11d48" },
];

export default function DrawerLab({ reduceMotion = false }) {
  const tuner = useLabTuner("bottom-sheet", {
    stiffness: 380,
    damping: 34,
    flickProjection: 0.18,
    rubberBand: 36,
  });

  const [snap, setSnap] = useState("half");
  const y = useMotionValue(SNAP_Y.half);
  const animRef = useRef(null);
  const dragRef = useRef(null);

  // Continuous background depth: the underlying app scales down and dims as the sheet rises.
  const bgScale = useTransform(y, [SNAP_Y.full, SNAP_Y.peek, SNAP_Y.closed], [0.92, 0.97, 1]);
  const bgRadius = useTransform(y, [SNAP_Y.full, SNAP_Y.closed], [24, 18]);
  const scrimOpacity = useTransform(y, [SNAP_Y.full, SNAP_Y.peek, SNAP_Y.closed], [0.46, 0.14, 0]);

  useEffect(() => () => animRef.current?.stop(), []);

  const snapTo = useCallback(
    (nextSnap, velocity = 0) => {
      animRef.current?.stop();
      setSnap(nextSnap);
      if (nextSnap === "closed") {
        playWhooshSound({ pitch: 0.9, volume: 0.08, duration: 0.25 });
      } else {
        playTickSound(nextSnap === "full" ? 1900 : nextSnap === "half" ? 1550 : 1250, 0.045);
      }
      if (reduceMotion) {
        y.set(SNAP_Y[nextSnap]);
        return;
      }
      animRef.current = animate(
        y,
        SNAP_Y[nextSnap],
        scaleSpring(
          {
            type: "spring",
            stiffness: tuner.stiffness,
            damping: tuner.damping,
            velocity,
          },
          tuner.timeScale,
        ),
      );
    },
    [reduceMotion, y, tuner.stiffness, tuner.damping, tuner.timeScale],
  );

  const onPointerDown = (e) => {
    animRef.current?.stop();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    dragRef.current = {
      id: e.pointerId,
      startY: e.clientY,
      originY: y.get(),
      lastY: e.clientY,
      lastT: e.timeStamp,
      vy: 0,
    };
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) {
      d.vy = ((e.clientY - d.lastY) / dt) * 1000;
    }
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;

    const raw = d.originY + (e.clientY - d.startY);
    if (raw < SNAP_Y.full) {
      const over = SNAP_Y.full - raw;
      y.set(SNAP_Y.full - tuner.rubberBand * (1 - Math.exp(-over / 72)));
    } else {
      y.set(Math.min(SNAP_Y.closed + 20, raw));
    }
  };

  const onPointerUp = (e) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId) return;
    dragRef.current = null;

    const currentY = y.get();
    const projectedY = currentY + d.vy * tuner.flickProjection;
    const dismissLine = (SNAP_Y.peek + SNAP_Y.closed) / 2;

    if ((d.vy > 650 && currentY > SNAP_Y.half - 20) || projectedY > dismissLine) {
      snapTo("closed", d.vy);
      return;
    }

    const activeSnaps = ["full", "half", "peek"];
    let closest = "half";
    let bestDist = Infinity;
    for (const key of activeSnaps) {
      const dist = Math.abs(projectedY - SNAP_Y[key]);
      if (dist < bestDist) {
        bestDist = dist;
        closest = key;
      }
    }
    snapTo(closest, d.vy);
  };

  const handleSliderKey = (e) => {
    const idx = SNAP_ORDER.indexOf(snap);
    if (e.key === "ArrowUp") {
      e.preventDefault();
      snapTo(SNAP_ORDER[Math.max(0, idx - 1)]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      snapTo(SNAP_ORDER[Math.min(SNAP_ORDER.length - 1, idx + 1)]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      snapTo("closed");
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4 sm:p-8">
      {/* Detent controls outside the device frame */}
      <div className="flex flex-wrap items-center justify-center gap-1.5" role="group" aria-label="Sheet snap points">
        {SNAP_ORDER.map((key) => {
          const active = snap === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                if (key === snap && key === "closed") return;
                if (key === "closed") {
                  snapTo("closed");
                } else {
                  playPopSound(640, 0.06);
                  snapTo(key);
                }
              }}
              aria-pressed={active}
              className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] ${
                active
                  ? "bg-ink text-white"
                  : "border border-black/[0.08] bg-white text-ink-secondary hover:text-ink"
              }`}
            >
              {SNAP_LABELS[key]}
            </button>
          );
        })}
      </div>

      {/* Device viewport frame */}
      <div
        className="relative w-full max-w-[420px] overflow-hidden rounded-[26px] border border-black/[0.1] bg-[#141416] shadow-[0_18px_48px_-16px_rgba(0,0,0,0.28)]"
        style={{ height: FRAME_H }}
      >
        {/* Background app screen */}
        <motion.div
          style={{ scale: reduceMotion ? 1 : bgScale, borderRadius: bgRadius }}
          className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#f7f7fa] p-5 origin-top"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">Workspace</p>
              <h3 className="mt-0.5 text-[18px] font-semibold tracking-[-0.02em] text-ink">Design Tokens</h3>
            </div>
            <span className="rounded-full border border-black/[0.06] bg-white px-2.5 py-1 font-mono text-[10.5px] text-ink-secondary">
              {snap === "closed" ? "Closed" : `Snap: ${SNAP_LABELS[snap]}`}
            </span>
          </div>

          <div className="my-auto flex flex-col items-center gap-3 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#5b4cf0]/10 text-[#5b4cf0]">
              <Layers size={22} />
            </div>
            <p className="max-w-[230px] text-[13px] leading-relaxed text-ink-secondary">
              {snap === "closed"
                ? "Sheet dismissed. Bring it back from its detent or tap below."
                : "Notice the background scale down and round its corners as the sheet rises."}
            </p>
            {snap === "closed" && (
              <motion.button
                type="button"
                onClick={() => snapTo("half")}
                whileTap={{ scale: 0.94 }}
                transition={SPRING.press}
                className="rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-white shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
              >
                Open sheet
              </motion.button>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-ink-muted">
            <span>Rubber-band ceiling</span>
            <span>Velocity projection</span>
          </div>
        </motion.div>

        {/* Dimming scrim */}
        <motion.div
          style={{ opacity: scrimOpacity }}
          onClick={() => snap !== "closed" && snapTo("closed")}
          className={`absolute inset-0 bg-black ${snap === "closed" ? "pointer-events-none" : "cursor-pointer"}`}
        />

        {/* Bottom sheet */}
        <motion.section
          aria-label="Bottom sheet"
          aria-hidden={snap === "closed"}
          style={{ y, height: FRAME_H + 60 }}
          className="absolute inset-x-0 top-0 flex flex-col rounded-t-[24px] border-t border-black/[0.08] bg-white shadow-[0_-16px_40px_rgba(0,0,0,0.18)]"
        >
          {/* Drag header */}
          <div
            role="slider"
            tabIndex={snap === "closed" ? -1 : 0}
            aria-label="Sheet height"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={3 - SNAP_ORDER.indexOf(snap)}
            aria-valuetext={SNAP_LABELS[snap]}
            onKeyDown={handleSliderKey}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="flex cursor-grab touch-none flex-col items-center gap-3 border-b border-black/[0.05] px-5 pb-3.5 pt-2.5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0879a0] active:cursor-grabbing"
          >
            <span className="h-1.5 w-10 rounded-full bg-black/[0.14]" />
            <div className="flex w-full items-center justify-between">
              <div>
                <p className="text-[14px] font-semibold tracking-[-0.01em] text-ink">Inspector Drawer</p>
                <p className="text-[11.5px] text-ink-muted">Drag handle or use ↑ ↓ keys</p>
              </div>
              <button
                type="button"
                tabIndex={snap === "closed" ? -1 : 0}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => snapTo("closed")}
                aria-label="Dismiss sheet"
                className="grid h-7 w-7 place-items-center rounded-full bg-black/[0.05] text-ink-secondary transition-colors hover:bg-black/[0.1] hover:text-ink"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Sheet body */}
          <div className="flex flex-1 flex-col gap-2.5 overflow-hidden p-4">
            {ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl border border-black/[0.05] bg-[#fafafa] px-3.5 py-2.5"
                >
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-xl"
                    style={{ backgroundColor: `${item.accent}15`, color: item.accent }}
                  >
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-ink">{item.title}</p>
                    <p className="truncate text-[11px] text-ink-muted">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
