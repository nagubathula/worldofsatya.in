"use client";

import { motion } from "framer-motion";

const TECH_STACK = [
  "React",
  "Next.js",
  "Python",
  "Tailwind CSS",
  "Framer Motion",
  "ComfyUI",
  "Stable Diffusion",
  "Node.js",
  "PostgreSQL",
  "Supabase",
  "Figma",
  "AWS",
];

export default function TechStackMarquee() {
  // Repeat the stack 4 times to ensure seamless infinite scroll on ultra-wide screens without gaps
  const marqueeItems = [...TECH_STACK, ...TECH_STACK, ...TECH_STACK, ...TECH_STACK];

  return (
    <div className="w-full py-8 sm:py-14 overflow-hidden relative z-10 flex flex-col gap-4 sm:gap-6">
      <div className="w-full text-center px-4">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-foreground/60">Core Arsenal</p>
      </div>
      
      {/* Full-bleed infinite marquee banner */}
      <div 
        className="relative w-full flex overflow-hidden py-3"
        style={{ 
          maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)', 
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)' 
        }}
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          className="flex whitespace-nowrap items-center gap-4 sm:gap-6 shrink-0"
        >
          {marqueeItems.map((tech, i) => (
            <div 
              key={i} 
              className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full border border-foreground/5 bg-background/50 backdrop-blur-xl shadow-sm text-foreground/80 font-medium text-sm sm:text-base flex items-center gap-2.5 sm:gap-3 hover:bg-background/80 hover:scale-105 transition-all duration-300 cursor-default shrink-0"
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-400"></div>
              {tech}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
