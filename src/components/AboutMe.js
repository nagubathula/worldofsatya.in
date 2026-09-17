"use client";

import Image from "next/image";
import { User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedButton from "./AnimatedButton";
import RetroRainbowRibbon from "./RetroRainbowRibbon";
import { useTheme } from "@/components/ThemeProvider";

const stats = [
  { value: "6", label: "Years of Experience" },
  { value: "280+", label: "Clients Served" },
  { value: "100K+", label: "Followers Scaled" },
  { value: "2,000+", label: "Videos Orchestrated" },
  { value: "36", label: "Engineers Trained" },
  { value: "3", label: "Films Contributed" },
];

const pillars = [
  {
    title: "Design Technology",
    description:
      "Turning product ideas into interactive prototypes, reusable components, and production interfaces with React, Next.js, and Tailwind.",
  },
  {
    title: "AI Engineering",
    description:
      "Building generative AI pipelines and automation tools with ComfyUI, Stable Diffusion, and structured prompting — connecting models to the workflows teams use every day.",
  },
  {
    title: "Product Design",
    description:
      "Shaping how products look, feel, and work — from brand identity to design systems for startups, government, e-commerce, and open-source communities.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
};

export default function AboutMe() {
  const { theme } = useTheme();
  const portrait = theme === "dark" ? "/portraits/sky-night.jpg" : "/portraits/sky-day.jpg";

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full py-10 sm:py-16"
    >
      <div className="px-4 sm:px-8 max-w-6xl 2xl:max-w-7xl mx-auto w-full flex flex-col gap-12 sm:gap-16">
        {/* Header */}
        <motion.div variants={itemAnim} className="flex flex-col items-start max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#3e3832]/5 text-[#3e3832]/80 text-xs font-pixel mb-4 uppercase tracking-widest border-2 border-[#3e3832]/25 shadow-[2px_2px_0px_rgba(62,56,50,0.15)]">
            <User size={14} /> About Satya
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-editorial font-normal leading-[1.05] text-[#3e3832] tracking-tight mb-4 sm:mb-6">
            Design Technologist <span className="italic text-[#3e3832]/70">&amp; AI Engineer.</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#3e3832]/75 max-w-3xl leading-relaxed font-editorial">
            Connecting interface craft, typography, and deep systems engineering to build sovereign tools and scalable generative pipelines.
          </p>
        </motion.div>

        {/* Three-Column Editorial Story Grid with Portrait */}
        <motion.div variants={itemAnim} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Column 1: Identity & Role */}
          <div className="lg:col-span-3 flex flex-col gap-4 text-base font-editorial text-[#3e3832]/85 leading-relaxed">
            <p>
              I&apos;m <span className="font-semibold text-[#3e3832]">Satya Sai Nagubathula</span> — a Design Technologist and AI Engineer. I operate at the boundary where interface craft, typography, and deep systems engineering converge.
            </p>
            <p>
              At <span className="font-semibold text-[#3e3832]">NXTWAVE Disruptive Technologies</span>, I serve as Generative AI Engineer and Creative Lead, architecting autonomous video production pipelines and zero-cost automation suites that empower teams to scale content by 90%.
            </p>
          </div>

          {/* Column 2: Journey & Philosophy */}
          <div className="lg:col-span-3 flex flex-col gap-4 text-base font-editorial text-[#3e3832]/85 leading-relaxed">
            <p>
              My journey began in pure visual design — brand identities, interface typography, and Figma design systems — and evolved through hardware security research, full-stack architecture, and government-scale software.
            </p>
            <p>
              That multidisciplinary foundation defines my daily workflow: exploring an intuition through tactile design, verifying it in code, and engineering the robust infrastructure to bring it alive.
            </p>
          </div>

          {/* Column 3: Impact & Open Source */}
          <div className="lg:col-span-3 flex flex-col gap-4 text-base font-editorial text-[#3e3832]/85 leading-relaxed">
            <p>
              Over the past six years, I have collaborated with 280+ international clients, mentored 36 emerging designers and engineers, and contributed visual engineering to three feature films.
            </p>
            <p>
              Outside commercial work, I build sovereign public goods — founding <span className="font-semibold text-[#3e3832]">Engineerudu</span> (Andhra Pradesh&apos;s first FOSS community) and developing open design systems like <span className="font-semibold text-[#3e3832]">Chaya UI</span>.
            </p>
          </div>

          {/* Column 4: Archival Portrait Frame */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden border-2 border-[#3e3832]/30 shadow-[5px_5px_0px_rgba(62,56,50,0.2)] bg-[#fdfaf3]">
              <Image
                key={portrait}
                src={portrait}
                alt="Satya Sai Nagubathula"
                fill
                sizes="(max-width: 640px) 100vw, 360px"
                className="object-cover sepia-[0.12] contrast-105"
                priority
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-pixel text-[#3e3832]/60 uppercase tracking-widest px-1">
              <span>Satya Sai N.</span>
              <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Available</span>
            </div>
          </div>
        </motion.div>

        {/* 6-Stripe Apple / Polaroid Retro Rainbow Ribbon Divider */}
        <motion.div variants={itemAnim} className="w-full py-2">
          <RetroRainbowRibbon className="rounded-sm" />
        </motion.div>

        {/* Showcase of Impact & Metrics */}
        <motion.div variants={itemAnim} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl sm:text-5xl font-editorial font-normal text-[#3e3832] tracking-tight">
              A Showcase of Impact &amp; Metrics
            </h2>
            <p className="text-base sm:text-lg text-[#3e3832]/75 max-w-2xl font-editorial">
              Proven outcomes delivered across enterprise automation, generative AI pipelines, and digital products.
            </p>
          </div>

          {/* 6 Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col justify-center gap-1 p-4 sm:p-5 retro-card group hover:-translate-y-0.5 transition-transform"
              >
                <p className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-normal text-[#3e3832] tracking-tight">{stat.value}</p>
                <p className="text-[10px] sm:text-[11px] font-pixel uppercase tracking-wider text-[#3e3832]/60 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Teaching & Visual Proof */}
        <motion.div variants={itemAnim} className="flex flex-col gap-3">
          <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] rounded-sm overflow-hidden border-2 border-[#3e3832]/30 shadow-[4px_4px_0px_rgba(62,56,50,0.2)]">
            <Image
              src="/portraits/genai-training.jpg"
              alt="Satya Sai Nagubathula leading a Gen AI training session"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover sepia-[0.1] contrast-105 object-center"
            />
          </div>
          <div className="flex items-center justify-between text-xs font-pixel text-[#3e3832]/60 uppercase tracking-wider px-1">
            <span>GenAI Engineering Session</span>
            <span>NxtWave Campus · 36+ Engineers</span>
          </div>
        </motion.div>

        {/* Core Competencies (3-Column Grid) */}
        <motion.div variants={itemAnim} className="flex flex-col gap-6">
          <h2 className="text-3xl sm:text-4xl font-editorial font-normal text-[#3e3832] tracking-tight">
            Core Competencies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-6 sm:p-8 retro-card flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-editorial font-normal text-[#3e3832] tracking-tight mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-base text-[#3e3832]/80 font-editorial leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Retro Action CTA Row */}
        <motion.div variants={itemAnim} className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4 border-t border-[#3e3832]/15">
          <AnimatedButton href="mailto:nagubathula.satyasai@gmail.com" isPrimary={true}>
            <span className="mr-1">☎</span> Get in Touch
          </AnimatedButton>
          <AnimatedButton href="https://www.linkedin.com/in/satyasainagubathula">
            LinkedIn
          </AnimatedButton>
          <AnimatedButton href="https://hippogriff.medium.com">
            Medium
          </AnimatedButton>
        </motion.div>
      </div>
    </motion.section>
  );
}
