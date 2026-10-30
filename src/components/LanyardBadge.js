"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useTransform, useVelocity, useSpring } from "framer-motion";
import { playTingSound, playWhooshSound } from "./SoundEffects";

// A conference badge on a lanyard, hung from the top edge of the page. Drag it
// and it swings back on its strap; flick it sideways and it spins, twisting the
// strap, which winds up to a limit and then unwinds; tap it to turn it over.
// The strap is drawn from the hook to the clip every frame, so it always
// follows the card.

// The violet of the portrait's backdrop, so the photo sits in the card.
const VIOLET = "#5b4cf0";
// Underdamped: let go and the badge swings a few times before it settles.
const SWING = { type: "spring", stiffness: 140, damping: 7, mass: 1 };
const TAP_SLOP = 6;
// The strap as a torsion spring, in degrees: soft, so a spin unwinds in a few
// overshooting turns. It can only wind so far before it stops the card dead.
const TORSION = { stiffness: 14, damping: 1.4 };
const MAX_TWIST = 720;
const MAX_SPIN = 2200;
// How far above the hook the strap runs, off the top of the stage.
const RISE = 400;

export default function LanyardBadge({ strap = 150, width = 220, reduceMotion = false }) {
  const height = Math.round(width * 1.36);
  // Where the clip hangs, relative to its resting point under the hook.
  const x = useMotionValue(0);
  const y = useMotionValue(reduceMotion ? 0 : -strap - height - 80);
  // Turn about the strap, in degrees; 0 shows the front.
  const yaw = useMotionValue(0);
  const [flipped, setFlipped] = useState(false);
  const gesture = useRef(null);
  const spin = useRef({ v: 0, target: 0, raf: 0, dragging: false, ting: false });
  const strapRefs = useRef([]);
  const stripeRefs = useRef([]);

  // The card hangs along the strap, and leans a little further into fast swings.
  const strapAngle = useTransform([x, y], ([dx, dy]) => (-Math.atan2(dx, strap + dy) * 180) / Math.PI);
  const lean = useSpring(useTransform(useVelocity(x), [-1500, 0, 1500], [10, 0, -10]), { stiffness: 200, damping: 18 });
  const rotate = useTransform([strapAngle, lean], ([a, l]) => a + l);

  // Redraw the strap as flat segments, each turned a share of the card's yaw:
  // the hook end holds still and the twist grows down to the clip.
  useEffect(() => {
    const draw = () => {
      const points = strapPoints(x.get(), strap + y.get(), strap);
      const along = [0];
      for (let i = 1; i < points.length; i++) {
        along.push(along[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
      }
      const total = along[along.length - 1] || 1;
      const twist = (yaw.get() * Math.PI) / 180;
      const edges = points.map((p, i) => {
        const a = points[Math.max(0, i - 1)];
        const b = points[Math.min(points.length - 1, i + 1)];
        const tx = b[0] - a[0];
        const ty = b[1] - a[1];
        const l = Math.hypot(tx, ty) || 1;
        // Signed, so the edges cross where the strap turns edge-on.
        const c = Math.cos((twist * along[i]) / total);
        return { p, nx: -ty / l, ny: tx / l, c: Math.sign(c || 1) * Math.max(Math.abs(c), 0.08) };
      });
      const quad = (i, half) => {
        const a = edges[i];
        const b = edges[i + 1];
        const ha = half * a.c;
        const hb = half * b.c;
        return `M ${a.p[0] + a.nx * ha} ${a.p[1] + a.ny * ha} L ${b.p[0] + b.nx * hb} ${b.p[1] + b.ny * hb} L ${b.p[0] - b.nx * hb} ${b.p[1] - b.ny * hb} L ${a.p[0] - a.nx * ha} ${a.p[1] - a.ny * ha} Z`;
      };
      for (let i = 0; i < SEGMENTS; i++) {
        const strapPath = strapRefs.current[i];
        const stripePath = stripeRefs.current[i];
        if (!strapPath || !stripePath) continue;
        const c = (edges[i].c + edges[i + 1].c) / 2;
        const lit = Math.abs(c);
        strapPath.setAttribute("d", quad(i, width * 0.0375));
        // The face catches the light when it turns to us; the back stays duller.
        strapPath.setAttribute("fill", c >= 0 ? shade(14, 46, lit) : shade(8, 30, lit));
        stripePath.setAttribute("d", quad(i, width * 0.011));
        stripePath.setAttribute("opacity", c >= 0 ? (0.7 * lit).toFixed(3) : "0");
      }
    };
    draw();
    const stops = [x.on("change", draw), y.on("change", draw), yaw.on("change", draw)];
    return () => stops.forEach((stop) => stop());
  }, [strap, width, x, y, yaw]);

  // Steps the strap's torsion until the card comes to rest facing its side.
  const startSpin = useCallback(() => {
    const s = spin.current;
    if (s.raf) return;
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      s.v += (-TORSION.stiffness * (yaw.get() - s.target) - TORSION.damping * s.v) * dt;
      let angle = yaw.get() + s.v * dt;
      // Wound as far as it goes: the strap stops the card and kicks it back.
      const wound = angle - s.target;
      if (Math.abs(wound) > MAX_TWIST) {
        angle = s.target + Math.sign(wound) * MAX_TWIST;
        if (Math.sign(s.v) === Math.sign(wound)) s.v *= -0.35;
      }
      yaw.set(angle);
      if (!s.dragging && Math.abs(s.v) < 2 && Math.abs(angle - s.target) < 0.5) {
        yaw.set(s.target);
        s.raf = 0;
        if (s.ting) {
          s.ting = false;
          playTingSound(1975, 0.04);
        }
        return;
      }
      s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
  }, [yaw]);

  useEffect(() => () => cancelAnimationFrame(spin.current.raf), []);

  const flip = () => {
    const s = spin.current;
    const next = !flipped;
    setFlipped(next);
    s.target = next ? 180 : 0;
    if (reduceMotion) {
      yaw.set(s.target);
      return;
    }
    // A push toward the other side, so the turn starts briskly.
    s.v += next ? 420 : -420;
    s.ting = true;
    startSpin();
  };

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
    gesture.current = { id: event.pointerId, sx: event.clientX, sy: event.clientY, lx: event.clientX, ox: x.get(), oy: y.get(), moved: false };
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
    // Dragged sideways, the card catches the air and turns on its strap.
    if (!reduceMotion) {
      const s = spin.current;
      s.dragging = true;
      s.v = Math.max(-MAX_SPIN, Math.min(MAX_SPIN, s.v + (event.clientX - g.lx) * 5));
      startSpin();
    }
    g.lx = event.clientX;
    // The strap stretches a little, then pulls harder the further it goes.
    x.set(g.ox + dx);
    y.set(Math.max(-strap * 0.7, g.oy + (dy > 0 ? dy * 0.45 : dy)));
  };

  const onPointerUp = (event) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g || g.id !== event.pointerId) return;
    spin.current.dragging = false;
    if (!g.moved) {
      flip();
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
    flip();
  };

  return (
    <div className="pointer-events-none relative h-0 w-0" data-prevent-flip="true">
      {/* Filled every frame by the draw effect above. */}
      <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1" aria-hidden="true">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <path key={`s${i}`} ref={(node) => (strapRefs.current[i] = node)} />
        ))}
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <path key={`t${i}`} ref={(node) => (stripeRefs.current[i] = node)} fill="#48484a" />
        ))}
      </svg>

      <motion.div
        className="absolute left-0 top-0"
        // Hung `strap` below the hook; it pivots on the clip, where the strap pulls.
        style={{ top: strap, x, y, rotate, transformOrigin: "0px 0px" }}
      >
        {/* Clip and ring, turning with the card */}
        <motion.div className="absolute left-0 top-0" style={{ rotateY: yaw, transformPerspective: 600 }}>
          <div
            className="absolute -translate-x-1/2 rounded-[5px] border border-white/20 bg-gradient-to-b from-[#8e8e93] via-[#48484a] to-[#2c2c2e] shadow-md"
            style={{ width: width * 0.13, height: width * 0.08, top: -width * 0.05 }}
          />
          <div
            className="absolute -translate-x-1/2 rounded-full border-[2.5px] border-[#aeaeb2]"
            style={{ width: width * 0.075, height: width * 0.1, top: width * 0.02 }}
          />
        </motion.div>

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
            style={{ transformStyle: "preserve-3d", rotateY: yaw }}
          >
            <BadgeFront width={width} />
            <BadgeBack width={width} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// The strap as a run of points: straight down off the top of the stage to the
// hook, then a curve to the clip that sags a touch when it goes slack.
const RISE_STEPS = 8;
const CURVE_STEPS = 28;
const SEGMENTS = RISE_STEPS + CURVE_STEPS;

function strapPoints(ex, ey, strap) {
  const points = [];
  for (let i = 0; i <= RISE_STEPS; i++) points.push([0, -RISE + (RISE * i) / RISE_STEPS]);
  const slack = Math.max(0, strap - Math.hypot(ex, ey)) * 0.6;
  const cx = ex / 2 + slack;
  const cy = ey / 2;
  for (let i = 1; i <= CURVE_STEPS; i++) {
    const t = i / CURVE_STEPS;
    const m = 1 - t;
    points.push([2 * m * t * cx + t * t * ex, 2 * m * t * cy + t * t * ey]);
  }
  return points;
}

// A grey from `dark` (edge-on) to `light` (face-on).
function shade(dark, light, lit) {
  const v = Math.round(dark + (light - dark) * lit);
  return `rgb(${v},${v},${v + 2})`;
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
