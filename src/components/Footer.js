"use client";

import { motion } from "framer-motion";
import RetroRainbowRibbon from "./RetroRainbowRibbon";

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
      className="w-full"
    >
      <div className="py-16 sm:py-24 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col items-center justify-center text-center">
      <div suppressHydrationWarning>
        <p className="text-xs sm:text-sm font-pixel text-[#3e3832]/60 mb-3 sm:mb-4 tracking-wider uppercase">Open for Design Technologist &amp; AI Engineer roles</p>
        <motion.a
          href="mailto:nagubathula.satyasai@gmail.com"
          initial="rest"
          whileHover="hover"
          animate="rest"
          className="inline-block text-5xl sm:text-7xl md:text-8xl font-editorial font-normal text-[#3e3832] tracking-tight"
        >
          <span className="sr-only">Let&apos;s Talk.</span>
          <span aria-hidden="true" className="flex">
            {"Let's Talk.".split("").map((ch, i) => (
              <span key={i} className="relative inline-block overflow-hidden">
                <motion.span
                  variants={{ rest: { y: 0 }, hover: { y: "-100%" } }}
                  transition={{ duration: 0.25, ease: "easeInOut", delay: i * 0.02 }}
                  className="inline-block"
                >
                  {ch === " " ? " " : ch}
                </motion.span>
                <motion.span
                  variants={{ rest: { y: 0 }, hover: { y: "-100%" } }}
                  transition={{ duration: 0.25, ease: "easeInOut", delay: i * 0.02 }}
                  className="absolute left-0 top-full inline-block text-[#c2410c]"
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              </span>
            ))}
          </span>
        </motion.a>
      </div>
      
      {/* 6-Stripe Apple / Polaroid Retro Rainbow Ribbon Divider */}
      <RetroRainbowRibbon className="w-full my-8 sm:my-12 rounded-[2px]" />

      <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm font-pixel text-[#3e3832]/60" suppressHydrationWarning>
        <p>© {new Date().getFullYear()} Satya Sai Nagubathula</p>
        <div className="flex gap-4 sm:gap-6 mt-4 md:mt-0" suppressHydrationWarning>
          <a href="https://www.linkedin.com/in/satyasainagubathula" target="_blank" rel="noopener noreferrer" className="hover:text-[#3e3832] transition-colors">LinkedIn</a>
          <a href="https://hippogriff.medium.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#3e3832] transition-colors">Medium</a>
          <a href="mailto:nagubathula.satyasai@gmail.com" className="hover:text-[#3e3832] transition-colors">Email</a>
        </div>
      </div>
      </div>
    </motion.footer>
  );
}
