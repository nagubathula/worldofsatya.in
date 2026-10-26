"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { playPopSound } from "./SoundEffects";

const DOMAINS = {
  core: {
    id: "core",
    name: "SATYA Core",
    badge: "Convergence",
    title: "Where design, code, and AI meet",
    description:
      "I work where design, fullstack engineering, and generative AI overlap: designing products, building them, and wiring in the AI that makes them useful.",
    companies: [
      { name: "NxtWave", logo: "/images/nxtwave-logo.svg", role: "Generative AI Engineer & Creative Lead" },
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Product Engineer" },
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "Product Engineer" },
      { name: "APSPCL", logo: "/images/apspcl-logo.svg", role: "Product & Design Engineer" },
    ],
  },
  designer: {
    id: "designer",
    name: "Designer",
    badge: "UI / UX · Typography",
    title: "Product & Visual Systems",
    description:
      "Typography, layout, micro-interactions, and design systems. Turning unclear problems into interfaces people find easy to use.",
    companies: [
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Product Design & Branding" },
      { name: "Redantio", logo: "/images/redantio-icon.png", role: "Brand Identity & UI Sprint" },
      { name: "APSPCL", logo: "/images/apspcl-logo.svg", role: "GovTech Information Architecture" },
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "Design Systems & Storybook" },
    ],
  },
  engineer: {
    id: "engineer",
    name: "Engineer",
    badge: "Fullstack · Hardware",
    title: "Fullstack & Systems Engineering",
    description:
      "Fast, maintainable software, from Flutter desktop apps and WebAssembly layout engines to web platforms and security tooling.",
    companies: [
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "Frontend & Architecture" },
      { name: "APSPCL", logo: "/images/apspcl-logo.svg", role: "Fullstack Web Infrastructure" },
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Component Engineering" },
      { name: "NxtWave", logo: "/images/nxtwave-logo.svg", role: "Systems & Infrastructure" },
    ],
  },
  ai: {
    id: "ai",
    name: "AI",
    badge: "GenAI · Pipelines",
    title: "Generative AI & Model Pipelines",
    description:
      "End-to-end generative media workflows, LLM orchestration, model evaluation, and automation pipelines that run in production.",
    companies: [
      { name: "NxtWave", logo: "/images/nxtwave-logo.svg", role: "Generative AI Lead" },
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Automated Data Systems" },
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "AI Workflow Exploration" },
      { name: "APSPCL", logo: "/images/apspcl-logo.svg", role: "Digital Infrastructure" },
    ],
  },
  "design-eng": {
    id: "design-eng",
    name: "Design Eng",
    badge: "Design + Code",
    title: "Design Engineering",
    description:
      "Closing the gap between design files and production code: component libraries built with Radix primitives and Tailwind CSS, with accessible states and pixel-accurate layout.",
    companies: [
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "Chaya UI Design System" },
      { name: "Redantio", logo: "/images/redantio-icon.png", role: "Design-to-Code Velocity" },
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Reusable Component Design" },
      { name: "APSPCL", logo: "/images/apspcl-logo.svg", role: "Accessible Design Tokens" },
    ],
  },
  "creative-ai": {
    id: "creative-ai",
    name: "Creative AI",
    badge: "Design + AI",
    title: "Creative AI & Media",
    description:
      "Creative tools built on generation: text-to-vector canvases, automated video with Veo 3, and custom diffusion pipelines.",
    companies: [
      { name: "NxtWave", logo: "/images/nxtwave-logo.svg", role: "Generative AI Video & Creative" },
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Synthetic Brand Assets" },
      { name: "Redantio", logo: "/images/redantio-icon.png", role: "Creative Prototyping" },
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "Interactive Visuals" },
    ],
  },
  "ai-systems": {
    id: "ai-systems",
    name: "AI Systems",
    badge: "Code + AI",
    title: "AI Systems & Automation",
    description:
      "Agent tooling, Model Context Protocol (MCP) servers, background queues, and pipelines that let AI models work with real software.",
    companies: [
      { name: "NxtWave", logo: "/images/nxtwave-logo.svg", role: "Model Pipelines & Tooling" },
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Background Task Queues" },
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "Autonomous Automation" },
      { name: "APSPCL", logo: "/images/apspcl-logo.svg", role: "Data Infrastructure" },
    ],
  },
};

// The hover card's size, for keeping it on screen beside the cursor.
const CARD_W = 320;
const CARD_H = 270;
const CURSOR_GAP = 18;
// Breathing room between the face and the notch the card makes for it.
const NOTCH_GAP = 8;

// The face (HomeFace) docks in the Venn's centre on its own layer. Rather than
// slide over or under it, the card bends around it: a round notch, kept in
// step with both every frame.
function useFaceNotch(ref, active) {
  useEffect(() => {
    if (!active) return;
    let frame;
    const track = () => {
      const el = ref.current;
      const face = document.querySelector("[data-home-face]");
      if (el && face) {
        const card = el.getBoundingClientRect();
        const f = face.getBoundingClientRect();
        // Mask coordinates are the card's own, before its enter/exit scale.
        const scale = card.width / el.offsetWidth || 1;
        const r = f.width / 2 + NOTCH_GAP;
        const cx = (f.left + f.width / 2 - card.left) / scale;
        const cy = (f.top + f.height / 2 - card.top) / scale;
        // Distance from the face's centre to the card's nearest point.
        const dx = Math.max(-cx, 0, cx - el.offsetWidth);
        const dy = Math.max(-cy, 0, cy - el.offsetHeight);
        const notched = f.width > 0 && Math.hypot(dx, dy) < r;
        const mask = notched
          ? `radial-gradient(circle at ${cx}px ${cy}px, transparent ${r}px, #000 ${r + 0.75}px)`
          : "none";
        el.style.maskImage = mask;
        el.style.webkitMaskImage = mask;
        flowAround(el.querySelector("[data-notch-float]"), el, notched, cx, cy, r);
      }
      frame = requestAnimationFrame(track);
    };
    frame = requestAnimationFrame(track);
    return () => cancelAnimationFrame(frame);
  }, [ref, active]);
}

// The card's border and padding: the float lives in its content box.
const CARD_INSET = 21;
// Space between the notch and the words that flow around it.
const FLOW_GAP = 6;

// The card's contents make way for the notch rather than vanish under it: an
// empty float, shaped like the notch, that text and logos wrap around. It sits
// on whichever side the face is nearer, and reaches down only as far as the notch.
function flowAround(float, card, notched, cx, cy, r) {
  if (!float) return;
  const width = card.offsetWidth - CARD_INSET * 2;
  const x = cx - CARD_INSET;
  const y = cy - CARD_INSET;
  const reach = r + FLOW_GAP;
  const left = x < width / 2;
  const floatW = left ? x + reach : width - (x - reach);
  const floatH = y + reach;
  if (!notched || floatW <= 0 || floatH <= 0) {
    float.style.width = "0px";
    float.style.height = "0px";
    float.style.shapeOutside = "none";
    return;
  }
  float.style.float = left ? "left" : "right";
  float.style.width = `${Math.min(floatW, width)}px`;
  float.style.height = `${floatH}px`;
  float.style.shapeOutside = `circle(${reach}px at ${left ? x : x - (width - floatW)}px ${y}px)`;
}

// The notch may bite only the card's left or right edge. In the middle it
// squeezes the words into strips either side of the face; in the top or bottom
// edge it shoves a single line aside. So whenever the face reaches into the
// card's top, middle or bottom, the card slides sideways, the shorter way that
// stays on screen, until the face's centre sits on its edge: half a face in
// the card, with the words flowing round it.
function clearOfFace(x, y, height) {
  const face = document.querySelector("[data-home-face]")?.getBoundingClientRect();
  if (!face || face.width === 0) return [x, y];
  const fx = face.left + face.width / 2;
  const fy = face.top + face.height / 2;
  const reach = face.width / 2 + NOTCH_GAP;
  const overlapsY = fy > y - reach && fy < y + height + reach;
  if (!overlapsY || fx <= x || fx >= x + CARD_W) return [x, y];
  const fits = (nx) => nx >= 12 && nx + CARD_W <= window.innerWidth - 12;
  const moves = [fx, fx - CARD_W].filter(fits);
  if (!moves.length) return [x, y];
  const nx = moves.reduce((best, m) => (Math.abs(m - x) < Math.abs(best - x) ? m : best));
  return [nx, y];
}

// What a region of the Venn stands for: title, description and the companies
// where that work happened. Shown on demand, not beside the diagram.
// `flat` drops the box shadow, for when a wrapper casts one that follows a notch.
function DomainCard({ domain, flat = false }) {
  return (
    <div className={`rounded-3xl border border-black/[0.08] bg-white/95 p-5 backdrop-blur-xl ${flat ? "" : "shadow-[0_18px_48px_rgba(0,0,0,0.10)]"}`}>
      {/* Shaped by flowAround while the card meets the face; empty otherwise. */}
      <div data-notch-float aria-hidden="true" className="h-0 w-0" />
      <h3 className="text-xl font-semibold leading-tight tracking-[-0.03em] text-[#111111]">{domain.title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-[#515154]">{domain.description}</p>
      {/* Inline logos, not a flex row, so they can flow around the notch like words. */}
      <div className="mt-4 -mb-2 leading-none">
        {domain.companies.map((company) => (
          <div
            key={company.name}
            className="mb-2 mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] bg-white p-2 align-middle"
          >
            <Image src={company.logo} alt="" width={24} height={24} className="h-full w-full object-contain" />
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-[#86868b]">{domain.companies.map((company) => company.name).join(" · ")}</p>
    </div>
  );
}

export default function VennDiagram() {
  const [activeDomain, setActiveDomain] = useState("core");
  // The card shows only while a region is hovered (or, on a phone, tapped).
  const [showCard, setShowCard] = useState(false);
  const [touch, setTouch] = useState(false);
  const current = DOMAINS[activeDomain] || DOMAINS.core;
  const cardRef = useRef(null);
  // Where the cursor wants the card, before it makes way for the face.
  const cursorSpot = useRef(null);
  useFaceNotch(cardRef, !touch && showCard);

  // The card trails the cursor on a soft spring.
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const springX = useSpring(cardX, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(cardY, { stiffness: 500, damping: 40, mass: 0.4 });

  // The face moves without the mouse (it rides the scroll into the Venn), so
  // keep the card clear of it every frame, not just on pointer moves.
  useEffect(() => {
    if (touch || !showCard) return;
    let frame;
    const keepClear = () => {
      if (cursorSpot.current) {
        const [x, y] = clearOfFace(...cursorSpot.current, cardRef.current?.offsetHeight || CARD_H);
        if (x !== cardX.get()) cardX.set(x);
        if (y !== cardY.get()) cardY.set(y);
      }
      frame = requestAnimationFrame(keepClear);
    };
    frame = requestAnimationFrame(keepClear);
    return () => cancelAnimationFrame(frame);
  }, [touch, showCard, cardX, cardY]);

  useEffect(() => {
    const media = window.matchMedia("(hover: none)");
    const sync = () => setTouch(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  // Beside the cursor, flipped to the other side near the edges of the screen.
  const placeCard = (e, jump) => {
    let x = e.clientX + CURSOR_GAP + CARD_W > window.innerWidth ? e.clientX - CURSOR_GAP - CARD_W : e.clientX + CURSOR_GAP;
    let y = Math.min(Math.max(e.clientY - CARD_H / 2, 12), window.innerHeight - CARD_H - 12);
    cursorSpot.current = [x, y];
    [x, y] = clearOfFace(x, y, cardRef.current?.offsetHeight || CARD_H);
    cardX.set(x);
    cardY.set(y);
    if (jump) {
      springX.jump(x);
      springY.jump(y);
    }
  };

  const selectDomain = (id) => {
    setShowCard(true);
    setActiveDomain((prev) => {
      if (prev !== id) {
        try {
          playPopSound(540, 0.03);
        } catch {}
        return id;
      }
      return prev;
    });
  };

  return (
    <section aria-label="Me in Venn" className="w-full py-4 sm:py-8 select-none">
      <div className="flex flex-col items-center">
        {/* =========================================================
            The Venn Diagram, on its own. Hovering a region shows what it means.
           ========================================================= */}
        <div
          className="relative w-full flex items-center justify-center"
          onPointerEnter={(e) => e.pointerType === "mouse" && placeCard(e, true)}
          onPointerMove={(e) => e.pointerType === "mouse" && placeCard(e, false)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setShowCard(false)}
        >
          {/* Minimal Architectural Venn Diagram */}
          <div className="relative w-full max-w-[460px] sm:max-w-[490px] lg:max-w-[510px] aspect-[600/570] select-none mx-auto">
            <svg
              viewBox="20 20 600 570"
              className="w-full h-full overflow-visible"
            >

              {/* 1. Designer (Top Left) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => selectDomain("designer")}
                onMouseEnter={() => selectDomain("designer")}
              >
                <path
                  d="M 402.9 225.0 C 402.8 247.5, 397.0 272.0, 387.7 292.4 C 378.4 312.7, 363.1 331.5, 347.1 347.1 C 331.1 362.7, 312.1 376.4, 291.7 386.1 C 271.4 395.8, 247.7 404.0, 225.0 405.1 C 202.3 406.3, 176.1 402.4, 155.4 393.0 C 134.7 383.7, 115.1 366.3, 101.0 349.0 C 87.0 331.6, 78.0 309.4, 71.0 288.8 C 64.0 268.1, 60.3 246.7, 59.2 225.0 C 58.1 203.3, 58.1 179.9, 64.2 158.4 C 70.4 136.9, 80.9 113.0, 96.1 96.1 C 111.2 79.1, 133.8 64.4, 155.3 56.6 C 176.7 48.8, 202.5 47.7, 225.0 49.4 C 247.5 51.1, 270.1 57.9, 290.6 66.7 C 311.0 75.6, 331.3 87.3, 347.6 102.4 C 364.0 117.4, 379.2 136.9, 388.5 157.3 C 397.2 177.7, 400.3 202.5, 400.2 225.0 Z"
                  fill={activeDomain === "designer" ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.016)"}
                  stroke={activeDomain === "designer" ? "#111111" : "rgba(0,0,0,0.22)"}
                  strokeWidth={activeDomain === "designer" ? "2.75" : "1.5"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />
              </g>

              {/* 2. Engineer (Top Right) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => selectDomain("engineer")}
                onMouseEnter={() => selectDomain("engineer")}
              >
                <path
                  d="M 582.8 225.0 C 581.0 246.8, 575.0 267.8, 567.2 288.0 C 559.5 308.3, 550.3 329.1, 536.4 346.4 C 522.6 363.7, 504.4 381.8, 484.1 391.9 C 463.9 402.0, 437.8 407.8, 415.0 407.1 C 392.2 406.5, 367.7 398.2, 347.4 388.1 C 327.1 378.1, 308.7 362.9, 293.2 346.8 C 277.6 330.8, 263.3 312.0, 254.0 291.7 C 244.7 271.4, 237.5 247.3, 237.2 225.0 C 237.0 202.7, 242.9 177.7, 252.5 157.7 C 262.2 137.7, 278.7 119.7, 295.1 105.1 C 311.5 90.5, 331.0 79.4, 350.9 70.3 C 370.9 61.3, 392.6 53.3, 415.0 50.9 C 437.4 48.4, 463.4 48.4, 485.2 55.6 C 506.9 62.9, 530.1 77.4, 545.6 94.4 C 561.1 111.3, 572.0 135.6, 578.2 157.4 C 584.4 179.2, 584.8 203.2, 582.9 225.0 Z"
                  fill={activeDomain === "engineer" ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.016)"}
                  stroke={activeDomain === "engineer" ? "#111111" : "rgba(0,0,0,0.22)"}
                  strokeWidth={activeDomain === "engineer" ? "2.75" : "1.5"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />
              </g>

              {/* 3. AI (Bottom Center) */}
              <g
                className="cursor-pointer transition-all duration-200"
                onClick={() => selectDomain("ai")}
                onMouseEnter={() => selectDomain("ai")}
              >
                <path
                  d="M 494.4 390.0 C 494.8 412.5, 492.4 437.3, 484.0 458.0 C 475.7 478.6, 460.6 499.3, 444.1 514.1 C 427.6 528.9, 405.6 539.4, 384.9 546.8 C 364.3 554.1, 342.0 557.4, 320.0 558.1 C 298.0 558.9, 274.7 557.9, 253.1 551.4 C 231.6 545.0, 207.7 534.7, 190.5 519.5 C 173.3 504.3, 157.9 481.9, 150.1 460.4 C 142.4 438.8, 141.7 412.4, 144.1 390.0 C 146.5 367.6, 155.3 345.5, 164.7 325.7 C 174.2 305.9, 186.3 287.2, 201.0 271.0 C 215.8 254.9, 233.4 238.6, 253.2 228.8 C 273.0 218.9, 297.6 211.9, 320.0 211.7 C 342.4 211.4, 367.0 218.0, 387.4 227.3 C 407.8 236.7, 426.6 251.8, 442.3 267.7 C 458.0 283.7, 473.0 302.7, 481.7 323.0 C 491.3 343.4, 499.8 367.5, 500.2 390.0 Z"
                  fill={activeDomain === "ai" ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.016)"}
                  stroke={activeDomain === "ai" ? "#111111" : "rgba(0,0,0,0.22)"}
                  strokeWidth={activeDomain === "ai" ? "2.75" : "1.5"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />
              </g>

              {/* Outer Region Labels */}
              <g
                className="cursor-pointer"
                onClick={() => selectDomain("designer")}
                onMouseEnter={() => selectDomain("designer")}
              >
                <text
                  x="145"
                  y="165"
                  textAnchor="middle"
                  className={`font-sans text-[12px] uppercase tracking-[0.14em] transition-all duration-200 ${
                    activeDomain === "designer" ? "fill-[#111111] font-bold" : "fill-[#333333] font-semibold"
                  }`}
                >
                  DESIGNER
                </text>
                <text
                  x="145"
                  y="184"
                  textAnchor="middle"
                  className="font-mono text-[9px] uppercase tracking-wider fill-[#8e8e93]"
                >
                  UI / UX · Typography
                </text>
              </g>

              <g
                className="cursor-pointer"
                onClick={() => selectDomain("engineer")}
                onMouseEnter={() => selectDomain("engineer")}
              >
                <text
                  x="495"
                  y="165"
                  textAnchor="middle"
                  className={`font-sans text-[12px] uppercase tracking-[0.14em] transition-all duration-200 ${
                    activeDomain === "engineer" ? "fill-[#111111] font-bold" : "fill-[#333333] font-semibold"
                  }`}
                >
                  ENGINEER
                </text>
                <text
                  x="495"
                  y="184"
                  textAnchor="middle"
                  className="font-mono text-[9px] uppercase tracking-wider fill-[#8e8e93]"
                >
                  Fullstack · Hardware
                </text>
              </g>

              <g
                className="cursor-pointer"
                onClick={() => selectDomain("ai")}
                onMouseEnter={() => selectDomain("ai")}
              >
                <text
                  x="320"
                  y="475"
                  textAnchor="middle"
                  className={`font-sans text-[12px] uppercase tracking-[0.14em] transition-all duration-200 ${
                    activeDomain === "ai" ? "fill-[#111111] font-bold" : "fill-[#333333] font-semibold"
                  }`}
                >
                  AI
                </text>
                <text
                  x="320"
                  y="494"
                  textAnchor="middle"
                  className="font-mono text-[9px] uppercase tracking-wider fill-[#8e8e93]"
                >
                  GenAI · Model Pipelines
                </text>
              </g>

              {/* Intersection 1: Design + Engineer (Top Center) */}
              <g
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
                style={{ transformOrigin: "320px 147px" }}
                onClick={() => selectDomain("design-eng")}
                onMouseEnter={() => selectDomain("design-eng")}
              >
                <rect
                  x="268"
                  y="133"
                  width="104"
                  height="28"
                  rx="14"
                  fill={activeDomain === "design-eng" ? "#111111" : "#ffffff"}
                  stroke={activeDomain === "design-eng" ? "#111111" : "rgba(0,0,0,0.14)"}
                  strokeWidth="1"
                  className="transition-all duration-200"
                />
                <circle
                  cx="282"
                  cy="147"
                  r="3"
                  fill={activeDomain === "design-eng" ? "#ffffff" : "rgba(0,0,0,0.35)"}
                />
                <text
                  x="324"
                  y="151"
                  textAnchor="middle"
                  className={`font-mono text-[9px] font-semibold uppercase tracking-wider pointer-events-none transition-colors duration-200 ${
                    activeDomain === "design-eng" ? "fill-white" : "fill-[#222222]"
                  }`}
                >
                  Design Eng
                </text>
              </g>

              {/* Intersection 2: Design + AI (Bottom Left) */}
              <g
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
                style={{ transformOrigin: "232px 338px" }}
                onClick={() => selectDomain("creative-ai")}
                onMouseEnter={() => selectDomain("creative-ai")}
              >
                <rect
                  x="180"
                  y="324"
                  width="104"
                  height="28"
                  rx="14"
                  fill={activeDomain === "creative-ai" ? "#111111" : "#ffffff"}
                  stroke={activeDomain === "creative-ai" ? "#111111" : "rgba(0,0,0,0.14)"}
                  strokeWidth="1"
                  className="transition-all duration-200"
                />
                <circle
                  cx="194"
                  cy="338"
                  r="3"
                  fill={activeDomain === "creative-ai" ? "#ffffff" : "rgba(0,0,0,0.35)"}
                />
                <text
                  x="236"
                  y="342"
                  textAnchor="middle"
                  className={`font-mono text-[9px] font-semibold uppercase tracking-wider pointer-events-none transition-colors duration-200 ${
                    activeDomain === "creative-ai" ? "fill-white" : "fill-[#222222]"
                  }`}
                >
                  Creative AI
                </text>
              </g>

              {/* Intersection 3: Engineer + AI (Bottom Right) */}
              <g
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
                style={{ transformOrigin: "408px 338px" }}
                onClick={() => selectDomain("ai-systems")}
                onMouseEnter={() => selectDomain("ai-systems")}
              >
                <rect
                  x="356"
                  y="324"
                  width="104"
                  height="28"
                  rx="14"
                  fill={activeDomain === "ai-systems" ? "#111111" : "#ffffff"}
                  stroke={activeDomain === "ai-systems" ? "#111111" : "rgba(0,0,0,0.14)"}
                  strokeWidth="1"
                  className="transition-all duration-200"
                />
                <circle
                  cx="370"
                  cy="338"
                  r="3"
                  fill={activeDomain === "ai-systems" ? "#ffffff" : "rgba(0,0,0,0.35)"}
                />
                <text
                  x="412"
                  y="342"
                  textAnchor="middle"
                  className={`font-mono text-[9px] font-semibold uppercase tracking-wider pointer-events-none transition-colors duration-200 ${
                    activeDomain === "ai-systems" ? "fill-white" : "fill-[#222222]"
                  }`}
                >
                  AI Systems
                </text>
              </g>

              {/* Center: The Core (SATYA) */}
              <g
                className="cursor-pointer group/center"
                onClick={() => selectDomain("core")}
                onMouseEnter={() => selectDomain("core")}
              >
                {/* Active Outer Ring */}
                {activeDomain === "core" && (
                  <path
                    d="M 374.0 280.0 C 373.8 295.2, 369.3 310.2, 358.3 321.2 C 347.3 332.2, 332.2 336.8, 320.0 336.8 C 307.8 336.8, 292.7 332.2, 281.7 321.2 C 270.7 310.2, 266.2 295.2, 266.0 280.0 C 265.8 264.8, 270.7 249.8, 281.7 238.8 C 292.7 227.8, 307.8 223.2, 320.0 223.2 C 332.2 223.2, 347.3 227.8, 358.3 238.8 C 369.3 249.8, 374.2 264.8, 374.0 280.0 Z"
                    fill="none"
                    stroke="#111111"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="animate-spin-slow"
                    style={{ transformOrigin: "320px 280px" }}
                  />
                )}
                <path
                  d="M 367.7 280.0 C 367.2 285.8, 363.9 292.1, 360.8 296.9 C 357.6 301.7, 353.1 305.4, 348.9 308.9 C 344.7 312.4, 340.6 315.5, 335.8 318.0 C 330.9 320.6, 325.5 323.3, 320.0 324.0 C 314.5 324.6, 307.8 324.1, 302.6 322.0 C 297.4 319.9, 292.3 315.7, 288.6 311.4 C 284.9 307.2, 282.3 301.7, 280.2 296.5 C 278.1 291.3, 276.4 285.7, 275.9 280.0 C 275.4 274.3, 275.3 267.7, 277.2 262.3 C 279.1 256.8, 282.9 250.9, 287.2 247.2 C 291.6 243.5, 298.0 241.3, 303.5 240.1 C 308.9 238.8, 314.6 239.5, 320.0 239.9 C 325.4 240.3, 330.3 240.9, 335.6 242.4 C 340.9 243.8, 346.8 245.2, 351.6 248.4 C 356.3 251.7, 361.3 256.5, 364.0 261.8 C 366.5 267.1, 367.2 274.2, 366.7 280.0 Z"
                  // Unpainted: the face fills it, so it needs no outline of its own.
                  // Still the hover target, and the socket the site's notch
                  // (HomeFace) sits in while the diagram is in view.
                  fill="transparent"
                  data-venn-core
                />
                <title>Satya</title>
              </g>
            </svg>
          </div>
        </div>

        {/* Phones: a tapped region's card sits under the diagram. */}
        {touch && (
          <AnimatePresence mode="wait">
            {showCard && (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 w-full max-w-md"
              >
                <DomainCard domain={current} />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Mouse: the card follows the cursor while a region is hovered. */}
        <AnimatePresence>
          {!touch && showCard && (
            <motion.div
              key="domain-card"
              aria-live="polite"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ x: springX, y: springY, width: CARD_W }}
              className="pointer-events-none fixed left-0 top-0 z-[60]"
            >
              {/* The shadow is a drop-shadow on the outside, so it follows the notch. */}
              <div className="[filter:drop-shadow(0_18px_32px_rgba(0,0,0,0.10))_drop-shadow(0_2px_6px_rgba(0,0,0,0.05))]">
                <div ref={cardRef}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={current.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      <DomainCard domain={current} flat />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
