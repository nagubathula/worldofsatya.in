"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Sparkles,
  Gamepad2,
  ChevronDown,
  Terminal,
  Heart,
  ExternalLink,
} from "lucide-react";
import VennDiagram from "./VennDiagram";
import ExperienceTable from "./ExperienceTable";
import TwoTruthsAndALie from "./TwoTruthsAndALie";

const principles = [
  {
    number: "01",
    title: "Start with the person.",
    description:
      "Understand the task, remove the plumbing, and make the next step feel obvious and inevitable.",
  },
  {
    number: "02",
    title: "Make it real.",
    description:
      "Design, build, then refine. The nuances and tactile details reveal themselves only in working software.",
  },
  {
    number: "03",
    title: "Leave it open.",
    description:
      "Readable code, open formats, and sovereign tools people can truly own. Always share what you learn in public.",
  },
];

const independentTools = [
  {
    name: "OpenWeave",
    category: "Open Source · Design Canvas + AI",
    id: "o0",
    desc: "Sovereign vector design editor with Figma binary support & natural AI co-creation.",
  },
  {
    name: "NotBad",
    category: "Case Study · Distraction-Free Writing",
    id: "case-studies/notbad-design",
    desc: "Pure-Flutter native Markdown editor where syntax conceals on rest. 1.0s cold start.",
  },
  {
    name: "Toothpaste",
    category: "Open Source · Media Workflow Engine",
    id: "o1",
    desc: "Adobe CEP extension bridging instant clipboard paste straight to the Premiere timeline.",
  },
];

export default function AboutMe() {
  const [showGame, setShowGame] = useState(false);

  return (
    <div className="mx-auto w-full max-w-6xl text-[#1d1d1f] flex flex-col gap-20 sm:gap-28 pb-16 sm:pb-24">
      {/* ==============================================================
          1) WHO AM I -> VENN DIAGRAM OF DESIGNER, ENGINEER, AI
         ============================================================== */}
      <div id="who-am-i" className="scroll-mt-24 w-full">
        <VennDiagram />
      </div>

      {/* ==============================================================
          2) ABOUT SOMETHING (Personal Journey, Craft & Philosophy)
         ============================================================== */}
      <section
        id="about-something"
        aria-label="About the Journey and Craft"
        className="scroll-mt-24 border-t border-black/[0.08] pt-16 sm:pt-20"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
          Learning by making.
        </h2>
        <p
          className="mt-2 text-lg sm:text-xl text-[#626267] font-normal"
          style={{ fontFamily: "var(--font-editorial)" }}
        >
          From hardware security and protocol sniffing to generative AI pipelines and sovereign tools.
        </p>

        {/* Narrative & Visual Spread - Single Column Flow */}
        <div className="mt-10 flex flex-col gap-10 w-full">
          {/* Centered Portrait with Companion Cat */}
          <figure className="relative overflow-hidden rounded-3xl bg-[#f5f5f7] border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.03)] w-full">
            <Image
              src="/images/about/about_main_image.png"
              alt="Satya Sai Nagubathula with a cat wearing sunglasses"
              width={800}
              height={480}
              priority
              sizes="(max-width: 1024px) 100vw, 768px"
              className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.01]"
            />
            <figcaption className="border-t border-black/[0.06] bg-white/95 backdrop-blur-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p
                  className="text-base sm:text-lg text-[#1d1d1f]"
                  style={{ fontFamily: "var(--font-editorial)" }}
                >
                  &ldquo;From how it looks to how it works.&rdquo;
                </p>
                <p className="text-xs text-[#626267] mt-0.5">
                  Satya & the coolest sunglasses-wearing feline companion.
                </p>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#86868b] shrink-0">
                Always curious
              </span>
            </figcaption>
          </figure>

          {/* Deep Story Narrative in Single Column */}
          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-[#515154]">
            <p>
              I didn&apos;t start in a traditional design classroom. I started with microcontrollers, electronics, and hardware security — dumping SPI flash memories, probing UART ports, and understanding how data actually travels across silicon.
            </p>
            <p>
              That physical grounding shaped how I see interfaces today. Whether it&apos;s tuning a 1.0-second cold start in <strong className="text-[#1d1d1f] font-semibold">NotBad</strong> (a pure-Dart Markdown editor replacing 42,000 lines of upstream Swift/TypeScript) or architecting <strong className="text-[#1d1d1f] font-semibold">OpenWeave</strong> (an open design canvas with Figma binary support), I care about sovereign tools that people can inspect, trust, and truly own.
            </p>
            <p>
              At <strong className="text-[#1d1d1f] font-semibold">NxtWave</strong>, I lead Generative AI production. That means orchestrating over 2,000 video pipelines, automating multi-lingual workflows with structured JSON for models like Veo 3 & Wan 2.2, and cutting production turnaround times by 90%.
            </p>
            <p>
              Outside the day job, I build <strong className="text-[#1d1d1f] font-semibold">Engineerudu</strong> — Andhra Pradesh&apos;s first Free and Open Source Software (FOSS) community — helping students bridge theory to shipping real production software in public.
            </p>
          </div>

          {/* Core Tenets Checklist */}
          <div className="pt-8 border-t border-black/[0.08]">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#86868b] block mb-5">
              Core Tenets of Craft
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {principles.map((p) => (
                <div key={p.title} className="flex flex-col gap-2 p-5 rounded-2xl bg-[#fafafc] border border-black/[0.05]">
                  <span className="font-mono text-xs text-[#86868b] font-semibold">{p.number}</span>
                  <h4 className="text-sm font-semibold text-[#1d1d1f]">{p.title}</h4>
                  <p className="text-xs text-[#626267] leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sovereign Independent Tools */}
          <div className="rounded-3xl border border-black/[0.08] bg-white p-6 sm:p-7 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#86868b] block">
                  Independent Software
                </span>
                <h4 className="text-base font-semibold text-[#1d1d1f] mt-0.5">
                  Made to be free and sovereign.
                </h4>
              </div>
              <span className="text-xs font-mono text-[#86868b]">3 Utilities</span>
            </div>

            <div className="divide-y divide-black/[0.06]">
              {independentTools.map((tool) => (
                <Link
                  key={tool.name}
                  href={`/works/${tool.id}`}
                  className="group py-3.5 flex items-center justify-between gap-4 transition-colors hover:bg-black/[0.015] -mx-2 px-2 rounded-xl"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm sm:text-base font-semibold text-[#1d1d1f] group-hover:text-sky-600 transition-colors">
                        {tool.name}
                      </span>
                      <span className="text-[11px] font-mono text-[#86868b]">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#626267] mt-1">{tool.desc}</p>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-[#86868b] group-hover:text-[#1d1d1f] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Optional Two Truths and One Lie Collapsible */}
          <div className="rounded-3xl border border-black/[0.08] bg-[#fbfbfd] p-4 sm:p-5 text-xs">
            <button
              type="button"
              onClick={() => setShowGame((prev) => !prev)}
              className="w-full flex items-center justify-between text-left font-mono font-medium text-[#1d1d1f] hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Gamepad2 size={16} className="text-emerald-600" />
                <span>Bonus: Play Two Truths & One Lie</span>
              </span>
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${
                  showGame ? "rotate-180" : ""
                }`}
              />
            </button>

            {showGame && (
              <div className="mt-4 pt-4 border-t border-black/[0.06]">
                <TwoTruthsAndALie />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==============================================================
          4) EXPERIENCE TABLE (Company Logo, Work Role, Responsibilities)
         ============================================================== */}
      <div id="experience" className="scroll-mt-24 border-t border-black/[0.08] pt-16 sm:pt-20">
        <ExperienceTable />
      </div>
    </div>
  );
}
