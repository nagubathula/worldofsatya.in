"use client";

import Image from "next/image";
import { User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedButton from "./AnimatedButton";
import RetroRainbowRibbon from "./RetroRainbowRibbon";

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
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function AboutMe() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full py-10 sm:py-16"
    >
      <div className="px-4 sm:px-8 max-w-6xl xl:max-w-7xl mx-auto w-full flex flex-col gap-12 sm:gap-16">
        {/* Section Header (Centered Editorial Headline matching reference) */}
        <motion.div variants={itemAnim} className="flex flex-col items-center text-center gap-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#3e3832]/5 text-[#3e3832]/80 text-xs font-pixel uppercase tracking-widest border-2 border-[#3e3832]/25 shadow-[2px_2px_0px_rgba(62,56,50,0.15)] w-fit">
            <User size={14} /> About Satya
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-editorial font-normal leading-[1.12] text-[#3e3832] tracking-tight">
            Design Technologist <span className="italic text-[#3e3832]/75">&amp; AI Engineer</span>
          </h1>
          <p className="text-base sm:text-xl text-[#3e3832]/75 font-editorial max-w-2xl leading-relaxed">
            Connecting interface craft, typography, and deep systems engineering to build sovereign tools and scalable generative pipelines.
          </p>
        </motion.div>

        {/* Three-Column Editorial Spread with Cutout Figure Grounded on Rainbow Ribbon */}
        <motion.div variants={itemAnim} className="flex flex-col">
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.85fr] gap-6 lg:gap-8 items-end">
            {/* Column 1: Identity & Role */}
            <div className="flex flex-col justify-between h-full min-h-[275px] text-sm sm:text-base lg:text-[15px] font-editorial text-[#3e3832]/85 leading-[1.62] relative z-10">
              <p className="mb-3.5">
                I&apos;m <span className="font-semibold text-[#3e3832]">Satya Sai Nagubathula</span> — a Design Technologist and AI Engineer operating at the boundary where interface craft, typography, and deep systems engineering converge.
              </p>
              <p className="mb-0">
                At <span className="font-semibold text-[#3e3832]">NXTWAVE Disruptive Technologies</span>, I serve as Generative AI Engineer and Creative Lead, architecting autonomous video production pipelines and zero-cost automation suites that empower teams to scale content by 90%.
              </p>
            </div>

            {/* Column 2: Journey & Workflow */}
            <div className="flex flex-col justify-between h-full min-h-[275px] text-sm sm:text-base lg:text-[15px] font-editorial text-[#3e3832]/85 leading-[1.62] relative z-10">
              <p className="mb-3.5">
                My journey began in pure visual design — brand identities, interface typography, and Figma design systems — and evolved through hardware security research, full-stack architecture, and government-scale software.
              </p>
              <p className="mb-0">
                That multidisciplinary foundation defines my daily workflow: exploring an intuition through tactile design, verifying it in code, and engineering the robust infrastructure to bring it alive.
              </p>
            </div>

            {/* Column 3: Impact & Open Source with Integrated Floated Cutout */}
            <div className="md:col-span-2 lg:col-span-1 block text-sm sm:text-base lg:text-[15px] font-editorial text-[#3e3832]/85 leading-[1.62] relative z-10 min-h-[275px]">
              <img
                src="/images/about/about_col3_image.png"
                alt="Satya Sai Nagubathula with cat"
                width={486}
                height={359}
                className="hidden lg:block float-right w-[365px] xl:w-[395px] h-auto ml-3 -mb-[3px] select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(62,56,50,0.12)] filter contrast-104"
                style={{
                  shapeOutside:
                    "polygon(41.2% 0%, 36.2% 7%, 34% 14.2%, 35.4% 21.2%, 19.3% 28.4%, 16.3% 35.4%, 14% 42.6%, 13.6% 49.9%, 11.9% 56.8%, 11.7% 64.1%, 0% 71%, 0% 78.3%, 0% 85.2%, 0% 92.5%, 0% 100%, 100% 100%, 100% 0%)",
                }}
              />
              <p className="mb-0">
                Over the past six years, I have collaborated with 280+ international clients, mentored 36 emerging designers and engineers, and built sovereign public goods — founding <span className="font-semibold text-[#3e3832]">Engineerudu</span> (Andhra Pradesh&apos;s first FOSS community) and developing open design systems like <span className="font-semibold text-[#3e3832]">Chaya UI</span>.
              </p>
            </div>
          </div>

          {/* Mobile/Tablet Fallback Cutout Figure */}
          <div className="block lg:hidden flex justify-center -mt-2 -mb-1">
            <img
              src="/images/about/about_main_image.png"
              alt="Satya Sai Nagubathula with cat"
              width={596}
              height={359}
              className="w-[300px] sm:w-[360px] h-auto object-contain -mb-[3px]"
            />
          </div>

          {/* 6-Stripe Apple / Polaroid Retro Rainbow Ribbon Divider */}
          <div className="w-full">
            <RetroRainbowRibbon className="rounded-sm" />
          </div>
        </motion.div>

        {/* Showcase of Impact & Metrics */}
        <motion.div variants={itemAnim} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-editorial font-normal text-[#3e3832] tracking-tight">
              A Showcase of Impact &amp; Metrics
            </h2>
            <p className="text-sm sm:text-lg text-[#3e3832]/75 max-w-2xl font-editorial">
              Proven outcomes delivered across enterprise automation, generative AI pipelines, and digital products.
            </p>
          </div>

          {/* 6 Stats Grid - Tactile Retro Hardware Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="relative flex flex-col justify-between p-3.5 sm:p-5 rounded-sm bg-[#fcf8f0] border-2 border-[#3e3832]/35 shadow-[3px_3px_0px_rgba(62,56,50,0.2)] hover:shadow-[5px_5px_0px_rgba(62,56,50,0.3)] hover:-translate-y-0.5 hover:border-[#3e3832] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(62,56,50,0.3)] transition-all duration-150 group"
              >
                {/* Hardware header / status indicator */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-pixel text-[#3e3832]/45 tracking-wider">
                    {`[0${idx + 1}]`}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3e3832]/25 group-hover:bg-[#c2410c] group-hover:shadow-[0_0_4px_#c2410c] transition-all" />
                </div>

                <div className="flex flex-col gap-0.5 sm:gap-1">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-editorial font-normal text-[#3e3832] tracking-tight group-hover:text-[#c2410c] transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-[9px] sm:text-[11px] font-pixel uppercase tracking-wider text-[#3e3832]/70 leading-snug">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Teaching & Visual Proof */}
        <motion.div variants={itemAnim} className="flex flex-col gap-3">
          <div className="relative w-full aspect-[16/9] sm:aspect-[24/9] rounded-sm overflow-hidden border-2 border-[#3e3832]/30 shadow-[4px_4px_0px_rgba(62,56,50,0.2)]">
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
