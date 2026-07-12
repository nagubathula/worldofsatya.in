"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-black text-white rounded-t-[3rem] mt-32 w-full pt-32 pb-12 px-8 md:px-[110px]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-16 border-b border-white/20 pb-24">
        
        <div className="space-y-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-[52px] font-serif tracking-tight"
          >
            Built with care and late nights on my couch.
          </motion.h1>
          
          <motion.a 
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover:scale-110">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-lg font-sans text-white border-b border-white pb-1 group-hover:opacity-80">
              Let's Talk
            </span>
          </motion.a>
        </div>

        <div className="flex flex-col gap-6">
          <nav className="flex gap-8 text-xl font-sans text-white/70">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#archive" className="hover:text-white transition-colors">Archive</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-white/50 text-sm font-sans">
        <div className="flex items-center gap-4">
          <p className="text-base">Unfortunately, all good things come to an end. But drop your favourite movie and I'll try to watch it.</p>
          <button className="px-4 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-colors">
            Submit
          </button>
        </div>
        <p className="text-xl font-sans text-white">Krisby</p>
      </div>
    </footer>
  );
}
