"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto w-full pt-20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <p className="text-sm md:text-base font-medium text-black/60">
          Satya Sai Nagubathula
        </p>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-[12vw] sm:text-7xl md:text-8xl lg:text-[110px] font-medium leading-[0.9] tracking-[-0.04em] max-w-5xl text-black"
      >
        AI Pipeline Architect & Creative Technologist.
      </motion.h1>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-16 sm:mt-24 max-w-2xl"
      >
        <p className="text-lg sm:text-xl text-black/70 leading-relaxed font-normal">
          I bridge the gap between creative visual direction and deep technical automation. Currently architecting multi-modal AI video pipelines and building tools that scale digital content production by 90%.
        </p>
        
        <div className="mt-8 flex gap-6">
          <a href="mailto:nagubathula.satyasai@gmail.com" className="text-sm font-medium hover:text-black/50 transition-colors">Email</a>
          <a href="https://www.linkedin.com/in/satyasainagubathula" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-black/50 transition-colors">LinkedIn</a>
          <a href="https://hippogriff.medium.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-black/50 transition-colors">Medium</a>
        </div>
      </motion.div>
    </section>
  );
}
