"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import Image from "next/image";

// Artifacts as a field of pieces at different depths. The section is tall and
// its stage is pinned, so scrolling the page moves a camera forward through the
// field: pieces grow as they come closer, are sharp around one focal depth and
// blur away from it, then slip past the edges. Pieces lean a little toward the
// pointer. Clicking one opens it.
//
// Positions and sizes come from a seeded random, so the field is the same on
// every visit. All per-frame work writes styles directly; React only renders once.

const PERSPECTIVE = 900; // px: how fast pieces shrink with depth
const SPACING = 430; // px of depth between consecutive pieces
const VIEW_DEPTH = 2300; // px: pieces further than this aren't drawn
const FOCAL = 650; // px: the sharpest depth
const SHARP_BAND = 360; // px either side of FOCAL that stays sharp
const BLUR_PER_PX = 1 / 170; // px of blur per px of depth beyond the band
const MAX_BLUR = 14;
const BLUR_STEPS = [0, 1, 2, 3.5, 5.5, 8, 11, 14]; // stepped, so blur repaints rarely
const SCROLL_RATE = 1.7; // px of depth per px of scroll
const LEAN_RADIUS = 200; // px from a piece's edge where the pointer starts to pull
const LEAN_SHARE = 0.1;
const LEAN_MAX = 20;
const PASS = 260; // px past the camera a piece is gone by
const FOCAL_SCALE = PERSPECTIVE / (PERSPECTIVE + FOCAL);

function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Visitors who ask for less motion get a still grid instead of the dive.
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
function subscribeMotion(listener) {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", listener);
  return () => mq.removeEventListener("change", listener);
}
const reducedMotion = () => window.matchMedia(MOTION_QUERY).matches;

function stepBlur(blur) {
  let best = 0;
  for (const s of BLUR_STEPS) if (blur >= s - 0.4) best = s;
  return best;
}

// Where each piece sits in the field: x/y as a share of the half-viewport,
// a base width, and its depth.
function layout(items) {
  const rand = rng(1729);
  let lastQuadrant = -1;
  return items.map((item, i) => {
    // Alternate quadrants so consecutive pieces don't stack on each other.
    let q;
    do q = Math.floor(rand() * 4);
    while (q === lastQuadrant);
    lastQuadrant = q;
    const sx = q % 2 ? 1 : -1;
    const sy = q < 2 ? -1 : 1;
    const ratio = item.width / item.height;
    const area = 110000 + rand() * 110000; // px², before perspective
    const w = Math.min(620, Math.sqrt(area * ratio));
    return {
      ...item,
      ratio,
      w,
      h: w / ratio,
      fx: sx * (0.3 + rand() * 0.55),
      fy: sy * (0.15 + rand() * 0.6),
      z: (i + 1.6) * SPACING,
    };
  });
}

export default function DepthGallery({ items, onOpen }) {
  const pieces = useMemo(() => layout(items), [items]);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const nodes = useRef([]);
  const still = useSyncExternalStore(subscribeMotion, reducedMotion, () => false);

  useEffect(() => {
    if (still) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const state = pieces.map(() => ({ lx: 0, ly: 0, blur: -1, vis: null }));
    const pointer = { x: -9999, y: -9999 };
    let raf = 0;
    let active = false;
    let last = performance.now();

    const frame = (now) => {
      raf = 0;
      const dt = Math.min(64, now - last);
      last = now;
      const rect = section.getBoundingClientRect();
      const vw = stage.clientWidth;
      const vh = stage.clientHeight;
      const travelled = Math.max(0, -rect.top);
      const fit = Math.max(0.55, Math.min(1, vw / 1280));
      const camera = travelled * SCROLL_RATE;
      const ease = 1 - Math.exp(-dt / 420);
      let moving = false;

      pieces.forEach((p, i) => {
        const el = nodes.current[i];
        if (!el) return;
        const s = state[i];
        const d = p.z - camera;
        const visible = d > -PASS && d < VIEW_DEPTH;
        if (visible !== s.vis) {
          el.style.visibility = visible ? "visible" : "hidden";
          s.vis = visible;
        }
        if (!visible) return;

        // Narrow screens get smaller pieces, so the field keeps its air.
        const scale = (PERSPECTIVE / (PERSPECTIVE + d)) * fit;
        // Far pieces gather toward the middle; as they near the focal depth
        // they settle into their spot, and keep drifting outward as they pass.
        const spread = 0.45 + 0.55 * Math.min(1.6, scale / fit / FOCAL_SCALE);
        const roomX = Math.max(0, vw / 2 - (p.w * scale) / 2 - 16);
        const roomY = Math.max(0, vh / 2 - (p.h * scale) / 2 - 16);
        const baseX = p.fx * Math.max(roomX, vw * 0.18) * spread;
        const baseY = p.fy * Math.max(roomY, vh * 0.12) * spread;

        // Lean toward the pointer when it's near the piece.
        const halfW = (p.w * scale) / 2;
        const halfH = (p.h * scale) / 2;
        const cx = vw / 2 + baseX;
        const cy = vh / 2 + baseY;
        const dx = pointer.x - cx;
        const dy = pointer.y - cy;
        const ex = Math.max(0, Math.abs(dx) - halfW);
        const ey = Math.max(0, Math.abs(dy) - halfH);
        const near = Math.hypot(ex, ey) < LEAN_RADIUS && d > 0;
        const tx = near ? Math.max(-LEAN_MAX, Math.min(LEAN_MAX, dx * LEAN_SHARE)) : 0;
        const ty = near ? Math.max(-LEAN_MAX, Math.min(LEAN_MAX, dy * LEAN_SHARE)) : 0;
        s.lx += (tx - s.lx) * ease;
        s.ly += (ty - s.ly) * ease;
        if (Math.abs(tx - s.lx) > 0.1 || Math.abs(ty - s.ly) > 0.1) moving = true;

        el.style.transform = `translate3d(${(baseX + s.lx).toFixed(1)}px, ${(baseY + s.ly).toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
        el.style.zIndex = String(Math.round(10000 - d));

        // Fade in from the far distance, fade out as it passes the camera.
        const far = Math.min(1, (VIEW_DEPTH - d) / 500);
        const close = Math.min(1, (d + PASS) / 380);
        el.style.opacity = Math.max(0, Math.min(far, close)).toFixed(3);

        const raw = Math.max(0, Math.abs(d - FOCAL) - SHARP_BAND) * BLUR_PER_PX;
        const blur = stepBlur(Math.min(MAX_BLUR, raw));
        if (blur !== s.blur) {
          el.style.filter = blur ? `blur(${blur}px)` : "none";
          s.blur = blur;
        }
      });

      if (moving && active) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!raf && active) raf = requestAnimationFrame(frame);
    };
    const onPointer = (e) => {
      const r = stage.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      kick();
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
      kick();
    };

    // Only run while the section is on screen.
    const io = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      kick();
    });
    io.observe(section);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    stage.addEventListener("pointermove", onPointer);
    stage.addEventListener("pointerleave", onLeave);
    active = true;
    kick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      stage.removeEventListener("pointermove", onPointer);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [pieces, still]);

  // Reduced motion: a plain, still grid of the same pieces.
  if (still) {
    return (
      <div className="mx-auto grid w-full max-w-[860px] grid-cols-2 gap-6 px-5 sm:grid-cols-3">
        {pieces.map((p) => (
          <button key={p.id} type="button" onClick={() => onOpen(p)} className="block overflow-hidden rounded-[10px] bg-[#f3f3f3]">
            <Image src={p.src} alt={p.title} width={p.width} height={p.height} sizes="280px" className="h-auto w-full" />
          </button>
        ))}
      </div>
    );
  }

  // The dive is as long as the field is deep.
  const depth = pieces.length * SPACING + VIEW_DEPTH * 0.35;
  return (
    <div ref={sectionRef} style={{ height: `calc(${Math.round(depth / SCROLL_RATE)}px + 100dvh)` }} className="relative w-full">
      <div ref={stageRef} className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {pieces.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => (nodes.current[i] = el)}
            type="button"
            onClick={() => onOpen(p)}
            aria-label={`${p.title}, ${p.category}`}
            style={{
              width: p.w,
              height: p.h,
              marginLeft: -p.w / 2,
              marginTop: -p.h / 2,
              visibility: "hidden",
            }}
            className="group absolute left-1/2 top-1/2 origin-center overflow-hidden rounded-[14px] bg-[#f3f3f3] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)] outline-none will-change-transform focus-visible:ring-4 focus-visible:ring-[#0879a0]"
          >
            <Image src={p.src} alt="" fill sizes="(min-width: 768px) 560px, 80vw" className="object-cover" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-5 pb-4 pt-10 text-left text-[22px] font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              {p.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
