"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <div className="py-16 sm:py-24 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col items-center justify-center text-center">
        <div suppressHydrationWarning>
          <p className="text-xs sm:text-sm font-sans text-[#86868b] mb-3 sm:mb-4 tracking-wider uppercase font-medium">
            Open for AI + Design Engineer roles
          </p>
          <motion.a
            href="mailto:nagubathula.satyasai@gmail.com"
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="inline-block text-5xl sm:text-7xl md:text-8xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.04em]"
          >
            <span className="sr-only">Let&apos;s Talk.</span>
            <span aria-hidden="true" className="flex">
              {"Let's Talk.".split("").map((ch, i) => (
                <span key={i} className="relative inline-block overflow-hidden">
                  <motion.span
                    variants={{ rest: { y: 0 }, hover: { y: "-100%" } }}
                    transition={{ duration: 0.22, ease: "easeInOut", delay: i * 0.02 }}
                    className="inline-block"
                  >
                    {ch === " " ? " " : ch}
                  </motion.span>
                  <motion.span
                    variants={{ rest: { y: 0 }, hover: { y: "-100%" } }}
                    transition={{ duration: 0.22, ease: "easeInOut", delay: i * 0.02 }}
                    className="absolute left-0 top-full inline-block text-[#0071e3]"
                  >
                    {ch === " " ? " " : ch}
                  </motion.span>
                </span>
              ))}
            </span>
          </motion.a>
        </div>
        
        {/* Subtle Minimal Apple Divider */}
        <div className="w-full h-px bg-black/[0.06] my-10 sm:my-14" />

        <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm font-sans text-[#86868b]" suppressHydrationWarning>
          <p>© {new Date().getFullYear()} Satya Sai Nagubathula</p>
          <div className="flex gap-4 sm:gap-6 mt-4 md:mt-0" suppressHydrationWarning>
            <a href="https://www.linkedin.com/in/satyasainagubathula" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors">LinkedIn</a>
            <a href="https://hippogriff.medium.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1d1d1f] transition-colors">Medium</a>
            <a href="mailto:nagubathula.satyasai@gmail.com" className="hover:text-[#1d1d1f] transition-colors">Email</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
