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
            The Kid Who <span className="italic text-[#3e3832]/75">Conquering All...</span>
          </h1>
          <p className="text-base sm:text-xl text-[#3e3832]/75 font-editorial max-w-2xl leading-relaxed">
            The journey of an obsessive self-taught builder who started young, chased deep curiosity, and bridges interface craft with deep systems engineering.
          </p>
        </motion.div>

        {/* Three-Column Editorial Spread: 3 Clean Columns on Top, Satya & Cat Grounded in Center-Bottom */}
        <motion.div variants={itemAnim} className="flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* Column 1: The Early Spark & Starting Young */}
            <div className="text-sm sm:text-base lg:text-[15px] font-editorial text-[#3e3832]/85 leading-[1.62]">
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

            {/* Column 2: The Deep Dive — Obsession & The Self-Forged Mind */}
            <div className="text-sm sm:text-base lg:text-[15px] font-editorial text-[#3e3832]/85 leading-[1.62]">
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

            {/* Column 3: The Drive to Conquer & Who I Am Today */}
            <div className="text-sm sm:text-base lg:text-[15px] font-editorial text-[#3e3832]/85 leading-[1.62]">
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

          {/* Grounded Cutout Layer on the Complete Left (Satya & Simba the cat resting on rainbow ribbon) */}
          <div className="flex justify-start mt-4 sm:mt-6 lg:mt-8 relative z-20 -mb-[3px] select-none pointer-events-none">
            <img
              src="/images/about/about_main_image.png"
              alt="Satya Sai Nagubathula with cat"
              width={596}
              height={359}
              className="w-[340px] sm:w-[440px] lg:w-[490px] xl:w-[520px] h-auto object-contain drop-shadow-[0_12px_24px_rgba(62,56,50,0.14)] filter contrast-104 -mb-[3px]"
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

        {/* Narrative Arc: The Evolution (From Silicon to Synapses) */}
        <motion.div variants={itemAnim} className="flex flex-col gap-8 pt-6 border-t border-[#3e3832]/15">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-sm bg-[#3e3832]/5 text-[#3e3832]/80 text-xs font-pixel uppercase tracking-widest border border-[#3e3832]/20 w-fit">
              <Sparkles size={12} className="text-[#c2410c]" /> The Evolution
            </div>
            <h2 className="text-3xl sm:text-5xl font-editorial font-normal text-[#3e3832] tracking-tight">
              From Silicon to Synapses
            </h2>
            <p className="text-base sm:text-lg text-[#3e3832]/75 max-w-2xl leading-relaxed font-editorial">
              How a background in hardware security and tactile electronics matured into high-throughput generative AI architectures and sovereign software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chapter 1 */}
            <div className="p-6 sm:p-7 rounded-sm bg-[#fcf8f0] border-2 border-[#3e3832]/30 shadow-[3px_3px_0px_rgba(62,56,50,0.15)] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#3e3832]/15">
                  <span className="text-xs font-pixel text-[#c2410c] uppercase tracking-wider">Chapter 01</span>
                  <span className="text-[10px] font-pixel text-[#3e3832]/50">Foundations</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-editorial font-normal text-[#3e3832] tracking-tight">
                  The Silicon Crucible
                </h3>
                <p className="text-sm sm:text-[15px] text-[#3e3832]/80 font-editorial leading-relaxed">
                  Before writing web apps or neural pipelines, I probed microcontrollers with logic analyzers and oscilloscopes. From reverse-engineering firmware over JTAG/UART to presenting embedded recon at Nullcon Goa and competing as a National Finalist in the Kavach Cybersecurity Hackathon, I learned that digital systems are only as resilient as their underlying physical constraints.
                </p>
              </div>
              <div className="text-[11px] font-pixel text-[#3e3832]/60 pt-2 border-t border-[#3e3832]/10 uppercase tracking-wide">
                ✦ NASA Space Apps Galactic Impact
              </div>
            </div>

            {/* Chapter 2 */}
            <div className="p-6 sm:p-7 rounded-sm bg-[#fcf8f0] border-2 border-[#3e3832]/30 shadow-[3px_3px_0px_rgba(62,56,50,0.15)] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#3e3832]/15">
                  <span className="text-xs font-pixel text-[#c2410c] uppercase tracking-wider">Chapter 02</span>
                  <span className="text-[10px] font-pixel text-[#3e3832]/50">Tactile Craft</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-editorial font-normal text-[#3e3832] tracking-tight">
                  Human-Centered Interfaces
                </h3>
                <p className="text-sm sm:text-[15px] text-[#3e3832]/80 font-editorial leading-relaxed">
                  Realizing that complex technology fails if humans cannot intuitively wield it, I shifted toward interface architecture. When elderly hostel wardens struggled with complex mobile screens, I engineered a physical Public Address console with mechanical rotary dials and high-contrast toggles. That tactile discipline became the blueprint for building accessible digital design systems like Chaya UI.
                </p>
              </div>
              <div className="text-[11px] font-pixel text-[#3e3832]/60 pt-2 border-t border-[#3e3832]/10 uppercase tracking-wide">
                ✦ 280+ Global Client Deliveries
              </div>
            </div>

            {/* Chapter 3 */}
            <div className="p-6 sm:p-7 rounded-sm bg-[#fcf8f0] border-2 border-[#3e3832]/30 shadow-[3px_3px_0px_rgba(62,56,50,0.15)] flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#3e3832]/15">
                  <span className="text-xs font-pixel text-[#c2410c] uppercase tracking-wider">Chapter 03</span>
                  <span className="text-[10px] font-pixel text-[#3e3832]/50">The Frontier</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-editorial font-normal text-[#3e3832] tracking-tight">
                  Autonomous AI &amp; Sovereignty
                </h3>
                <p className="text-sm sm:text-[15px] text-[#3e3832]/80 font-editorial leading-relaxed">
                  At NxtWave, I lead generative AI production — orchestrating over 2,000 video generations and building structured prompt pipelines that scale channels to 100K+ followers while cutting production cycle times by 90%. Simultaneously, I build local-first sovereign tools like NotBad (an offline markdown editor) and run Engineerudu to keep open-source spirit alive.
                </p>
              </div>
              <div className="text-[11px] font-pixel text-[#3e3832]/60 pt-2 border-t border-[#3e3832]/10 uppercase tracking-wide">
                ✦ Founder, Engineerudu FOSS Community
              </div>
            </div>
          </div>
        </motion.div>

        {/* Teaching & Visual Proof with Editorial Micro-Badge */}
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-pixel text-[#3e3832]/70 uppercase tracking-wider px-1">
            <span>Field Note: GenAI Engineering Session · NxtWave Campus · 36+ Engineers Mentored</span>
            <span className="text-[11px] text-[#3e3832]/50">
              Co-Pilot Note: Simba (Chief Moral Officer) verified the sunbeam warming threshold
            </span>
          </div>
        </motion.div>

        {/* Principles of Craft (Replacing generic Core Competencies) */}
        <motion.div variants={itemAnim} className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl sm:text-5xl font-editorial font-normal text-[#3e3832] tracking-tight">
              Principles of Craft
            </h2>
            <p className="text-base sm:text-lg text-[#3e3832]/75 max-w-2xl leading-relaxed font-editorial">
              The operating philosophy behind every line of code, design token, and generative model I deploy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="p-5 sm:p-6 retro-card flex flex-col justify-between">
              <div>
                <div className="text-xs font-pixel text-[#c2410c] mb-2 tracking-wider">01 / MATERIALITY</div>
                <h3 className="text-xl font-editorial font-normal text-[#3e3832] tracking-tight mb-2">
                  Code is Physical
                </h3>
                <p className="text-sm text-[#3e3832]/80 font-editorial leading-relaxed">
                  Just like copper conductivity or wood grain, software has tactile physics: frame budgets, layout recalculations, and latency. Great interfaces respect render physics.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 retro-card flex flex-col justify-between">
              <div>
                <div className="text-xs font-pixel text-[#c2410c] mb-2 tracking-wider">02 / CURATION</div>
                <h3 className="text-xl font-editorial font-normal text-[#3e3832] tracking-tight mb-2">
                  Taste is the Moat
                </h3>
                <p className="text-sm text-[#3e3832]/80 font-editorial leading-relaxed">
                  Anyone can prompt a model; distinction lies in system architecture. We build deterministic pipelines with structured JSON schema around non-deterministic AI intelligence.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 retro-card flex flex-col justify-between">
              <div>
                <div className="text-xs font-pixel text-[#c2410c] mb-2 tracking-wider">03 / SOVEREIGNTY</div>
                <h3 className="text-xl font-editorial font-normal text-[#3e3832] tracking-tight mb-2">
                  Local-First Ownership
                </h3>
                <p className="text-sm text-[#3e3832]/80 font-editorial leading-relaxed">
                  Tools should empower creators rather than hold data hostage. Dedicated to open file formats (Markdown, SQLite), offline resilience, and bloatware-free software.
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 retro-card flex flex-col justify-between">
              <div>
                <div className="text-xs font-pixel text-[#c2410c] mb-2 tracking-wider">04 / COMMUNITY</div>
                <h3 className="text-xl font-editorial font-normal text-[#3e3832] tracking-tight mb-2">
                  Decentralize Knowledge
                </h3>
                <p className="text-sm text-[#3e3832]/80 font-editorial leading-relaxed">
                  Knowledge compounds when shared without gatekeeping. From building Engineerudu to public speaking and workshops, engineering is fundamentally an act of community.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Retro Action CTA Row */}
        <motion.div variants={itemAnim} className="flex flex-wrap items-center gap-3 sm:gap-4 pt-6 border-t border-[#3e3832]/15">
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
