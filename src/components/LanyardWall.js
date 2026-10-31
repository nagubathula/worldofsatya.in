"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { IBM_Plex_Mono } from "next/font/google";
import { EXPERIENCES } from "@/data/experiences";
import { drawBack, drawFront, drawStrap, shade } from "./lanyard/badgeArt";

// A wall of conference badges, one per job, each hung from the top of the stage
// on a printed strap. The cards and straps are simulated: a rope of points held
// by distance constraints, and a rigid card pinned to its end. Drag a badge and
// it swings; tap it and it turns over, always the same way, so every tap winds
// another half-twist into the strap (which hitches the badge up a little). The
// strap only takes so much: the seventh tap in a row lets it go, and it unwinds
// like a torsion spring, front side out.

const plexMono = IBM_Plex_Mono({ weight: ["500", "600"], subsets: ["latin"], display: "swap" });

// Each badge's colours and what it says, keyed by company in EXPERIENCES.
const LOOKS = {
  NxtWave: {
    color: "#2f5bea",
    band: "#1a2f91",
    band2: "#0e1b5e",
    strap: "#1f3aa8",
    front: {
      design: ["AI video editor", "AI ads, on character", "Tools for 20+ creatives"],
      build: ["14 full-stack apps", "RAG and LLM pipelines", "1,000+ videos a month"],
    },
    back: {
      design: [
        "Designed an AI video editor that automates content creation",
        "Made 100+ character-consistent AI ads",
        "Led 3 designers, supporting a creative team of 20+",
      ],
      build: [
        "Built 14 full-stack apps on RAG and LLM pipelines",
        "Internal tools that cut production time by 90%",
        "Scaled 14 channels from 0 to 100K+ followers",
      ],
    },
  },
  CrestLogic: {
    color: "#0f766e",
    band: "#0a514b",
    band2: "#063833",
    strap: "#0c5f58",
    front: { design: ["billjot branding", "Product UI"], build: ["Marketing funnel", "Product frontend"] },
    back: {
      design: ["Branding for billjot", "User interface design for the product"],
      build: ["Built billjot's marketing funnel", "Frontend for the product"],
    },
  },
  APSPCL: {
    color: "#f2b134",
    band: "#a86400",
    band2: "#6e4100",
    strap: "#c27a06",
    front: { design: ["UI design", "Web design"], build: ["Full-stack web"] },
    back: {
      design: ["UI and web design for the Andhra Pradesh Solar Power Corporation"],
      build: ["Full-stack web development for the corporation's site"],
    },
  },
  Traboda: {
    color: "#6d4aff",
    band: "#4129b8",
    band2: "#291880",
    strap: "#4a30c8",
    front: { design: ["Chaya UI components"], build: ["React and Radix UI", "Hardware security"] },
    back: {
      design: ["Designed components for the Chaya UI library"],
      build: ["Built Chaya UI in React on Radix UI", "Hardware security research"],
    },
  },
  Redantio: {
    color: "#d93a3a",
    band: "#9e1f1f",
    band2: "#661111",
    strap: "#a82222",
    front: { design: ["UI and graphic design", "Figma tutoring"], build: ["Web development", "Hardware security"] },
    back: {
      design: ["UI and graphic design", "Taught Figma"],
      build: ["Web development", "Hardware security research"],
    },
  },
};

const BADGES = EXPERIENCES.filter((e) => LOOKS[e.company]).map((e) => ({ ...e, ...LOOKS[e.company] }));

/* ---------- simulation ---------- */

const G = -16; // gravity, world units / s²
const H = 1 / 480; // fixed step
const MAX_STEPS = 26; // per frame, so a slow frame doesn't spiral
const N = 8; // rope points, anchor first
const ROPE_W = 1 / 0.06; // inverse mass of a rope point
const ROPE_SOFT = 1e-6; // rope compliance: next to rigid
const GRIP_SOFT = 1.6e-5; // the hand's hold: a little give
const CLIP = 0.155; // clip hardware above the card's top edge, × card height
const SEG = 64; // strap samples
const UNWIND_AFTER = 7; // taps in a row before the strap lets go
// How far each badge hangs short of the lowest one, × stage height, so the row isn't a straight line.
const HANG = [0, 0.1, 0.04, 0.12, 0.02];

const V3 = THREE.Vector3;
const tA = new V3();
const tB = new V3();
const tC = new V3();
const tD = new V3();
const fwd = new V3();
const qInv = new THREE.Quaternion();
const dq = new THREE.Quaternion();

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// Inverse inertia in world space, applied to v.
function invInertia(L, v, out) {
  qInv.copy(L.q).invert();
  return out.copy(v).applyQuaternion(qInv).multiply(L.Iinv).applyQuaternion(L.q);
}

// How hard the body resists being moved at offset r along n.
function resistance(L, r, n) {
  tC.crossVectors(r, n);
  invInertia(L, tC, tD);
  return 1 / L.mass + tC.dot(tD);
}

// Push the body by impulse P applied at offset r.
function nudge(L, r, P) {
  L.pos.addScaledVector(P, 1 / L.mass);
  tC.crossVectors(r, P);
  invInertia(L, tC, tD);
  dq.set(tD.x, tD.y, tD.z, 0).multiply(L.q);
  L.q.set(L.q.x + 0.5 * dq.x, L.q.y + 0.5 * dq.y, L.q.z + 0.5 * dq.z, L.q.w + 0.5 * dq.w).normalize();
}

function spinBy(q, w, h) {
  dq.set(w.x, w.y, w.z, 0).multiply(q);
  q.set(q.x + 0.5 * h * dq.x, q.y + 0.5 * h * dq.y, q.z + 0.5 * h * dq.z, q.w + 0.5 * h * dq.w).normalize();
}

// The badge's half-size on screen axes (x, y) and in depth (z), turned as it is.
function extent(L, out) {
  out.set(0, 0, 0);
  for (const sx of [-0.5, 0.5]) {
    for (const sy of [-0.5, 0.5]) {
      tB.set(sx * L.cw, sy * L.ch, 0).applyQuaternion(L.q);
      out.set(Math.max(out.x, Math.abs(tB.x)), Math.max(out.y, Math.abs(tB.y)), Math.max(out.z, Math.abs(tB.z)));
    }
  }
  return out;
}

// A sway that fades a few seconds after the last touch, so the wall can go still and stop drawing.
function breezeAt(sim) {
  if (sim.reduce) return 0;
  return 0.5 * clamp(1 - (sim.t - sim.lastTouch - 4) / 3, 0, 1);
}

const extA = new V3();
const extB = new V3();

function step(sim, h) {
  sim.t += h;
  const breeze = breezeAt(sim);
  const { grab, lanyards } = sim;

  for (const L of lanyards) {
    L.x[0].copy(L.anchor);
    L.prev[0].copy(L.anchor);
    if (L.holdUntil > sim.t) continue;
    for (let k = 1; k < N; k++) {
      const x = L.x[k];
      const p = L.prev[k];
      tA.subVectors(x, p).multiplyScalar(1 - 0.8 * h);
      p.copy(x);
      x.add(tA);
      x.y += G * h * h;
      x.x += Math.sin(sim.t * 0.8 + k * 0.6 + L.i * 2.1) * breeze * h * h;
    }

    L.prevPos.copy(L.pos);
    L.prevQ.copy(L.q);
    L.vel.y += G * h;
    L.vel.x += Math.sin(sim.t * 0.55 + L.i * 1.7) * breeze * 0.4 * h;
    const held = grab && grab.i === L.i;
    if (L.unspin) {
      // Let go, the wound strap turns the badge back: slowly at first, faster as the twist pays out, past
      // straight, then back again until it settles.
      L.ang.y += -(sim.reduce ? 1.2 : 2.2) * L.twist * h;
      L.unspinT += h;
      if ((Math.abs(L.twist) < 0.25 && Math.abs(L.ang.y) < 0.6) || L.unspinT > 8) L.unspin = false;
    } else {
      // A soft spring turns the badge to face out (or its back, once flipped). Pulled nearly flat, its
      // facing is mostly noise, so the spring fades out there rather than kick it into a spin.
      fwd.set(0, 0, 1).applyQuaternion(L.q);
      const err = wrapAngle(Math.atan2(fwd.x, fwd.z) - L.targetYaw);
      const trust = clamp((Math.hypot(fwd.x, fwd.z) - 0.25) / 0.35, 0, 1);
      L.ang.y += (-(held ? 4 : 36) * err * trust - 4.5 * L.ang.y) * h;
    }
    L.vel.multiplyScalar(1 - 0.3 * h);
    // Held, it eases into each new angle instead of whipping round the hand.
    L.ang.multiplyScalar(1 - (held ? 10.4 : 1.4) * h);
    const cap = held ? 7 : 24;
    const spin = L.ang.length();
    if (spin > cap) L.ang.multiplyScalar(cap / spin);
    L.pos.addScaledVector(L.vel, h);
    spinBy(L.q, L.ang, h);
  }

  for (let pass = 0; pass < 2; pass++) {
    for (const L of lanyards) {
      if (L.holdUntil > sim.t) continue;
      // Twist takes up length, as a real strap's does: each half-turn lifts the badge a little.
      if (pass === 0) L.shrink += (Math.min(0.13, (0.022 * Math.abs(L.twist)) / Math.PI) - L.shrink) * Math.min(1, 5 * h);
      const rest = L.rest * (1 - L.shrink);
      for (let k = 0; k < N - 1; k++) {
        const a = L.x[k];
        const b = L.x[k + 1];
        const wa = k === 0 ? 0 : ROPE_W;
        tA.subVectors(b, a);
        const len = tA.length();
        if (len < 1e-6) continue;
        const lambda = -(len - rest) / (wa + ROPE_W + ROPE_SOFT / (h * h));
        tA.multiplyScalar(lambda / len);
        a.addScaledVector(tA, -wa);
        b.addScaledVector(tA, ROPE_W);
      }

      // The strap's end holds the clip.
      const end = L.x[N - 1];
      const r = tB.copy(L.hang).applyQuaternion(L.q);
      tA.copy(L.pos).add(r).sub(end);
      const gap = tA.length();
      if (gap > 1e-7) {
        tA.divideScalar(gap);
        const lambda = -gap / (ROPE_W + resistance(L, r, tA));
        const P = tA.multiplyScalar(lambda).clone();
        nudge(L, r, P);
        end.addScaledVector(P, -ROPE_W);
      }

      if (grab && grab.i === L.i && grab.target) {
        const r2 = tB.copy(grab.local).applyQuaternion(L.q);
        tA.copy(L.pos).add(r2).sub(grab.target);
        const off = tA.length();
        if (off > 1e-7) {
          tA.divideScalar(off);
          const lambda = -off / (resistance(L, r2, tA) + GRIP_SOFT / (h * h));
          nudge(L, r2.clone(), tA.multiplyScalar(lambda).clone());
        }
      }
    }
  }

  // Side by side, neighbours bump and swing. Shoved deep into each other, or once a badge has
  // given way as far as its strap lets it, they layer in depth instead (the held one comes
  // forward), so they never pass through and a drag can't push the whole row along.
  const bumps = [];
  for (let a = 0; a < lanyards.length; a++) {
    for (let b = a + 1; b < lanyards.length; b++) {
      const A = lanyards[a];
      const B = lanyards[b];
      if (A.holdUntil > sim.t || B.holdUntil > sim.t) continue;
      const eA = extent(A, extA);
      const eB = extent(B, extB);
      const ox = eA.x + eB.x - Math.abs(B.pos.x - A.pos.x);
      const oy = eA.y + eB.y - Math.abs(B.pos.y - A.pos.y);
      if (ox <= 0 || oy <= 0) continue;
      const ga = grab && grab.i === A.i;
      const gb = grab && grab.i === B.i;
      const wa = ga ? 0 : gb ? 1 : 0.5;
      const wb = gb ? 0 : ga ? 1 : 0.5;
      const givenWay = (L, w) => w > 0 && Math.abs(L.pos.x - L.anchor.x) > 0.35 * L.cw;
      if (Math.abs(B.pos.z - A.pos.z) < 0.3 && ox < 0.35 * Math.min(A.cw, B.cw) && !givenWay(A, wa) && !givenWay(B, wb)) {
        const sx = Math.sign(B.pos.x - A.pos.x) || 1;
        const push = Math.min(ox * 0.04, 0.0015);
        A.pos.x -= push * sx * wa;
        B.pos.x += push * sx * wb;
        bumps.push([A, B, sx]);
      } else {
        const need = eA.z + eB.z + 0.02 - Math.abs(B.pos.z - A.pos.z);
        if (need <= 0) continue;
        const front = ga ? -1 : gb ? 1 : Math.sign(B.pos.z - A.pos.z) || 1;
        const dz = Math.min(need, 0.012) * front;
        A.pos.z -= dz * wa;
        A.prevPos.z -= dz * wa;
        B.pos.z += dz * wb;
        B.prevPos.z += dz * wb;
      }
    }
  }

  for (const L of lanyards) {
    L.pos.z = clamp(L.pos.z, -0.6, 0.6); // off the wall, and never lunging at the viewer
    if (L.holdUntil > sim.t) continue;
    L.vel.subVectors(L.pos, L.prevPos).divideScalar(h);
    dq.copy(L.q).multiply(qInv.copy(L.prevQ).invert());
    L.ang.set(dq.x, dq.y, dq.z).multiplyScalar(2 / h);
    if (dq.w < 0) L.ang.negate();
  }
  for (const [A, B, sx] of bumps) {
    const closing = (B.vel.x - A.vel.x) * sx;
    if (closing < 0) {
      A.vel.x += closing * 0.45 * sx;
      B.vel.x -= closing * 0.45 * sx;
    }
    const parting = (B.vel.x - A.vel.x) * sx;
    if (parting > 0.6) {
      const k = (parting - 0.6) * 0.5;
      A.vel.x += k * sx;
      B.vel.x -= k * sx;
    }
  }
}

/* ---------- meshes ---------- */

// A rounded card with a slot punched near the top for the clip.
function cardShape(w, h) {
  const r = w * 0.06;
  const x0 = -w / 2;
  const y0 = -h / 2;
  const s = new THREE.Shape();
  s.moveTo(x0 + r, y0);
  s.lineTo(x0 + w - r, y0);
  s.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
  s.lineTo(x0 + w, y0 + h - r);
  s.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
  s.lineTo(x0 + r, y0 + h);
  s.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
  s.lineTo(x0, y0 + r);
  s.quadraticCurveTo(x0, y0, x0 + r, y0);
  const sw = w * 0.2;
  const sh = h * 0.03;
  const sy = h / 2 - h * 0.075;
  const slot = new THREE.Path();
  slot.absarc(-sw / 2 + sh / 2, sy, sh / 2, Math.PI / 2, (3 * Math.PI) / 2, false);
  slot.lineTo(sw / 2 - sh / 2, sy - sh / 2);
  slot.absarc(sw / 2 - sh / 2, sy, sh / 2, -Math.PI / 2, Math.PI / 2, false);
  slot.lineTo(-sw / 2 + sh / 2, sy + sh / 2);
  s.holes.push(slot);
  return s;
}

// A flat face of the card, its texture spread corner to corner.
function faceGeometry(shape, w, h) {
  const geo = new THREE.ShapeGeometry(shape, 12);
  const p = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let k = 0; k < p.count; k++) uv.setXY(k, (p.getX(k) + w / 2) / w, (p.getY(k) + h / 2) / h);
  return geo;
}

// A strap side: per sample, a front face, a back face and two thin edges, 8 vertices in all.
function ribbonGeometry() {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array((SEG + 1) * 8 * 3), 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array((SEG + 1) * 8 * 2), 2));
  const index = [];
  for (let k = 0; k < SEG; k++) {
    const a = k * 8;
    const b = a + 8;
    for (const [p, q] of [
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
    ]) index.push(a + p, b + p, a + q, a + q, b + p, b + q);
  }
  geo.setIndex(index);
  return geo;
}

function canvasTexture(canvas, gl) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
  return tex;
}

function makeLanyard(i, b, lay, assets, gl, metal, drop) {
  const { cw, ch } = lay;
  const depth = cw * 0.022;
  const hang = new V3(0, ch / 2 + ch * CLIP, 0);
  const anchor = new V3(-lay.width / 2 + lay.col * (i + 0.5), lay.top, 0);
  const strapLen = Math.max(lay.height * 0.2, lay.top - lay.floor - ch * (1 + CLIP) - HANG[i % HANG.length] * lay.height);
  const rest = strapLen / (N - 1);
  // Dropped in from above the stage: everything starts lifted clear of the top and falls on its strap.
  const lift = drop ? strapLen + hang.y + ch : 0;
  const x = [];
  for (let k = 0; k < N; k++) x.push(new V3(anchor.x, anchor.y - rest * k + (k ? lift : 0), 0));
  const pos = new V3(anchor.x, anchor.y - strapLen - hang.y + lift, 0);

  const group = new THREE.Group();
  const shape = cardShape(cw, ch);
  const frontCanvas = document.createElement("canvas");
  const backCanvas = document.createElement("canvas");
  drawFront(frontCanvas, b, i, assets.fonts, assets.logos.get(b.company));
  drawBack(backCanvas, b, assets.fonts);
  const faceMat = (canvas) =>
    new THREE.MeshPhysicalMaterial({ map: canvasTexture(canvas, gl), roughness: 0.6, clearcoat: 0.3, clearcoatRoughness: 0.35 });
  const front = new THREE.Mesh(faceGeometry(shape, cw, ch), faceMat(frontCanvas));
  front.position.z = depth / 2 + 0.0004;
  const back = new THREE.Mesh(faceGeometry(shape, cw, ch), faceMat(backCanvas));
  back.rotation.y = Math.PI;
  back.position.z = -depth / 2 - 0.0004;
  const edgeGeo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 12 });
  edgeGeo.translate(0, 0, -depth / 2);
  // Group 0 is the caps, which the textured faces cover; only the sides draw.
  const edge = new THREE.Mesh(edgeGeo, [
    new THREE.MeshBasicMaterial({ visible: false }),
    new THREE.MeshStandardMaterial({ color: shade(b.color, -0.25), roughness: 0.6 }),
  ]);
  group.add(front, back, edge);

  // Clip: plates either side of the slot, joined through it, a hinge, a ring, and a crimp the strap runs into.
  const slotY = ch / 2 - ch * 0.075;
  const part = (geo, px, py, pz) => {
    const m = new THREE.Mesh(geo, metal);
    m.position.set(px, py, pz);
    group.add(m);
    return m;
  };
  const plate = new THREE.BoxGeometry(cw * 0.13, ch * 0.11, depth * 0.8);
  part(plate, 0, ch / 2 - ch * 0.02, depth * 1.1);
  part(plate, 0, ch / 2 - ch * 0.02, -depth * 1.1);
  part(new THREE.BoxGeometry(cw * 0.13, ch * 0.022, depth * 3), 0, slotY - ch * 0.004, 0);
  part(new THREE.CylinderGeometry(ch * 0.012, ch * 0.012, cw * 0.15, 16), 0, ch / 2 + ch * 0.035, 0).rotation.z = Math.PI / 2;
  part(new THREE.TorusGeometry(ch * 0.03, ch * 0.007, 10, 28), 0, ch / 2 + ch * 0.07, 0);
  part(new THREE.BoxGeometry(cw * 0.19, ch * 0.05, depth * 3.2), 0, ch / 2 + ch * 0.125, 0);
  group.traverse((o) => {
    if (o.isMesh) o.castShadow = true;
  });

  const strapCanvas = document.createElement("canvas");
  drawStrap(strapCanvas, b, assets.fonts);
  const strapTex = canvasTexture(strapCanvas, gl);
  strapTex.wrapT = THREE.RepeatWrapping;
  const strapMat = new THREE.MeshStandardMaterial({ map: strapTex, roughness: 0.85, side: THREE.DoubleSide });
  const ribbons = [0, 1].map(() => {
    const m = new THREE.Mesh(ribbonGeometry(), strapMat);
    m.frustumCulled = false;
    m.castShadow = true;
    return m;
  });

  return {
    i,
    company: b.company,
    cw,
    ch,
    anchor,
    x,
    prev: x.map((p) => p.clone()),
    rest,
    pos,
    prevPos: pos.clone(),
    vel: new V3(),
    q: new THREE.Quaternion(),
    prevQ: new THREE.Quaternion(),
    ang: new V3(),
    mass: 1,
    Iinv: new V3(12 / (ch * ch + depth * depth), 12 / (cw * cw + depth * depth), 12 / (cw * cw + ch * ch)),
    hang,
    face: 0,
    targetYaw: 0,
    twist: 0,
    lastYaw: 0,
    clicks: 0,
    unspin: false,
    unspinT: 0,
    shrink: 0,
    pinch: 0,
    holdUntil: drop ? 0.35 + i * 0.14 : 0,
    group,
    ribbons,
    strapRepeat: (cw * 0.16 * strapCanvas.height) / 128,
    curve: new THREE.CatmullRomCurve3(x.map((p) => p.clone()), false, "centripetal"),
  };
}

const pt = new V3();
const tan = new V3();
const side = new V3();
const nrm = new V3();
const cardX = new V3();
const ofs = new V3();
const wid = new V3();
const thk = new V3();
const corner = new V3();

// Lay a strap side along the curve. Twist builds up from the clip: none near the anchor,
// the card's whole accumulated turn at the clip, spreading further up as more turns go in.
function layRibbons(L) {
  const tw = Math.abs(L.twist);
  const dir = Math.sign(L.twist) || 1;
  const reach = Math.min(0.78, 0.32 + (0.07 * tw) / Math.PI) * (1 + 0.3 * L.pinch);
  const end = 0.95;
  const start = Math.max(0.04, end - reach);
  const hw = L.cw * 0.08;
  const restLen = L.rest * (N - 1);
  for (let k = 0; k <= SEG; k++) {
    const t = k / SEG;
    L.curve.getPoint(t, pt);
    L.curve.getTangent(t, tan);
    const u = clamp((t - start) / (end - start), 0, 1);
    const th = dir * tw * (0.35 * u + 0.65 * u * u * (3 - 2 * u));
    const lock = t ** 12; // the last stretch takes the clip's own angle
    side.set(Math.cos(th), 0, -Math.sin(th)).multiplyScalar(1 - lock).addScaledVector(cardX, lock);
    side.addScaledVector(tan, -side.dot(tan)).normalize();
    nrm.crossVectors(tan, side).normalize();
    // The two sides of the loop sit one behind the other and wind round each other with the twist. Where it's
    // loose they ease apart sideways in a lens; stretched, the strap thins in the middle.
    const snug = Math.min(1, Math.abs(th) / (Math.PI / 2));
    const close = 1 - t ** 6;
    const waist = 1 - L.pinch * Math.sin(Math.PI * t);
    const gap = hw * (0.22 - 0.09 * snug) * close * (1 - 0.6 * L.pinch);
    const purse = hw * 0.5 * (1 - snug) * Math.sin(Math.PI * t) * close * (1 - L.pinch);
    const v = (t * restLen) / L.strapRepeat;
    wid.copy(side).multiplyScalar(hw * waist);
    thk.copy(nrm).multiplyScalar(hw * 0.1 * waist);
    L.ribbons.forEach((mesh, n) => {
      const sgn = n ? -1 : 1;
      ofs.copy(nrm).multiplyScalar(gap).addScaledVector(side, purse).multiplyScalar(sgn).add(pt);
      const P = mesh.geometry.attributes.position;
      const U = mesh.geometry.attributes.uv;
      const put = (j, sw, st, uu) => {
        P.setXYZ(k * 8 + j, ofs.x + wid.x * sw + thk.x * st, ofs.y + wid.y * sw + thk.y * st, ofs.z + wid.z * sw + thk.z * st);
        U.setXY(k * 8 + j, uu, v);
      };
      put(0, -1, 1, 1);
      put(1, 1, 1, 0); // front
      put(2, 1, -1, 1);
      put(3, -1, -1, 0); // back, mirrored so the print reads from behind
      put(4, 1, 1, 0.985);
      put(5, 1, -1, 0.995); // edges take the darker border
      put(6, -1, -1, 0.005);
      put(7, -1, 1, 0.015);
    });
  }
  for (const mesh of L.ribbons) {
    mesh.geometry.attributes.position.needsUpdate = true;
    mesh.geometry.attributes.uv.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  }
}

function sync(sim, camera, size, hitsRef) {
  for (const L of sim.lanyards) {
    L.group.position.copy(L.pos);
    L.group.quaternion.copy(L.q);
    const pts = L.curve.points;
    for (let k = 0; k < N - 1; k++) pts[k].copy(L.x[k]);
    pts[N - 1].copy(L.hang).applyQuaternion(L.q).add(L.pos);

    // How far the card has turned, unwrapped, so the strap winds and unwinds with it.
    fwd.set(0, 0, 1).applyQuaternion(L.q);
    const yaw = Math.atan2(fwd.x, fwd.z);
    if (Math.hypot(fwd.x, fwd.z) > 0.35) L.twist += wrapAngle(yaw - L.lastYaw);
    L.lastYaw = yaw;
    cardX.set(1, 0, 0).applyQuaternion(L.q);

    let len = 0;
    for (let k = 1; k < N; k++) len += pts[k].distanceTo(pts[k - 1]);
    L.pinch += (clamp((len / (L.rest * (N - 1)) - 1.02) * 1.7, 0, 0.55) - L.pinch) * 0.25;
    layRibbons(L);

    // Keep the badge's hit box over it, clip and all.
    const el = hitsRef.current[L.i];
    if (!el) continue;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const [sx, sy] of [
      [-0.5, -0.5],
      [0.5, -0.5],
      [-0.5, 0.5 + CLIP],
      [0.5, 0.5 + CLIP],
    ]) {
      corner.set(sx * L.cw, sy * L.ch, 0).applyQuaternion(L.q).add(L.pos).project(camera);
      const px = ((corner.x + 1) / 2) * size.width;
      const py = ((1 - corner.y) / 2) * size.height;
      minX = Math.min(minX, px);
      maxX = Math.max(maxX, px);
      minY = Math.min(minY, py);
      maxY = Math.max(maxY, py);
    }
    el.style.transform = `translate(${minX}px, ${minY}px)`;
    el.style.width = `${Math.max(0, maxX - minX)}px`;
    el.style.height = `${Math.max(0, maxY - minY)}px`;
  }
}

function moving(sim) {
  if (sim.grab || breezeAt(sim) > 0) return true;
  return sim.lanyards.some((L) => L.holdUntil > sim.t || L.unspin || L.vel.lengthSq() > 1e-5 || L.ang.lengthSq() > 1e-4);
}

function layoutFor(count, viewport) {
  const { width, height } = viewport;
  const col = width / count;
  const ch = Math.min(col * 0.74 * 1.5, height * 0.5);
  return { width, height, col, ch, cw: ch / 1.5, top: height / 2 + 0.3, floor: -height / 2 + height * 0.12 };
}

/* ---------- scene ---------- */

function Wall({ badges, assets, reduce, ctlRef, hitsRef, liveRef, boxRef }) {
  const { invalidate, get } = useThree();
  const viewport = useThree((s) => s.viewport);
  const simRef = useRef(null);

  useEffect(() => {
    const { camera, gl, scene } = get();
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.3;

    const lay = layoutFor(badges.length, get().viewport);
    const root = new THREE.Group();
    const metal = new THREE.MeshStandardMaterial({ color: "#d4d7dc", metalness: 1, roughness: 0.28 });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(lay.width * 3, lay.height * 3), new THREE.ShadowMaterial({ opacity: 0.1 }));
    wall.position.z = -0.7;
    wall.receiveShadow = true;
    root.add(wall);
    const lanyards = badges.map((b, i) => makeLanyard(i, b, lay, assets, gl, metal, !reduce));
    for (const L of lanyards) root.add(L.group, ...L.ribbons);
    scene.add(root);

    const sim = { lanyards, reduce, t: 0, acc: 0, grab: null, quiet: 0, lastTouch: 0 };
    simRef.current = sim;

    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const plane = new THREE.Plane(new V3(0, 0, 1), 0);
    const hit = new V3();
    const pointAt = (e, z) => {
      const rect = boxRef.current.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      plane.constant = -z;
      return ray.ray.intersectPlane(plane, hit);
    };
    const touch = () => {
      sim.lastTouch = sim.t;
      sim.quiet = 0;
      invalidate();
    };
    const say = (text) => {
      if (liveRef.current) liveRef.current.textContent = text;
    };

    const flip = (i) => {
      const L = lanyards[i];
      if (!L) return;
      L.holdUntil = 0;
      L.face ^= 1;
      // Every flip turns the same way, so each one winds another half-twist into the strap.
      L.clicks = Math.abs(L.twist) < 0.5 ? 1 : L.clicks + 1;
      if (L.clicks >= UNWIND_AFTER) {
        L.clicks = 0;
        L.unspin = true;
        L.unspinT = 0;
        L.face = 0;
        L.targetYaw = 0;
        say(`The ${L.company} strap unwound itself, front side out.`);
      } else {
        L.targetYaw = L.face ? Math.PI : 0;
        L.ang.y += reduce ? 5 : 9;
        say(`${L.company} badge, ${L.face ? "back" : "front"}.`);
      }
      touch();
    };

    ctlRef.current = {
      flip,
      down(i, e) {
        const L = lanyards[i];
        if (!L || sim.grab) return;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {}
        const p = pointAt(e, L.pos.z);
        if (!p) return;
        const local = p.clone().sub(L.pos).applyQuaternion(qInv.copy(L.q).invert());
        local.set(clamp(local.x, -L.cw / 2, L.cw / 2), clamp(local.y, -L.ch / 2, L.ch / 2 + L.ch * CLIP), 0);
        sim.grab = { i, id: e.pointerId, local, z: L.pos.z, target: null, sx: e.clientX, sy: e.clientY, moved: false };
        L.holdUntil = 0;
        touch();
      },
      move(e) {
        const g = sim.grab;
        if (!g || g.id !== e.pointerId) return;
        if (!g.moved && Math.hypot(e.clientX - g.sx, e.clientY - g.sy) > 6) g.moved = true;
        if (!g.moved) return;
        const p = pointAt(e, g.z);
        if (!p) return;
        const { width, height } = get().viewport;
        g.target = p.clone().set(clamp(p.x, -width / 2 + 0.15, width / 2 - 0.15), clamp(p.y, -height / 2 + 0.1, height / 2 - 0.1), g.z);
        touch();
      },
      up(e, cancelled = false) {
        const g = sim.grab;
        if (!g || g.id !== e.pointerId) return;
        sim.grab = null;
        const L = lanyards[g.i];
        // A press that barely moved is a tap, however long it took.
        if (!g.moved && !cancelled) flip(g.i);
        else {
          const v = L.vel.length();
          if (v > 8) L.vel.multiplyScalar(8 / v);
          const a = L.ang.length();
          if (a > 8) L.ang.multiplyScalar(8 / a);
        }
        touch();
      },
    };
    invalidate();

    return () => {
      ctlRef.current = null;
      simRef.current = null;
      scene.remove(root);
      root.traverse((o) => {
        if (!o.isMesh) return;
        o.geometry.dispose();
        for (const m of [].concat(o.material)) {
          m.map?.dispose();
          m.dispose();
        }
      });
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [badges, assets, reduce, ctlRef, liveRef, boxRef, invalidate, get]);

  // A wider or narrower stage moves the anchors; everything hanging from them comes along.
  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;
    const lay = layoutFor(sim.lanyards.length, viewport);
    for (const L of sim.lanyards) {
      const dx = -lay.width / 2 + lay.col * (L.i + 0.5) - L.anchor.x;
      for (const v of [L.anchor, ...L.x, ...L.prev, L.pos, L.prevPos]) v.x += dx;
    }
    sim.quiet = 0;
    invalidate();
  }, [viewport, invalidate]);

  useFrame((state, delta) => {
    const sim = simRef.current;
    if (!sim) return;
    sim.acc = Math.min(sim.acc + Math.min(delta, 1 / 20), MAX_STEPS * H);
    while (sim.acc >= H) {
      step(sim, H);
      sim.acc -= H;
    }
    sync(sim, state.camera, state.size, hitsRef);
    sim.quiet = moving(sim) ? 0 : sim.quiet + delta;
    // Settled: stop drawing until something moves it.
    if (sim.quiet < 0.5) state.invalidate();
  });

  const reach = Math.max(viewport.width, viewport.height);
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[-2.5, 4, 7]}
        intensity={1.15}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-left={-reach}
        shadow-camera-right={reach}
        shadow-camera-top={reach}
        shadow-camera-bottom={-reach}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
      />
    </>
  );
}

/* ---------- assets ---------- */

async function loadImage(src) {
  const img = new Image();
  img.src = src;
  try {
    await img.decode();
    return img;
  } catch {
    return null;
  }
}

// Fonts must be ready before the canvases are drawn, or the badges print in a fallback face.
async function loadAssets() {
  const body = getComputedStyle(document.body).fontFamily;
  const mono = plexMono.style.fontFamily;
  await Promise.all(
    ["500", "600"].map((w) => `${w} 40px ${mono}`).concat(["500", "600", "700", "800"].map((w) => `${w} 40px ${body}`)).map((f) => document.fonts.load(f).catch(() => {})),
  );
  const logos = new Map(await Promise.all(BADGES.map(async (b) => [b.company, await loadImage(b.logo)])));
  return { fonts: { body, mono }, logos };
}

// How many badges fit across the stage.
function countFor(width) {
  if (width < 520) return 2;
  if (width < 760) return 3;
  if (width < 960) return 4;
  return BADGES.length;
}

export default function LanyardWall({ reduceMotion = false }) {
  const boxRef = useRef(null);
  const ctlRef = useRef(null);
  const hitsRef = useRef([]);
  const liveRef = useRef(null);
  const [dims, setDims] = useState(null);
  const [assets, setAssets] = useState(null);

  useEffect(() => {
    let alive = true;
    loadAssets().then((a) => alive && setAssets(a));
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDims((d) => (d && d.width === width && d.height === height ? d : { width, height }));
    });
    observer.observe(boxRef.current);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, []);

  const count = dims ? countFor(dims.width) : 0;
  const badges = useMemo(() => BADGES.slice(0, count), [count]);

  return (
    <div ref={boxRef} className="absolute inset-0">
      {assets && count > 0 && (
        <Canvas
          // A new count, or a new stage height, hangs a fresh wall.
          key={`${count}-${Math.round(dims.height)}`}
          frameloop="demand"
          shadows="soft"
          flat
          dpr={[1, 2]}
          camera={{ fov: 30, position: [0, 0, 10], near: 0.1, far: 50 }}
          gl={{ alpha: true, antialias: true }}
          // The badges' own hit boxes take the pointer, so the page still scrolls under the rest of the stage.
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <Wall badges={badges} assets={assets} reduce={reduceMotion} ctlRef={ctlRef} hitsRef={hitsRef} liveRef={liveRef} boxRef={boxRef} />
        </Canvas>
      )}
      {badges.map((b, i) => (
        <button
          key={b.company}
          ref={(el) => {
            hitsRef.current[i] = el;
          }}
          type="button"
          aria-label={`${b.company} badge: ${b.role}, ${b.period}. Press to turn it over.`}
          className="absolute left-0 top-0 h-0 w-0 cursor-grab touch-none rounded-[12px] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] focus-visible:ring-offset-2 active:cursor-grabbing"
          onPointerDown={(e) => ctlRef.current?.down(i, e)}
          onPointerMove={(e) => ctlRef.current?.move(e)}
          onPointerUp={(e) => ctlRef.current?.up(e)}
          onPointerCancel={(e) => ctlRef.current?.up(e, true)}
          // Pointer taps flip on pointerup; this is the keyboard's Enter and Space.
          onClick={(e) => e.detail === 0 && ctlRef.current?.flip(i)}
        />
      ))}
      <p ref={liveRef} aria-live="polite" className="sr-only" />
    </div>
  );
}
