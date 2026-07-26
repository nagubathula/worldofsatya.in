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
    <div className="w-full overflow-hidden bg-black py-4 md:py-6 border-y border-black/10 flex items-center relative">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {marqueeItems.map((tech, index) => (
          <div
            key={index}
            className="flex items-center justify-center px-8"
          >
            <span className="text-white/80 text-sm md:text-base font-mono uppercase tracking-widest font-semibold">
              {tech}
            </span>
            <span className="ml-8 text-white/30">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
