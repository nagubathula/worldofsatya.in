"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useTransform, useVelocity, useSpring } from "framer-motion";
import { playTingSound, playWhooshSound } from "./SoundEffects";

// A conference badge on a lanyard, hung from the top edge of the page. Drag it
// and it swings back on its strap; tap it to turn it over. The strap is drawn
// from the hook to the clip every frame, so it always follows the card.

// The violet of the portrait's backdrop, so the photo sits in the card.
const VIOLET = "#5b4cf0";
// Underdamped: let go and the badge swings a few times before it settles.
const SWING = { type: "spring", stiffness: 140, damping: 7, mass: 1 };
const TAP_SLOP = 6;

export default function LanyardBadge({ strap = 150, width = 220, reduceMotion = false }) {
  const height = Math.round(width * 1.36);
  // Where the clip hangs, relative to its resting point under the hook.
  const x = useMotionValue(0);
  const y = useMotionValue(reduceMotion ? 0 : -strap - height - 80);
  const [flipped, setFlipped] = useState(false);
  const gesture = useRef(null);

  // The card hangs along the strap, and leans a little further into fast swings.
  const strapAngle = useTransform([x, y], ([dx, dy]) => (-Math.atan2(dx, strap + dy) * 180) / Math.PI);
  const lean = useSpring(useTransform(useVelocity(x), [-1500, 0, 1500], [10, 0, -10]), { stiffness: 200, damping: 18 });
  const rotate = useTransform([strapAngle, lean], ([a, l]) => a + l);

  // A ribbon from the hook (0,0) to the clip, sagging a touch when it goes slack.
  const ribbon = useTransform([x, y], ([dx, dy]) => {
    const ex = dx;
    const ey = strap + dy;
    const length = Math.hypot(ex, ey);
    const slack = Math.max(0, strap - length) * 0.6;
    return `M 0 -400 L 0 0 Q ${ex / 2 + slack} ${ey / 2} ${ex} ${ey}`;
  });

  // Dropped in from above the page on arrival.
  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(y, 0, { ...SWING, damping: 9, delay: 0.5 });
    return () => controls.stop();
  }, [reduceMotion, y]);

  const onPointerDown = (event) => {
    event.stopPropagation();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {}
    gesture.current = { id: event.pointerId, sx: event.clientX, sy: event.clientY, ox: x.get(), oy: y.get(), moved: false };
  };

  const onPointerMove = (event) => {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    const dx = event.clientX - g.sx;
    const dy = event.clientY - g.sy;
    if (!g.moved && Math.hypot(dx, dy) > TAP_SLOP) g.moved = true;
    if (!g.moved) return;
    x.stop();
    y.stop();
    // The strap stretches a little, then pulls harder the further it goes.
    x.set(g.ox + dx);
    y.set(Math.max(-strap * 0.7, g.oy + (dy > 0 ? dy * 0.45 : dy)));
  };

  const onPointerUp = (event) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g || g.id !== event.pointerId) return;
    if (!g.moved) {
      setFlipped((value) => !value);
      playWhooshSound({ pitch: 1.4, volume: 0.1, duration: 0.3 });
      return;
    }
    const pulled = Math.hypot(x.get(), y.get());
    if (pulled > 40) playWhooshSound({ pitch: 0.9, volume: Math.min(0.16, 0.05 + pulled / 2000) });
    animate(x, 0, SWING);
    animate(y, 0, { ...SWING, damping: 12 });
  };

  const onKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setFlipped((value) => !value);
  };

  return (
    <div className="pointer-events-none relative h-0 w-0" data-prevent-flip="true">
      {/* Solid strokes: a gradient on a straight vertical path has no width to spread over. */}
      <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1" aria-hidden="true">
        <motion.path d={ribbon} fill="none" stroke="#1c1c1e" strokeWidth={width * 0.075} />
        <motion.path d={ribbon} fill="none" stroke="#48484a" strokeWidth={width * 0.022} opacity={0.7} />
      </svg>

      <motion.div
        className="absolute left-0 top-0"
        // Hung `strap` below the hook; it pivots on the clip, where the strap pulls.
        style={{ top: strap, x, y, rotate, transformOrigin: "0px 0px" }}
      >
        {/* Clip and ring */}
        <div
          className="absolute -translate-x-1/2 rounded-[5px] border border-white/20 bg-gradient-to-b from-[#8e8e93] via-[#48484a] to-[#2c2c2e] shadow-md"
          style={{ width: width * 0.13, height: width * 0.08, top: -width * 0.05 }}
        />
        <div
          className="absolute -translate-x-1/2 rounded-full border-[2.5px] border-[#aeaeb2]"
          style={{ width: width * 0.075, height: width * 0.1, top: width * 0.02 }}
        />

        <div
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label={`ID badge for Satya Sai Nagubathula, ${flipped ? "back" : "front"}. Press to turn it over.`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute -translate-x-1/2 cursor-grab touch-none select-none rounded-[18px] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] focus-visible:ring-offset-4 active:cursor-grabbing"
          style={{ width, height, top: width * 0.09, perspective: 900 }}
        >
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 22 }}
            onAnimationComplete={() => flipped && playTingSound(1975, 0.04)}
          >
            <BadgeFront width={width} />
            <BadgeBack width={width} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Sizes scale with the card, so the phone badge is the desktop one shrunk.
const u = (width, n) => (width * n) / 220;

function Face({ width, back = false, children }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[18px] text-white shadow-[0_24px_50px_-18px_rgba(40,30,120,0.55),0_4px_10px_rgba(0,0,0,0.08)]"
      style={{
        background: `radial-gradient(120% 80% at 20% 10%, #7a6dff 0%, ${VIOLET} 45%, #4636d6 100%)`,
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
        padding: u(width, 16),
      }}
    >
      {/* The punched slot the clip goes through. */}
      <span
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#fbfbfd] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)]"
        style={{ top: u(width, 9), width: u(width, 34), height: u(width, 8) }}
      />
      {/* A soft sheen, like light on laminate. */}
      <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.14)_45%,transparent_60%)]" />
      {children}
    </div>
  );
}

function BadgeFront({ width }) {
  return (
    <Face width={width}>
      <div className="relative flex h-full flex-col" style={{ paddingTop: u(width, 14) }}>
        <div className="flex items-center justify-between font-mono uppercase tracking-[0.14em] text-white/70" style={{ fontSize: u(width, 8.5) }}>
          <span>worldofsatya.in</span>
          <span>Pass</span>
        </div>
        <div
          className="relative mx-auto overflow-hidden rounded-2xl ring-2 ring-white/25"
          style={{ marginTop: u(width, 12), width: u(width, 120), height: u(width, 120) }}
        >
          <Image src="/main.jpeg" alt="" fill sizes="240px" className="object-cover" draggable={false} />
        </div>
        <div className="mt-auto">
          <p className="font-semibold leading-[1.05] tracking-[-0.03em]" style={{ fontSize: u(width, 21) }}>
            Satya Sai
            <br />
            Nagubathula
          </p>
          <p className="text-white/75" style={{ marginTop: u(width, 5), fontSize: u(width, 11) }}>
            AI + Design Engineer
          </p>
        </div>
      </div>
    </Face>
  );
}

const STATS = [
  ["4", "years"],
  ["280+", "clients"],
  ["10k+", "community"],
];

function BadgeBack({ width }) {
  return (
    <Face width={width} back>
      <div className="relative flex h-full flex-col" style={{ paddingTop: u(width, 18) }}>
        <p className="font-mono uppercase tracking-[0.2em] text-white/70" style={{ fontSize: u(width, 8.5) }}>
          Access level
        </p>
        <p className="font-semibold leading-none tracking-[-0.05em]" style={{ marginTop: u(width, 6), fontSize: u(width, 44) }}>
          All
          <br />
          access
        </p>
        <dl className="grid grid-cols-3 border-t border-white/20" style={{ marginTop: u(width, 18), paddingTop: u(width, 10), gap: u(width, 6) }}>
          {STATS.map(([value, label]) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className="font-semibold tracking-[-0.03em]" style={{ fontSize: u(width, 16) }}>{value}</dd>
              <dd className="text-white/65" style={{ fontSize: u(width, 9) }}>{label}</dd>
            </div>
          ))}
        </dl>
        <div
          className="mt-auto flex items-center justify-center rounded-xl bg-white font-semibold tracking-[-0.02em] text-[#1d1d1f]"
          style={{ height: u(width, 40), fontSize: u(width, 13) }}
        >
          Design · Engineering · AI
        </div>
      </div>
    </Face>
  );
}
