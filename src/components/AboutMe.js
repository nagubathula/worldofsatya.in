"use client";

import Image from "next/image";
import { User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedButton from "./AnimatedButton";

const stats = [
  { value: "6", label: "Years of Experience" },
  { value: "280+", label: "Clients Served" },
  { value: "100K+", label: "Followers Scaled" },
  { value: "2,000+", label: "Videos Orchestrated" },
  { value: "36", label: "Engineers Trained" },
  { value: "3", label: "Films Contributed" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 12 },
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
      className="w-full py-12 sm:py-20"
    >
      <div className="px-4 sm:px-8 max-w-6xl xl:max-w-7xl mx-auto w-full flex flex-col gap-12 sm:gap-16">
        {/* Section Header */}
        <motion.div variants={itemAnim} className="flex flex-col items-center text-center gap-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f5f7] text-[#86868b] text-xs font-sans uppercase tracking-wider font-medium border border-black/[0.04] w-fit">
            <User size={13} /> About Satya
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-sans font-semibold leading-[1.08] text-[#1d1d1f] tracking-[-0.035em]">
            The Journey of a Builder
          </h1>
          <p className="text-base sm:text-lg text-[#86868b] font-sans max-w-2xl leading-relaxed">
            Obsessive self-taught builder bridging interface craft, typography, and deep systems engineering.
          </p>
        </motion.div>

        {/* Three-Column Editorial Spread */}
        <motion.div variants={itemAnim} className="flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8 sm:mb-12">
            {/* Column 1 */}
            <div className="text-sm sm:text-[15px] font-sans text-[#515154] leading-[1.7]">
              <p className="mb-3.5">
                Long before official titles, corporate contracts, or design systems, I was just an intensely curious kid who refused to see machines as black boxes. While other kids interacted with computers as passive entertainment, I was consumed by an urgent itch to see what was happening underneath the glass and plastic.
              </p>
              <p className="mb-3.5">
                My journey began in my bedroom at a very young age. With no formal mentors and no predefined roadmaps, my school years were split between filling notebook margins with intricate interface sketches and tearing apart old electronics to salvage chips, wires, and displays. I realized early on that everything around us was built by humans no smarter than anyone else — which meant everything could be understood, dismantled, and reimagined.
              </p>
              <p className="mb-0">
                While my classmates were memorizing textbook answers, I was already spending whole nights deep in internet forums, reading open documentation, and taking on my first real-world freelance challenges. Starting my career so young wasn&apos;t a calculated career choice; it was pure, unadulterated obsession.
              </p>
            </div>

            {/* Column 2 */}
            <div className="text-sm sm:text-[15px] font-sans text-[#515154] leading-[1.7]">
              <p className="mb-3.5">
                Being an autodidact forged my work ethic into something immovable. When you learn by breaking things alone at 3 AM, you develop an intimate relationship with failure. If code wouldn&apos;t compile or an oscilloscope trace refused to trigger, there was no teacher to bail me out — only patience, trial, and the relentless discipline of isolating variables until the truth emerged.
              </p>
              <p className="mb-3.5">
                That journey naturally pulled me in two directions that most people treat as opposites: the cold, deterministic logic of silicon and registers, and the warm, emotional nuance of typography and human-computer interaction. I refused to choose between being an engineer or an artist. I wanted both: the mathematical precision to control memory and hardware buses, and the sensitive aesthetic eye to make every interaction feel tactile, effortless, and alive.
              </p>
              <p className="mb-0">
                Those formative, self-directed years taught me that real depth doesn&apos;t come from following safe guidelines. It comes from thousands of invisible hours spent pushing tools to their breaking points, mastering the fundamentals, and cultivating an uncompromising standard of taste.
              </p>
            </div>

            {/* Column 3 */}
            <div className="text-sm sm:text-[15px] font-sans text-[#515154] leading-[1.7]">
              <p className="mb-3.5">
                People often ask what keeps me perpetually learning across radically different fields — from reverse-engineering hardware protocols to orchestrating autonomous AI intelligence and crafting typographic layouts. The answer is simple: I never lost the audacity of that young kid who believed he could build anything if he just gave it his all.
              </p>
              <p className="mb-3.5">
                I believe that great work requires soul, stubborn conviction, and sovereign ownership. I don&apos;t care for shallow trends, bloated corporate jargon, or disposable software. I care about agency — building software and physical tools that respect human dignity, give people true power over their machines, and elevate daily life through honest craft.
              </p>
              <p className="mb-0">
                Today, with every system I architect and every pixel I place, I operate with that exact same hungry spirit. The tools have evolved, the scale has expanded, but at my core, I am still that same ambitious kid on a mission — curious, fearless, and ready to conquer whatever lies ahead.
              </p>
            </div>
          </div>

          {/* Portrait cutout */}
          <div className="flex justify-start mt-2 sm:mt-4 relative z-20 select-none pointer-events-none">
            <img
              src="/images/about/about_main_image.png"
              alt="Satya Sai Nagubathula with cat"
              width={596}
              height={359}
              className="w-[320px] sm:w-[420px] lg:w-[460px] h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.06)] -mb-1"
            />
          </div>

          <div className="w-full h-px bg-black/[0.06]" />
        </motion.div>

        {/* Showcase of Impact & Metrics */}
        <motion.div variants={itemAnim} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl sm:text-4xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.03em]">
              Impact &amp; Metrics
            </h2>
            <p className="text-sm sm:text-base text-[#86868b] max-w-2xl font-sans">
              Outcomes delivered across enterprise automation, generative AI pipelines, and digital products.
            </p>
          </div>

          {/* 6 Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="relative flex flex-col justify-between p-4 sm:p-5 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono text-[#86868b] font-medium">
                    {`0${idx + 1}`}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 group-hover:bg-emerald-500 transition-colors" />
                </div>

                <div className="flex flex-col gap-0.5 sm:gap-1">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-sans font-semibold text-[#1d1d1f] tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-xs font-sans text-[#86868b] leading-snug">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Narrative Arc: The Evolution */}
        <motion.div variants={itemAnim} className="flex flex-col gap-6 pt-6 border-t border-black/[0.06]">
          <div className="flex flex-col gap-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#f5f5f7] text-[#86868b] text-xs font-sans uppercase tracking-wider font-medium border border-black/[0.04] w-fit">
              <Sparkles size={12} className="text-[#0071e3]" /> The Evolution
            </div>
            <h2 className="text-2xl sm:text-4xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.03em]">
              From Silicon to Synapses
            </h2>
            <p className="text-sm sm:text-base text-[#86868b] max-w-2xl leading-relaxed font-sans">
              How a background in hardware security and tactile electronics matured into high-throughput generative AI architectures and sovereign software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Chapter 1 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-black/[0.04]">
                  <span className="text-xs font-sans font-semibold text-[#1d1d1f] uppercase tracking-wider">Chapter 01</span>
                  <span className="text-xs font-sans text-[#86868b]">Foundations</span>
                </div>
                <h3 className="text-lg sm:text-xl font-sans font-semibold text-[#1d1d1f] tracking-tight">
                  The Silicon Crucible
                </h3>
                <p className="text-sm text-[#515154] font-sans leading-relaxed">
                  Before writing web apps or neural pipelines, I probed microcontrollers with logic analyzers and oscilloscopes. From reverse-engineering firmware over JTAG/UART to presenting embedded recon at Nullcon Goa and competing as a National Finalist in the Kavach Cybersecurity Hackathon, I learned that digital systems are only as resilient as their underlying physical constraints.
                </p>
              </div>
              <div className="text-xs font-sans text-[#86868b] pt-2 border-t border-black/[0.04]">
                ✦ NASA Space Apps Galactic Impact
              </div>
            </div>

            {/* Chapter 2 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-black/[0.04]">
                  <span className="text-xs font-sans font-semibold text-[#1d1d1f] uppercase tracking-wider">Chapter 02</span>
                  <span className="text-xs font-sans text-[#86868b]">Tactile Craft</span>
                </div>
                <h3 className="text-lg sm:text-xl font-sans font-semibold text-[#1d1d1f] tracking-tight">
                  Human-Centered Interfaces
                </h3>
                <p className="text-sm text-[#515154] font-sans leading-relaxed">
                  Realizing that complex technology fails if humans cannot intuitively wield it, I shifted toward interface architecture. When elderly hostel wardens struggled with complex mobile screens, I engineered a physical Public Address console with mechanical rotary dials and high-contrast toggles. That tactile discipline became the blueprint for building accessible digital design systems like Chaya UI.
                </p>
              </div>
              <div className="text-xs font-sans text-[#86868b] pt-2 border-t border-black/[0.04]">
                ✦ 280+ Global Client Deliveries
              </div>
            </div>

            {/* Chapter 3 */}
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-black/[0.04]">
                  <span className="text-xs font-sans font-semibold text-[#1d1d1f] uppercase tracking-wider">Chapter 03</span>
                  <span className="text-xs font-sans text-[#86868b]">The Frontier</span>
                </div>
                <h3 className="text-lg sm:text-xl font-sans font-semibold text-[#1d1d1f] tracking-tight">
                  Autonomous AI &amp; Sovereignty
                </h3>
                <p className="text-sm text-[#515154] font-sans leading-relaxed">
                  At NxtWave, I lead generative AI production — orchestrating over 2,000 video generations and building structured prompt pipelines that scale channels to 100K+ followers while cutting production cycle times by 90%. Simultaneously, I build local-first sovereign tools like NotBad (an offline markdown editor) and run Engineerudu to keep open-source spirit alive.
                </p>
              </div>
              <div className="text-xs font-sans text-[#86868b] pt-2 border-t border-black/[0.04]">
                ✦ Founder, Engineerudu FOSS Community
              </div>
            </div>
          </div>
        </motion.div>

        {/* Teaching & Visual Proof */}
        <motion.div variants={itemAnim} className="flex flex-col gap-3">
          <div className="relative w-full aspect-[16/9] sm:aspect-[24/9] rounded-3xl overflow-hidden border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <Image
              src="/portraits/genai-training.jpg"
              alt="Satya Sai Nagubathula leading a Gen AI training session"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover object-center"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-sans text-[#86868b] px-1">
            <span>Field Note: GenAI Engineering Session · NxtWave Campus · 36+ Engineers Mentored</span>
            <span className="text-[11px] text-[#86868b]">
              Co-Pilot Note: Simba (Chief Moral Officer) verified the sunbeam warming threshold
            </span>
          </div>
        </motion.div>

        {/* Principles of Craft */}
        <motion.div variants={itemAnim} className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-2xl sm:text-4xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.03em]">
              Principles of Craft
            </h2>
            <p className="text-sm sm:text-base text-[#86868b] max-w-2xl leading-relaxed font-sans">
              The operating philosophy behind every line of code, design token, and generative model I deploy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="p-6 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#86868b] mb-2 font-medium">01 / MATERIALITY</div>
                <h3 className="text-lg font-sans font-semibold text-[#1d1d1f] tracking-tight mb-2">
                  Code is Physical
                </h3>
                <p className="text-sm text-[#515154] font-sans leading-relaxed">
                  Just like copper conductivity or wood grain, software has tactile physics: frame budgets, layout recalculations, and latency. Great interfaces respect render physics.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#86868b] mb-2 font-medium">02 / CURATION</div>
                <h3 className="text-lg font-sans font-semibold text-[#1d1d1f] tracking-tight mb-2">
                  Taste is the Moat
                </h3>
                <p className="text-sm text-[#515154] font-sans leading-relaxed">
                  Anyone can prompt a model; distinction lies in system architecture. We build deterministic pipelines with structured JSON schema around non-deterministic AI intelligence.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#86868b] mb-2 font-medium">03 / SOVEREIGNTY</div>
                <h3 className="text-lg font-sans font-semibold text-[#1d1d1f] tracking-tight mb-2">
                  Local-First Ownership
                </h3>
                <p className="text-sm text-[#515154] font-sans leading-relaxed">
                  Tools should empower creators rather than hold data hostage. Dedicated to open file formats (Markdown, SQLite), offline resilience, and bloatware-free software.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#86868b] mb-2 font-medium">04 / COMMUNITY</div>
                <h3 className="text-lg font-sans font-semibold text-[#1d1d1f] tracking-tight mb-2">
                  Decentralize Knowledge
                </h3>
                <p className="text-sm text-[#515154] font-sans leading-relaxed">
                  Knowledge compounds when shared without gatekeeping. From building Engineerudu to public speaking and workshops, engineering is fundamentally an act of community.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action CTA Row */}
        <motion.div variants={itemAnim} className="flex flex-wrap items-center gap-3 sm:gap-4 pt-6 border-t border-black/[0.06]">
          <AnimatedButton href="mailto:nagubathula.satyasai@gmail.com" isPrimary={true}>
            Get in Touch
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
