"use client";

import MagneticElement from "./MagneticElement";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AnimatedButton({ href, children, isPrimary = false, className = "", ...props }) {
  const content = (
    <motion.div
      whileTap={{ scale: 0.96 }}
      className={`relative overflow-hidden flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-sm transition-all duration-150 font-pixel tracking-wider ${
        isPrimary 
          ? "bg-[#3e3832] text-[#f4ebd8] border-2 border-[#3e3832] shadow-[3px_3px_0px_rgba(62,56,50,0.3)] hover:shadow-[4px_4px_0px_rgba(62,56,50,0.4)] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(62,56,50,0.3)]" 
          : "bg-[#fdfaf3] text-[#3e3832] border-2 border-[#3e3832]/35 shadow-[3px_3px_0px_rgba(62,56,50,0.18)] hover:shadow-[4px_4px_0px_rgba(62,56,50,0.25)] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(62,56,50,0.18)]"
      } ${className}`}
    >
      <div className="relative flex flex-col h-5 overflow-hidden">
        <span className="flex items-center justify-center h-5 shrink-0 text-xs sm:text-sm transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span className="flex items-center justify-center h-5 shrink-0 text-xs sm:text-sm text-[#c2410c] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full" aria-hidden="true">
          {children}
        </span>
      </div>
    </motion.div>
  );

  const isExternal = href.startsWith('http') || href.startsWith('mailto') || href.startsWith('/files');
  const LinkWrapper = isExternal ? 'a' : Link;
  const linkProps = isExternal ? { href, target: "_blank", rel: "noopener noreferrer", ...props } : { href, ...props };

  return (
    <MagneticElement className="shrink-0">
      <div className="group shrink-0">
        {isPrimary ? (
          <LinkWrapper className="relative block shrink-0" {...linkProps}>{content}</LinkWrapper>
        ) : (
          <LinkWrapper className="block shrink-0" {...linkProps}>{content}</LinkWrapper>
        )}
      </div>
    </MagneticElement>
  );
}
