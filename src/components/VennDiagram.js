"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { playPopSound } from "./SoundEffects";

const DOMAINS = {
  core: {
    id: "core",
    name: "SATYA Core",
    badge: "Convergence",
    title: "AI + Design Convergence",
    description:
      "Operating at the bleeding edge where craft, fullstack engineering, and generative models meet. Building sovereign tools and design-first AI systems that remove friction between human intent and running software.",
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
      "Obsessive focus on typography, spatial balance, micro-interactions, and design systems. Translating ambiguous human problems into intuitive, tactile, and memorable digital artifacts.",
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
      "Writing resilient, high-performance software with clean paradigms. From Dart/Flutter desktop runtimes and WebAssembly layout engines to robust web architectures and security tooling.",
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
      "Architecting end-to-end generative media workflows, LLM orchestration, model evaluations, and automation pipelines that turn cutting-edge AI research into production utilities.",
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
      "Eliminating the gap between design mockups and production code. Engineering component libraries with Radix primitives, Tailwind CSS, accessible states, and sub-pixel alignment.",
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
      "Where visual imagination meets synthetic generation. Building creative canvases with text-to-vector engines, automated video synthesis (Veo 3), and custom diffusion pipelines.",
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
      "Designing autonomous agent tools, Model Context Protocol (MCP) servers, background queues, and reliable pipelines that enable AI models to interface with real software environments.",
    companies: [
      { name: "NxtWave", logo: "/images/nxtwave-logo.svg", role: "Model Pipelines & Tooling" },
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Background Task Queues" },
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "Autonomous Automation" },
      { name: "APSPCL", logo: "/images/apspcl-logo.svg", role: "Data Infrastructure" },
    ],
  },
};

export default function VennDiagram() {
  const [activeDomain, setActiveDomain] = useState("core");
  const [hoveredCompany, setHoveredCompany] = useState(null);
  const current = DOMAINS[activeDomain] || DOMAINS.core;

  const selectDomain = (id) => {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-20 items-center">
        
        {/* =========================================================
            LEFT COLUMN: "me in venn" annotation + Venn Diagram
           ========================================================= */}
        <div className="relative w-full flex items-center justify-center">
          {/* Handwritten Annotation "me in venn" with curved arrow pointing to diagram */}
          <div className="hidden sm:flex absolute -left-2 md:-left-8 lg:-left-14 top-4 lg:top-8 flex-col items-end z-20 pointer-events-none select-none">
            <span
              className="text-2xl lg:text-3xl text-[#515154] leading-tight"
              style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic" }}
            >
              me in
            </span>
            <span
              className="text-2xl lg:text-3xl text-[#515154] leading-tight -mt-1 mr-2"
              style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic" }}
            >
              venn
            </span>
            <svg
              width="58"
              height="38"
              viewBox="0 0 58 38"
              fill="none"
              className="text-[#6e6e73] mt-0.5 mr-0.5"
            >
              <path
                d="M6 6 C 20 6, 38 20, 52 26"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M44 20 L 52 26 L 43 30"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* Mobile minimal annotation */}
          <div className="flex sm:hidden absolute top-0 left-0 items-center gap-2 z-20 pointer-events-none">
            <span
              className="text-xl text-[#515154]"
              style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic" }}
            >
              me in venn
            </span>
            <svg width="24" height="16" viewBox="0 0 24 16" fill="none" className="text-[#6e6e73]">
              <path d="M2 8 L 20 8 M 14 3 L 20 8 L 14 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Minimal Architectural Venn Diagram */}
          <div className="relative w-full max-w-[460px] sm:max-w-[490px] lg:max-w-[510px] aspect-[600/570] select-none mx-auto lg:mx-0">
            <svg
              viewBox="20 20 600 570"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <filter id="brush-filter" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <filter id="brush-filter-subtle" x="-15%" y="-15%" width="130%" height="130%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>

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
                  filter="url(#brush-filter)"
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
                  filter="url(#brush-filter)"
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
                  filter="url(#brush-filter)"
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
                  fill="#ffffff"
                  stroke="#111111"
                  strokeWidth="2"
                  filter="url(#brush-filter-subtle)"
                  className="transition-transform duration-200 group-hover/center:scale-105"
                  style={{ transformOrigin: "320px 280px" }}
                />
                {/* Satya's face at the core. The blob is white so the black hair keeps its outline. */}
                <title>Satya</title>
                <image
                  href="/images/hero/SVG/vector-avatar.png"
                  x="287"
                  y="247"
                  width="66"
                  height="66"
                  preserveAspectRatio="xMidYMid meet"
                  className="pointer-events-none transition-transform duration-200 group-hover/center:scale-105"
                  style={{ transformOrigin: "320px 280px" }}
                />
              </g>
            </svg>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: Title + Description + 4 Company Circles
           ========================================================= */}
        <div className="flex flex-col justify-center max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >
              {/* Domain Heading */}
              <h3 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.03em] text-[#111111] leading-[1.12]">
                {current.title}
              </h3>

              {/* Domain Description */}
              <p className="mt-4 text-base sm:text-lg text-[#515154] leading-relaxed font-normal">
                {current.description}
              </p>

              {/* Row of 4 Circular Company Logos matching user sketch ○ ○ ○ ○ */}
              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-3.5 sm:gap-4.5">
                  {current.companies.map((company, idx) => (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredCompany(company)}
                      onMouseLeave={() => setHoveredCompany(null)}
                      className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-black/[0.08] p-2.5 sm:p-3 flex items-center justify-center shadow-2xs hover:scale-110 hover:border-black/25 hover:shadow-xs transition-all duration-200 cursor-pointer"
                      title={`${company.name} — ${company.role}`}
                    >
                      <Image
                        src={company.logo}
                        alt={company.name}
                        width={36}
                        height={36}
                        className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-200"
                      />
                    </div>
                  ))}
                </div>

                {/* Company Role Micro-label */}
                <div className="h-5 flex items-center">
                  <p className="text-xs text-[#6e6e73] tracking-tight transition-opacity duration-200">
                    {hoveredCompany ? (
                      <span>
                        <strong className="text-[#111111] font-medium">{hoveredCompany.name}</strong> — {hoveredCompany.role}
                      </span>
                    ) : (
                      <span className="text-[#8e8e93]">Hover a company to inspect role</span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
