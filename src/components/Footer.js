"use client";

import { motion } from "framer-motion";

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
        <p className="text-xs sm:text-sm font-mono text-foreground/40 mb-3 sm:mb-4">Open for Frontend Engineering, Product Design &amp; Generative AI roles</p>
        <motion.a
          href="mailto:nagubathula.satyasai@gmail.com"
          initial="rest"
          whileHover="hover"
          animate="rest"
          className="inline-block text-4xl sm:text-6xl md:text-7xl font-medium text-foreground tracking-tight"
        >
          <span className="sr-only">Let's Talk.</span>
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
                  className="absolute left-0 top-full inline-block text-foreground/60"
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              </span>
            ))}
          </span>
        </motion.a>
      </div>
      
      <div className="mt-16 sm:mt-32 w-full flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm text-foreground/40" suppressHydrationWarning>
        <p>© {new Date().getFullYear()} Satya Sai Nagubathula</p>
        <div className="flex gap-4 sm:gap-6 mt-4 md:mt-0" suppressHydrationWarning>
          <a href="https://www.linkedin.com/in/satyasainagubathula" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
          <a href="https://hippogriff.medium.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Medium</a>
          <a href="mailto:nagubathula.satyasai@gmail.com" className="hover:text-foreground transition-colors">Email</a>
        </div>
        </div>
      </div>
    </motion.footer>
  );
}
