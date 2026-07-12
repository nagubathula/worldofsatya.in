"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference text-white"
    >
      <Link href="/" className="font-serif text-2xl tracking-tighter uppercase font-bold">
        Krisby
      </Link>
      
      <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <Link href="#projects" className="hover:text-white transition-colors">Projects</Link>
        <Link href="#archive" className="hover:text-white transition-colors">Archive</Link>
        <Link href="#about" className="hover:text-white transition-colors">About</Link>
      </nav>
      
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gray-300">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Open For Work
      </div>
    </motion.header>
  );
}
