"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedButton from "./AnimatedButton";

const stats = [
  { value: "100K+", label: "Followers scaled" },
  { value: "2,000+", label: "Videos orchestrated" },
  { value: "90%", label: "Faster production" },
];

const pillars = [
  {
    title: "Frontend Engineering",
    description:
      "Pixel-perfect, motion-rich interfaces built with React, Next.js, and Tailwind — engineered to feel as good as they look.",
  },
  {
    title: "Product Design",
    description:
      "From brand identity to design systems — I've designed for startups, government, e-commerce, and open-source communities.",
  },
  {
    title: "Generative AI",
    description:
      "Multi-modal AI video pipelines and automation tools built on ComfyUI, Stable Diffusion, and structured prompting for models like Veo 3 and Wan 2.2.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25, mass: 0.8 },
  },
};

export default function AboutMe() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full py-16 sm:py-24"
    >
      <div className="px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col gap-10 sm:gap-14">
        {/* Header */}
        <motion.div variants={itemAnim}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 text-foreground/60 text-xs font-medium mb-4 uppercase tracking-widest">
            <User size={14} /> About
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold text-foreground tracking-tight mb-4 sm:mb-6">
            The AI/UI Guy.
          </h1>
          <p className="text-sm sm:text-lg text-foreground/60 max-w-2xl leading-relaxed">
            Engineering AI to build better and faster products — from pixel-perfect
            interfaces to multi-modal generative pipelines.
          </p>
        </motion.div>

        {/* Portrait + Bio */}
        <motion.div variants={itemAnim} className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start">
          <div className="relative w-full sm:w-64 aspect-square rounded-3xl overflow-hidden shrink-0 border border-foreground/[0.05] shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <Image
              src="/main.jpeg"
              alt="Satya Sai Nagubathula"
              fill
              sizes="(max-width: 640px) 100vw, 256px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col gap-4 text-base sm:text-lg text-foreground/70 leading-relaxed">
            <p>
              I&apos;m <span className="font-semibold text-foreground">Satya Sai Nagubathula</span> —
              a Generative AI Engineer and Creative Lead at NXTWAVE Disruptive Technologies,
              working at the intersection of frontend engineering, product design, and
              generative AI.
            </p>
            <p>
              My journey started in design — brand identities, UI, and Figma — and grew
              through hardware security research, full-stack development, and government
              and startup product work. Today I lead AI production pipelines that scale
              digital content creation, and build the internal tools that make it fast.
            </p>
            <p>
              Outside of work, I give back through open source — building{" "}
              <span className="font-semibold text-foreground">Engineerudu</span>, Andhra
              Pradesh&apos;s first FOSS community, and contributing to design systems like
              Chaya UI.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemAnim} className="grid grid-cols-3 gap-4 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl sm:text-4xl font-semibold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-foreground/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* What I do */}
        <motion.div variants={itemAnim} className="flex flex-col gap-4 sm:gap-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
            What I do
          </h2>
          <div className="flex flex-col gap-4">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="p-5 sm:p-8 bg-background rounded-2xl sm:rounded-3xl border border-foreground/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Links */}
        <motion.div variants={itemAnim} className="flex flex-wrap items-center gap-2 sm:gap-4">
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
