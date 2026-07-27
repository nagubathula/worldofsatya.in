"use client";

import MagneticElement from "./MagneticElement";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AnimatedButton({ href, children, isPrimary = false, className = "", ...props }) {
  const content = (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className={`relative overflow-hidden flex items-center justify-center px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full transition-colors ${
        isPrimary 
          ? "bg-black text-white hover:bg-black/90" 
          : "bg-transparent text-black border border-black/10 hover:border-black/30 hover:bg-black/5"
      } ${className}`}
    >
      <div className="relative flex flex-col h-5 overflow-hidden">
        <span className="flex items-center justify-center h-5 shrink-0 font-medium text-xs sm:text-sm transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span className="flex items-center justify-center h-5 shrink-0 font-medium text-xs sm:text-sm text-[#e08a3a] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full" aria-hidden="true">
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
          <div className="relative shrink-0">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-500 rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
            <LinkWrapper className="relative block shrink-0" {...linkProps}>{content}</LinkWrapper>
          </div>
        ) : (
          <LinkWrapper className="block shrink-0" {...linkProps}>{content}</LinkWrapper>
        )}
      </div>
    </MagneticElement>
  );
}
