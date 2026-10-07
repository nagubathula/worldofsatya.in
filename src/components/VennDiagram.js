"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const DOMAINS = {
  core: {
    id: "core",
    name: "SATYA Core",
    badge: "Convergence",
    title: "AI + Design Convergence :",
    accentColor: "#fbbf24",
    description:
      "Operating at the bleeding edge where craft, fullstack engineering, and generative models meet. Building sovereign tools and design-first AI systems that remove friction between human intent and running software.",
    companies: [
      { name: "NxtWave", logo: "/images/nxtwave-logo.svg", role: "Generative AI Engineer & Creative Lead" },
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Product Engineer" },
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "Product Engineer" },
      { name: "APSPCL", logo: "/images/apspcl-logo.svg", role: "Product & Design Engineer" },
    ],
    projects: [
      {
        title: "OpenWeave",
        tag: "Open Source · AI Canvas",
        desc: "Sovereign vector design editor with native Figma support and AI co-creation.",
        image: "/openweave-app.png",
        link: "https://github.com/nagubathula/OpenWeave",
      },
      {
        title: "NotBad",
        tag: "Desktop App · Flutter",
        desc: "Distraction-free cross-platform Markdown editor where syntax conceals on rest.",
        image: "/notbad-editor.png",
        link: "/works/case-studies/notbad-design",
      },
    ],
  },
  designer: {
    id: "designer",
    name: "Designer",
    badge: "UI / UX · Typography",
    title: "Product & Visual Systems :",
    accentColor: "#0284c7",
    description:
      "Obsessive focus on typography, spatial balance, micro-interactions, and design systems. Translating ambiguous human problems into intuitive, tactile, and memorable digital artifacts.",
    companies: [
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Product Design & Branding" },
      { name: "Redantio", logo: "/images/redantio-icon.png", role: "Brand Identity & UI Sprint" },
      { name: "APSPCL", logo: "/images/apspcl-logo.svg", role: "GovTech Information Architecture" },
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "Design Systems & Storybook" },
    ],
    projects: [
      {
        title: "Redantio",
        tag: "Brand & UI Sprint",
        desc: "Complete startup brand, UI system, and web presence designed in a single 6-hour sprint.",
        image: "/redantio.webp",
        link: "https://hippogriff.medium.com/redantio-designing-a-startup-in-6-hours-4e24a593950f",
      },
      {
        title: "Own Your Bill",
        tag: "Product Design",
        desc: "New-age customizable billing system designed around how people read and share receipts.",
        image: "/ownyourbill.png",
        link: "https://www.figma.com/board/iZoO9T4W3C4RwIUWZRbZsV/Case-Study?node-id=0-1",
      },
    ],
  },
  engineer: {
    id: "engineer",
    name: "Engineer",
    badge: "Fullstack · Hardware",
    title: "Fullstack & Systems :",
    accentColor: "#059669",
    description:
      "Writing resilient, high-performance software with clean paradigms. From Dart/Flutter desktop runtimes and WebAssembly layout engines to robust web architectures and security tooling.",
    companies: [
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "Frontend & Architecture" },
      { name: "APSPCL", logo: "/images/apspcl-logo.svg", role: "Fullstack Web Infrastructure" },
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Component Engineering" },
      { name: "NxtWave", logo: "/images/nxtwave-logo.svg", role: "Systems & Infrastructure" },
    ],
    projects: [
      {
        title: "NotBad",
        tag: "Pure Flutter / Dart",
        desc: "Desktop Markdown engine with custom live span caching, single-instance handoff, and zero drift.",
        image: "/notbad-editor.png",
        link: "/works/case-studies/notbad-design",
      },
      {
        title: "bi0s Hardware",
        tag: "Web Architecture",
        desc: "High-security technical web presence and project showcase for bi0s hardware researchers.",
        image: "/bi0shardware.png",
        link: "https://bi0shardware.com/",
      },
    ],
  },
  ai: {
    id: "ai",
    name: "AI",
    badge: "GenAI · Pipelines",
    title: "Generative AI & Models :",
    accentColor: "#7c3aed",
    description:
      "Architecting end-to-end generative media workflows, LLM orchestration, model evaluations, and automation pipelines that turn cutting-edge AI research into production utilities.",
    companies: [
      { name: "NxtWave", logo: "/images/nxtwave-logo.svg", role: "Generative AI Lead" },
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Automated Data Systems" },
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "AI Workflow Exploration" },
      { name: "APSPCL", logo: "/images/apspcl-logo.svg", role: "Digital Infrastructure" },
    ],
    projects: [
      {
        title: "Zero-Cost Automation",
        tag: "AI Architecture",
        desc: "Processed 5,000+ monthly automated AI tasks using serverless queues and Colab compute for $0/mo.",
        image: "/toothpaste-panel.png",
        link: "/works/case-studies/zero-cost-automation",
      },
      {
        title: "OpenWeave AI Engine",
        tag: "Agent Tooling",
        desc: "90+ AI tools creating and manipulating vector scene graphs from natural conversation.",
        image: "/openweave-app.png",
        link: "https://github.com/nagubathula/OpenWeave",
      },
    ],
  },
  "design-eng": {
    id: "design-eng",
    name: "Design Eng",
    badge: "Design + Code",
    title: "Design Engineering :",
    accentColor: "#0d9488",
    description:
      "Eliminating the gap between design mockups and production code. Engineering component libraries with Radix primitives, Tailwind CSS, accessible states, and sub-pixel alignment.",
    companies: [
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "Chaya UI Design System" },
      { name: "Redantio", logo: "/images/redantio-icon.png", role: "Design-to-Code Velocity" },
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Reusable Component Design" },
      { name: "APSPCL", logo: "/images/apspcl-logo.svg", role: "Accessible Design Tokens" },
    ],
    projects: [
      {
        title: "Chaya UI",
        tag: "Design System",
        desc: "40+ TypeScript & Radix component library engineered for high-density SaaS products.",
        image: "/chaya.avif",
        link: "https://chaya.traboda.com",
      },
      {
        title: "Tailus",
        tag: "UI Kit & Tokens",
        desc: "Composable Tailwind CSS UI kit engineered with modular token architecture.",
        image: "/tailus.png",
        link: "https://www.behance.net/gallery/210333091/Tailus-Ui-Case-Study",
      },
    ],
  },
  "creative-ai": {
    id: "creative-ai",
    name: "Creative AI",
    badge: "Design + AI",
    title: "Creative AI & Media :",
    accentColor: "#db2777",
    description:
      "Where visual imagination meets synthetic generation. Building creative canvases with text-to-vector engines, automated video synthesis (Veo 3), and custom diffusion pipelines.",
    companies: [
      { name: "NxtWave", logo: "/images/nxtwave-logo.svg", role: "Generative AI Video & Creative" },
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Synthetic Brand Assets" },
      { name: "Redantio", logo: "/images/redantio-icon.png", role: "Creative Prototyping" },
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "Interactive Visuals" },
    ],
    projects: [
      {
        title: "OpenWeave",
        tag: "Generative Canvas",
        desc: "Vector canvas that builds, tints, and positions graphic elements through chat.",
        image: "/openweave-app.png",
        link: "https://github.com/nagubathula/OpenWeave",
      },
      {
        title: "Toothpaste",
        tag: "Media Workflow",
        desc: "Direct clipboard-to-timeline Premiere Pro extension with automatic format conversion.",
        image: "/toothpaste-panel-wide.png",
        link: "https://github.com/nagubathula/toothpaste",
      },
    ],
  },
  "ai-systems": {
    id: "ai-systems",
    name: "AI Systems",
    badge: "Code + AI",
    title: "AI Systems & Automation :",
    accentColor: "#d97706",
    description:
      "Designing autonomous agent tools, Model Context Protocol (MCP) servers, background queues, and reliable pipelines that enable AI models to interface with real software environments.",
    companies: [
      { name: "NxtWave", logo: "/images/nxtwave-logo.svg", role: "Model Pipelines & Tooling" },
      { name: "CrestLogic", logo: "/images/crestlogic-icon.svg", role: "Background Task Queues" },
      { name: "Traboda", logo: "/images/traboda-icon.png", role: "Autonomous Automation" },
      { name: "APSPCL", logo: "/images/apspcl-logo.svg", role: "Data Infrastructure" },
    ],
    projects: [
      {
        title: "Zero-Cost Automation",
        tag: "Queue Orchestration",
        desc: "Serverless pipeline handling distributed AI task queues and data streaming.",
        image: "/toothpaste-panel.png",
        link: "/works/case-studies/zero-cost-automation",
      },
      {
        title: "OpenWeave MCP",
        tag: "Model Context Protocol",
        desc: "MCP server allowing Claude Code and agent coders to edit vector files natively.",
        image: "/openweave-app.png",
        link: "https://github.com/nagubathula/OpenWeave",
      },
    ],
  },
};

export default function VennDiagram() {
  const [activeDomain, setActiveDomain] = useState("core");
  const current = DOMAINS[activeDomain] || DOMAINS.core;

  return (
    <section aria-labelledby="who-am-i-heading" className="w-full">
      {/* 2-Column Split Layout matching user mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-start">
        
        {/* =========================================================
            LEFT COLUMN: "Me in a VENN" heading + Spacious Venn SVG
           ========================================================= */}
        <div className="flex flex-col">
          {/* Left Column Header */}
          <div className="mb-6 sm:mb-8">
            <h2
              id="who-am-i-heading"
              className="text-4xl sm:text-5xl font-semibold tracking-[-0.03em] text-[#1d1d1f]"
            >
              Me in a VENN.
            </h2>
            <p
              className="mt-2 text-base sm:text-lg text-[#626267] font-normal"
              style={{ fontFamily: "var(--font-editorial)" }}
            >
              At the exact convergence of Designer, Engineer, and AI.
            </p>
          </div>

          {/* Spacious Venn Diagram (Fills Left Column, No Extra Buttons) */}
          <div className="relative w-full max-w-[540px] aspect-[600/570] select-none mx-auto lg:mx-0">
            <svg
              viewBox="20 20 600 570"
              className="w-full h-full filter drop-shadow-[0_16px_48px_rgba(0,0,0,0.04)]"
            >
              <defs>
                {/* Dynamic circle gradients based on active state */}
                <radialGradient id="grad-designer" cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={activeDomain === "designer" ? 0.38 : 0.26} />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity={activeDomain === "designer" ? 0.18 : 0.11} />
                </radialGradient>
                <radialGradient id="grad-engineer" cx="65%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={activeDomain === "engineer" ? 0.38 : 0.26} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={activeDomain === "engineer" ? 0.18 : 0.11} />
                </radialGradient>
                <radialGradient id="grad-ai" cx="50%" cy="65%" r="65%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity={activeDomain === "ai" ? 0.38 : 0.26} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={activeDomain === "ai" ? 0.18 : 0.11} />
                </radialGradient>
                <radialGradient id="grad-center" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1a1a1e" stopOpacity="0.98" />
                  <stop offset="100%" stopColor="#0a0a0c" stopOpacity="0.95" />
                </radialGradient>
                {/* Drop shadow filters */}
                <filter id="pill-shadow" x="-10%" y="-20%" width="120%" height="150%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.06" />
                </filter>
                <filter id="core-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="6" stdDeviation="8" floodOpacity="0.16" />
                </filter>
              </defs>

              {/* Base Circles (Spacious R=175 geometry) */}
              {/* 1. Designer (Top Left) */}
              <g
                className="cursor-pointer transition-all duration-300 hover:opacity-95"
                onClick={() => setActiveDomain("designer")}
              >
                <circle
                  cx="225"
                  cy="225"
                  r="175"
                  fill="url(#grad-designer)"
                  stroke="#0284c7"
                  strokeWidth={activeDomain === "designer" ? "2.5" : "1.75"}
                  strokeOpacity={activeDomain === "designer" ? "1" : "0.7"}
                  className="transition-all duration-300"
                />
              </g>

              {/* 2. Engineer (Top Right) */}
              <g
                className="cursor-pointer transition-all duration-300 hover:opacity-95"
                onClick={() => setActiveDomain("engineer")}
              >
                <circle
                  cx="415"
                  cy="225"
                  r="175"
                  fill="url(#grad-engineer)"
                  stroke="#059669"
                  strokeWidth={activeDomain === "engineer" ? "2.5" : "1.75"}
                  strokeOpacity={activeDomain === "engineer" ? "1" : "0.7"}
                  className="transition-all duration-300"
                />
              </g>

              {/* 3. AI (Bottom Center) */}
              <g
                className="cursor-pointer transition-all duration-300 hover:opacity-95"
                onClick={() => setActiveDomain("ai")}
              >
                <circle
                  cx="320"
                  cy="390"
                  r="175"
                  fill="url(#grad-ai)"
                  stroke="#7c3aed"
                  strokeWidth={activeDomain === "ai" ? "2.5" : "1.75"}
                  strokeOpacity={activeDomain === "ai" ? "1" : "0.7"}
                  className="transition-all duration-300"
                />
              </g>

              {/* Outer Region Labels */}
              <g
                className="cursor-pointer"
                onClick={() => setActiveDomain("designer")}
              >
                <text
                  x="145"
                  y="165"
                  textAnchor="middle"
                  className={`font-sans text-[13px] font-semibold tracking-wider transition-all duration-200 ${
                    activeDomain === "designer" ? "fill-[#0284c7] font-bold" : "fill-[#0369a1]"
                  }`}
                >
                  DESIGNER
                </text>
                <text
                  x="145"
                  y="184"
                  textAnchor="middle"
                  className="font-mono text-[9.5px] fill-[#64748b]"
                >
                  UI / UX · Typography
                </text>
              </g>

              <g
                className="cursor-pointer"
                onClick={() => setActiveDomain("engineer")}
              >
                <text
                  x="495"
                  y="165"
                  textAnchor="middle"
                  className={`font-sans text-[13px] font-semibold tracking-wider transition-all duration-200 ${
                    activeDomain === "engineer" ? "fill-[#059669] font-bold" : "fill-[#047857]"
                  }`}
                >
                  ENGINEER
                </text>
                <text
                  x="495"
                  y="184"
                  textAnchor="middle"
                  className="font-mono text-[9.5px] fill-[#64748b]"
                >
                  Fullstack · Hardware
                </text>
              </g>

              <g
                className="cursor-pointer"
                onClick={() => setActiveDomain("ai")}
              >
                <text
                  x="320"
                  y="475"
                  textAnchor="middle"
                  className={`font-sans text-[13px] font-semibold tracking-wider transition-all duration-200 ${
                    activeDomain === "ai" ? "fill-[#7c3aed] font-bold" : "fill-[#6d28d9]"
                  }`}
                >
                  AI
                </text>
                <text
                  x="320"
                  y="494"
                  textAnchor="middle"
                  className="font-mono text-[9.5px] fill-[#64748b]"
                >
                  GenAI · Model Pipelines
                </text>
              </g>

              {/* Intersection 1: Design + Engineer (Top Center) */}
              <g
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
                style={{ transformOrigin: "320px 147px" }}
                onClick={() => setActiveDomain("design-eng")}
              >
                <rect
                  x="268"
                  y="133"
                  width="104"
                  height="28"
                  rx="14"
                  fill={activeDomain === "design-eng" ? "#0f766e" : "#ffffff"}
                  stroke={activeDomain === "design-eng" ? "#0d9488" : "rgba(13,148,136,0.3)"}
                  strokeWidth={activeDomain === "design-eng" ? "2" : "1"}
                  filter="url(#pill-shadow)"
                  className="transition-all duration-200"
                />
                <circle
                  cx="282"
                  cy="147"
                  r="3.5"
                  fill={activeDomain === "design-eng" ? "#ffffff" : "#0d9488"}
                />
                <text
                  x="324"
                  y="151"
                  textAnchor="middle"
                  className={`font-mono text-[9px] font-semibold uppercase tracking-wider pointer-events-none transition-colors duration-200 ${
                    activeDomain === "design-eng" ? "fill-white" : "fill-[#0f766e]"
                  }`}
                >
                  Design Eng
                </text>
              </g>

              {/* Intersection 2: Design + AI (Bottom Left) */}
              <g
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
                style={{ transformOrigin: "232px 338px" }}
                onClick={() => setActiveDomain("creative-ai")}
              >
                <rect
                  x="180"
                  y="324"
                  width="104"
                  height="28"
                  rx="14"
                  fill={activeDomain === "creative-ai" ? "#be185d" : "#ffffff"}
                  stroke={activeDomain === "creative-ai" ? "#db2777" : "rgba(219,39,119,0.3)"}
                  strokeWidth={activeDomain === "creative-ai" ? "2" : "1"}
                  filter="url(#pill-shadow)"
                  className="transition-all duration-200"
                />
                <circle
                  cx="194"
                  cy="338"
                  r="3.5"
                  fill={activeDomain === "creative-ai" ? "#ffffff" : "#db2777"}
                />
                <text
                  x="236"
                  y="342"
                  textAnchor="middle"
                  className={`font-mono text-[9px] font-semibold uppercase tracking-wider pointer-events-none transition-colors duration-200 ${
                    activeDomain === "creative-ai" ? "fill-white" : "fill-[#be185d]"
                  }`}
                >
                  Creative AI
                </text>
              </g>

              {/* Intersection 3: Engineer + AI (Bottom Right) */}
              <g
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
                style={{ transformOrigin: "408px 338px" }}
                onClick={() => setActiveDomain("ai-systems")}
              >
                <rect
                  x="356"
                  y="324"
                  width="104"
                  height="28"
                  rx="14"
                  fill={activeDomain === "ai-systems" ? "#b45309" : "#ffffff"}
                  stroke={activeDomain === "ai-systems" ? "#d97706" : "rgba(217,119,6,0.3)"}
                  strokeWidth={activeDomain === "ai-systems" ? "2" : "1"}
                  filter="url(#pill-shadow)"
                  className="transition-all duration-200"
                />
                <circle
                  cx="370"
                  cy="338"
                  r="3.5"
                  fill={activeDomain === "ai-systems" ? "#ffffff" : "#d97706"}
                />
                <text
                  x="412"
                  y="342"
                  textAnchor="middle"
                  className={`font-mono text-[9px] font-semibold uppercase tracking-wider pointer-events-none transition-colors duration-200 ${
                    activeDomain === "ai-systems" ? "fill-white" : "fill-[#b45309]"
                  }`}
                >
                  AI Systems
                </text>
              </g>

              {/* Center: The Core (SATYA) */}
              <g
                className="cursor-pointer group/center"
                onClick={() => setActiveDomain("core")}
              >
                <circle
                  cx="320"
                  cy="280"
                  r="44"
                  fill="url(#grad-center)"
                  stroke={activeDomain === "core" ? "#fbbf24" : "#ffffff"}
                  strokeWidth={activeDomain === "core" ? "2.5" : "2"}
                  filter="url(#core-shadow)"
                  className="transition-all duration-200 group-hover/center:scale-105"
                  style={{ transformOrigin: "320px 280px" }}
                />
                <text
                  x="320"
                  y="276"
                  textAnchor="middle"
                  className="font-sans text-[11px] font-bold fill-white tracking-widest pointer-events-none"
                >
                  SATYA
                </text>
                <text
                  x="320"
                  y="291"
                  textAnchor="middle"
                  className="font-mono text-[8px] fill-amber-300 font-semibold uppercase tracking-wider pointer-events-none"
                >
                  AI + DESIGN
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: Dynamic Domain Inspector (Aligned with left)
           ========================================================= */}
        <div className="flex flex-col justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col"
            >
              {/* Domain Heading (Matches user's "Lorem ipsum dolor sit amet, :") */}
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#1d1d1f] leading-tight">
                {current.title}
              </h3>

              {/* Domain Description */}
              <p className="mt-4 text-base sm:text-lg text-[#515154] leading-relaxed font-normal">
                {current.description}
              </p>

              {/* Companies Worked In This Domain */}
              <div className="mt-8">
                <h4 className="text-sm font-medium text-[#1d1d1f] tracking-tight">
                  Companies worked in this domain :
                </h4>
                <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-3">
                  {current.companies.map((company, idx) => (
                    <div
                      key={idx}
                      className="group relative flex flex-col items-center justify-center aspect-square rounded-2xl bg-[#f5f5f7] border border-black/[0.04] p-3 transition-all duration-200 hover:bg-white hover:shadow-md hover:border-black/[0.08]"
                      title={`${company.name} — ${company.role}`}
                    >
                      <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-200"
                        />
                      </div>
                      <span className="mt-1.5 text-[11px] font-sans font-medium text-[#626267] truncate max-w-full text-center group-hover:text-[#1d1d1f] transition-colors">
                        {company.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Gallery */}
              <div className="mt-8">
                <h4 className="text-sm font-medium text-[#1d1d1f] tracking-tight">
                  Projects gallery
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  {current.projects.map((project, idx) => {
                    const isExternal = project.link.startsWith("http");
                    return (
                      <a
                        key={idx}
                        href={project.link}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="group flex flex-col rounded-2xl bg-[#f5f5f7] border border-black/[0.05] overflow-hidden transition-all duration-200 hover:bg-white hover:shadow-lg hover:border-black/[0.12] hover:-translate-y-1"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/[0.03]">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/85 backdrop-blur-xs text-[#1d1d1f] opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                            <ArrowUpRight size={13} />
                          </div>
                        </div>
                        <div className="p-3.5 flex flex-col flex-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#86868b]">
                            {project.tag}
                          </span>
                          <h5 className="text-sm font-semibold text-[#1d1d1f] mt-0.5 tracking-tight group-hover:text-[#0284c7] transition-colors">
                            {project.title}
                          </h5>
                          <p className="text-xs text-[#626267] mt-1 line-clamp-2 leading-relaxed">
                            {project.desc}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
