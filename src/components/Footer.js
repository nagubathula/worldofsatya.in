"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="py-24 px-6 sm:px-12 max-w-7xl mx-auto w-full border-t border-black/5 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <p className="text-sm font-mono text-black/40 mb-4">Open for new opportunities</p>
        <a 
          href="mailto:nagubathula.satyasai@gmail.com"
          className="text-5xl md:text-7xl font-medium text-black hover:opacity-50 transition-opacity tracking-tight"
        >
          Let's Talk.
        </a>
      </motion.div>
      
      <div className="mt-32 w-full flex flex-col md:flex-row justify-between items-center text-sm text-black/40">
        <p>© {new Date().getFullYear()} Satya Sai Nagubathula</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="https://www.linkedin.com/in/satyasainagubathula" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">LinkedIn</a>
          <a href="https://hippogriff.medium.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">Medium</a>
          <a href="mailto:nagubathula.satyasai@gmail.com" className="hover:text-black transition-colors">Email</a>
        </div>
      </div>
    </footer>
  );
}
