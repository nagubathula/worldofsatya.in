"use client";

import { useEffect, useRef } from "react";

// Embroidered patches on the hero board, rendered with three.js. Each patch is a
// lit plane with a normal map baked from its own thread texture, so the
// stitching catches the light as it tilts. Pick one up and it lifts off the
// board, leans the way you drag it and its shadow spreads; let go and it drops
// back with a small bounce, or glides on if you flicked it. Every patch stands
// for something real.
//
// The canvas fills the board and never takes pointer events: window listeners
// hit-test the patches against their alpha, so the hero's links stay clickable.

// Wide screens: four patches in the gap either side of the text column. `side`
// picks the gap, `bx` is the spot across it (0 = board edge, 1 = text edge)
// and `fy` the height down the board.
// Narrower screens: the gaps can't hold a patch without covering text, so all
// eight go in a tray of two rows under the hero, in `tray` order.
const PATCHES = [
  { src: "/patches/founder.png", alt: "0 to 1 founder", side: "L", bx: 0.55, fy: 0.16, deg: -12, tray: 0 },
  { src: "/patches/pos-584.png", alt: "POS in 584 restaurants", side: "L", bx: 0.4, fy: 0.42, deg: 7, tray: 1 },
  { src: "/patches/figma-prod.png", alt: "Figma to production", side: "L", bx: 0.58, fy: 0.66, deg: -8, tray: 2 },
  { src: "/patches/film-credits.png", alt: "3 film credits", side: "L", bx: 0.42, fy: 0.88, deg: 6, tray: 3 },
  { src: "/patches/reel-1000.png", alt: "1,000+ AI videos a month", side: "R", bx: 0.45, fy: 0.15, deg: 10, tray: 4 },
  { src: "/patches/hyderabad.png", alt: "Based in Hyderabad", side: "R", bx: 0.62, fy: 0.41, deg: -7, tray: 5 },
  { src: "/patches/hardware-hacker.png", alt: "Hardware hacker", side: "R", bx: 0.42, fy: 0.65, deg: 8, tray: 6 },
  { src: "/patches/chaya-ui.png", alt: "Chaya UI", side: "R", bx: 0.6, fy: 0.88, deg: -6, tray: 7 },
];

const LIFT = 46; // px a held patch rises off the board
const COLUMN = 620; // the hero's text column, as laid out in OnePageHome
const PATCH_PX = 300; // patches are about this many source px across
const MIN_GAP = 190; // narrowest side gap (px) that holds a patch clear of the text

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Height from thread brightness, then a Sobel pass into a tangent-space normal
// map: bright thread reads as raised, the dark gaps between stitches as sunken.
function bakeNormalMap(img) {
  const w = img.naturalWidth, h = img.naturalHeight;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);
  const src = ctx.getImageData(0, 0, w, h).data;
  const height = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const a = src[i * 4 + 3] / 255;
    height[i] = ((src[i * 4] * 0.3 + src[i * 4 + 1] * 0.59 + src[i * 4 + 2] * 0.11) / 255) * a;
  }
  const out = ctx.createImageData(w, h);
  const at = (x, y) => height[Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))];
  const strength = 2.2;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const dx = at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1) - (at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1));
      const dy = at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1) - (at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1));
      let nx = -dx * strength, ny = dy * strength, nz = 1;
      const len = Math.hypot(nx, ny, nz);
      nx /= len;
      ny /= len;
      nz /= len;
      const o = (y * w + x) * 4;
      out.data[o] = (nx * 0.5 + 0.5) * 255;
      out.data[o + 1] = (ny * 0.5 + 0.5) * 255;
      out.data[o + 2] = (nz * 0.5 + 0.5) * 255;
      out.data[o + 3] = 255;
    }
  ctx.putImageData(out, 0, 0);
  return { canvas: c, alpha: src };
}

// A soft silhouette for the shadow: the patch's alpha, blurred, with margin.
function bakeShadow(img, blur) {
  const pad = blur * 3;
  const c = document.createElement("canvas");
  c.width = img.naturalWidth + pad * 2;
  c.height = img.naturalHeight + pad * 2;
  const ctx = c.getContext("2d");
  ctx.filter = `blur(${blur}px) brightness(0)`;
  ctx.drawImage(img, pad, pad);
  return c;
}

export default function PatchBoard({ boardRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const images = await Promise.all(PATCHES.map((p) => loadImage(p.src))).catch(() => null);
      const board = boardRef.current;
      const canvas = canvasRef.current;
      if (disposed || !images || !board || !canvas) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      // Placed so the z = 0 plane maps 1:1 to board pixels: flat patches line
      // up with the page, tilted ones get real perspective.
      const FOV = 28;
      const camera = new THREE.PerspectiveCamera(FOV, 1, 10, 20000);
      scene.add(new THREE.AmbientLight(0xffffff, 1.5));
      const key = new THREE.DirectionalLight(0xffffff, 1.5);
      key.position.set(-0.6, 0.8, 1.2);
      scene.add(key);

      let W = 0, H = 0, scale = 0.55, tray = false, gap = 0, rowH = 0;
      const patches = PATCHES.map((p, i) => {
        const img = images[i];
        const map = new THREE.Texture(img);
        map.colorSpace = THREE.SRGBColorSpace;
        map.anisotropy = 4;
        map.needsUpdate = true;
        const baked = bakeNormalMap(img);
        const normalMap = new THREE.CanvasTexture(baked.canvas);
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1),
          new THREE.MeshStandardMaterial({ map, normalMap, roughness: 0.72, metalness: 0, transparent: true, alphaTest: 0.35 }),
        );
        const shadowCanvas = bakeShadow(img, 6);
        const shadow = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1),
          new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), color: 0x000000, transparent: true, opacity: 0.6, depthWrite: false }),
        );
        const pad = { x: shadowCanvas.width / img.naturalWidth, y: shadowCanvas.height / img.naturalHeight };
        scene.add(shadow, mesh);
        return { ...p, mesh, shadow, pad, alpha: baked.alpha, w: img.naturalWidth, h: img.naturalHeight, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, tx: 0, ty: 0, rot: 0, moved: false, order: i };
      });

      // Board-space positions, until someone moves a patch by hand.
      const place = () => {
        for (const p of patches) {
          if (p.moved) continue;
          p.rot = (p.deg * Math.PI) / 180;
          if (tray) {
            // Two rows of four, evenly spaced, the lower row nudged across so
            // the patches interlock instead of stacking in columns.
            const row = p.tray < 4 ? 0 : 1, col = p.tray % 4;
            const cell = (W - 32) / 4;
            p.x = 16 + cell * (col + 0.5) + (row ? cell * 0.08 : -cell * 0.08);
            p.y = H - 20 - rowH * (1.5 - row);
          } else {
            // The middle of the gap, pulled toward the text by bx.
            const inner = gap * (0.18 + 0.64 * p.bx);
            p.x = p.side === "L" ? inner : W - inner;
            p.y = H * p.fy;
          }
        }
      };

      function draw() {
        for (const p of patches) {
          const w = p.w * scale, h = p.h * scale;
          const cx = p.x - W / 2, cy = -(p.y - H / 2);
          p.mesh.position.set(cx, cy, p.z);
          p.mesh.scale.set(w, h, 1);
          p.mesh.rotation.set(p.tx, p.ty, p.rot, "ZXY");
          p.mesh.renderOrder = p.order * 2 + 1;
          // The shadow slides away from the key light and softens as it rises.
          const k = p.z / LIFT;
          p.shadow.position.set(cx + 4 + k * 16, cy - 7 - k * 24, 0);
          p.shadow.scale.set(w * p.pad.x * (1 + k * 0.08), h * p.pad.y * (1 + k * 0.08), 1);
          p.shadow.rotation.set(0, 0, p.rot);
          p.shadow.material.opacity = 0.6 - k * 0.25;
          p.shadow.renderOrder = p.order * 2;
        }
        renderer.render(scene, camera);
      }

      const resize = () => {
        W = board.clientWidth;
        gap = (W - COLUMN) / 2;
        tray = gap < MIN_GAP;
        if (tray) {
          // Four across, filling the width, capped so tablets don't get giants.
          const across = Math.min(170, (W - 32) / 4);
          scale = across / PATCH_PX;
          rowH = across * 1.05;
          // Tell the hero how much room to leave at the bottom for the tray.
          board.style.setProperty("--patch-tray", `${Math.round(rowH * 2 + 48)}px`);
        } else {
          // As big as the gap allows, never bigger than 0.6 of the source.
          scale = Math.min(0.6, (gap * 0.78) / PATCH_PX);
          board.style.setProperty("--patch-tray", "0px");
        }
        H = board.clientHeight;
        renderer.setSize(W, H, false);
        camera.aspect = W / H;
        camera.position.set(0, 0, H / 2 / Math.tan((FOV * Math.PI) / 360));
        camera.updateProjectionMatrix();
        place();
        draw();
      };

      // Pointer → board px, then an alpha test in the patch's rotated frame.
      const local = (e) => {
        const r = board.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top];
      };
      const hit = (bx, by) => {
        const sorted = [...patches].sort((a, b) => b.order - a.order);
        for (const p of sorted) {
          const dx = bx - p.x, dy = by - p.y;
          const c = Math.cos(p.rot), s = Math.sin(p.rot);
          const lx = dx * c - dy * s, ly = dx * s + dy * c;
          const u = lx / (p.w * scale) + 0.5, v = ly / (p.h * scale) + 0.5;
          if (u < 0 || u > 1 || v < 0 || v > 1) continue;
          if (p.alpha[(Math.floor(v * (p.h - 1)) * p.w + Math.floor(u * (p.w - 1))) * 4 + 3] > 100) return p;
        }
        return null;
      };

      let held = null, grabDX = 0, grabDY = 0, lastX = 0, lastY = 0, lastT = 0, topOrder = patches.length, raf = 0;
      const animating = () => held || patches.some((p) => p.z > 0.05 || Math.abs(p.vz) > 0.05 || Math.abs(p.tx) > 0.002 || Math.abs(p.ty) > 0.002 || Math.abs(p.vx) > 0.5 || Math.abs(p.vy) > 0.5);
      const kick = () => {
        if (!raf) raf = requestAnimationFrame(step);
      };

      let prev = performance.now();
      function step(now) {
        raf = 0;
        const dt = Math.min(0.033, (now - prev) / 1000);
        prev = now;
        for (const p of patches) {
          const isHeld = p === held;
          // Lift: a damped spring towards LIFT while held, the board when not.
          const kz = reduce ? 400 : 260, cz = reduce ? 40 : 14;
          p.vz += (((isHeld ? LIFT : 0) - p.z) * kz - p.vz * cz) * dt;
          p.z += p.vz * dt;
          if (!isHeld && p.z < 0) {
            p.z = 0;
            p.vz = reduce ? 0 : -p.vz * 0.3; // a small bounce on landing
          }
          if (!isHeld) {
            // Thrown: glide on with friction, bouncing off the board's edges.
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vx *= Math.pow(0.02, dt);
            p.vy *= Math.pow(0.02, dt);
            const m = 24;
            if (p.x < m) (p.x = m), (p.vx = Math.abs(p.vx) * 0.4);
            if (p.x > W - m) (p.x = W - m), (p.vx = -Math.abs(p.vx) * 0.4);
            if (p.y < m) (p.y = m), (p.vy = Math.abs(p.vy) * 0.4);
            if (p.y > H - m) (p.y = H - m), (p.vy = -Math.abs(p.vy) * 0.4);
          }
          // Lean into the motion, capped, easing back to flat.
          const lean = reduce ? 0 : 0.0009;
          const txT = Math.max(-0.45, Math.min(0.45, -p.vy * lean));
          const tyT = Math.max(-0.45, Math.min(0.45, p.vx * lean));
          p.tx += (txT - p.tx) * Math.min(1, dt * 14);
          p.ty += (tyT - p.ty) * Math.min(1, dt * 14);
        }
        draw();
        if (animating()) kick();
      }

      const onDown = (e) => {
        if (e.button !== 0) return;
        const [bx, by] = local(e);
        const p = hit(bx, by);
        if (!p) return;
        e.preventDefault();
        e.stopPropagation();
        held = p;
        p.moved = true;
        p.order = ++topOrder;
        grabDX = p.x - bx;
        grabDY = p.y - by;
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = e.timeStamp;
        p.vx = p.vy = 0;
        document.documentElement.style.cursor = "grabbing";
        prev = performance.now();
        kick();
      };
      const onMove = (e) => {
        if (!held) {
          if (e.pointerType === "mouse") {
            const [bx, by] = local(e);
            const over = bx >= 0 && by >= 0 && bx <= W && by <= H && hit(bx, by);
            board.style.cursor = over ? "grab" : "";
          }
          return;
        }
        e.preventDefault();
        const [bx, by] = local(e);
        const dt = Math.max(1 / 240, (e.timeStamp - lastT) / 1000);
        // Smoothed velocity, for the lean and for the throw on release.
        held.vx = held.vx * 0.6 + ((e.clientX - lastX) / dt) * 0.4;
        held.vy = held.vy * 0.6 + ((e.clientY - lastY) / dt) * 0.4;
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = e.timeStamp;
        held.x = Math.min(W, Math.max(0, bx + grabDX));
        held.y = Math.min(H, Math.max(0, by + grabDY));
        kick();
      };
      const onUp = () => {
        if (!held) return;
        held.vx = Math.max(-1600, Math.min(1600, held.vx * 0.5));
        held.vy = Math.max(-1600, Math.min(1600, held.vy * 0.5));
        held = null;
        document.documentElement.style.cursor = "";
        kick();
      };
      // Touch: stop the page scrolling only when the finger lands on a patch.
      const onTouchStart = (e) => {
        const t = e.touches[0];
        if (!t) return;
        const r = board.getBoundingClientRect();
        if (hit(t.clientX - r.left, t.clientY - r.top)) e.preventDefault();
      };
      const onTouchMove = (e) => held && e.preventDefault();

      window.addEventListener("pointerdown", onDown, { capture: true });
      window.addEventListener("pointermove", onMove, { passive: false });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      board.addEventListener("touchstart", onTouchStart, { passive: false });
      board.addEventListener("touchmove", onTouchMove, { passive: false });
      const ro = new ResizeObserver(resize);
      ro.observe(board);

      resize();
      // First show: the patches drop onto the board one after another.
      if (!reduce) patches.forEach((p, i) => ((p.z = LIFT * 2), (p.vz = -30 - i * 30)));
      kick();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointerdown", onDown, { capture: true });
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        board.removeEventListener("touchstart", onTouchStart);
        board.removeEventListener("touchmove", onTouchMove);
        ro.disconnect();
        board.style.cursor = "";
        document.documentElement.style.cursor = "";
        for (const p of patches) {
          p.mesh.geometry.dispose();
          p.mesh.material.map.dispose();
          p.mesh.material.normalMap.dispose();
          p.mesh.material.dispose();
          p.shadow.geometry.dispose();
          p.shadow.material.map.dispose();
          p.shadow.material.dispose();
        }
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [boardRef]);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 h-full w-full" />
      <ul className="sr-only" aria-label="Patches">
        {PATCHES.map((p) => (
          <li key={p.src}>{p.alt}</li>
        ))}
      </ul>
    </>
  );
}
