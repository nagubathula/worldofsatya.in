"use client";

import MagneticElement from "./MagneticElement";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AnimatedButton({ href, children, isPrimary = false, className = "", ...props }) {
  const content = (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className={`relative overflow-hidden flex items-center justify-center px-5 sm:px-6 py-2.5 rounded-full transition-all duration-200 font-sans font-medium text-xs sm:text-sm ${
        isPrimary 
          ? "bg-[#1d1d1f] text-white shadow-sm hover:bg-[#333336]" 
          : "bg-[#f5f5f7] text-[#1d1d1f] border border-black/[0.04] hover:bg-[#e8e8ed]"
      } ${className}`}
    >
      <div className="relative flex flex-col h-5 overflow-hidden">
        <span className="flex items-center justify-center h-5 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-full">
          {children}
        </span>
        <span className="flex items-center justify-center h-5 shrink-0 text-[#0071e3] transition-transform duration-300 ease-out group-hover:-translate-y-full font-medium" aria-hidden="true">
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
        <LinkWrapper className="relative block shrink-0" {...linkProps}>{content}</LinkWrapper>
      </div>
    </MagneticElement>
  );
}
