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
  // We duplicate the stack array to create a seamless infinite scroll loop
  const marqueeItems = [...TECH_STACK, ...TECH_STACK];

  return (
    <div className="w-full py-12 overflow-hidden relative z-10 flex flex-col gap-6">
      <div className="px-6 sm:px-12 max-w-7xl mx-auto w-full text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-black/60">Core Arsenal</p>
      </div>
      
      {/* Use CSS mask-image to perfectly fade out the edges over the sky background */}
      <div 
        className="relative w-full flex overflow-hidden py-4"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 35, ease: "linear", repeat: Infinity }}
          className="flex whitespace-nowrap items-center gap-4 sm:gap-6 px-4 shrink-0"
        >
          {marqueeItems.map((tech, i) => (
            <div 
              key={i} 
              className="px-6 py-3 rounded-full border border-black/5 bg-white/40 backdrop-blur-xl shadow-sm text-black/80 font-medium text-lg flex items-center gap-3 hover:bg-white/60 hover:scale-105 transition-all duration-300 cursor-default"
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
