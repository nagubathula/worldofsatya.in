"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Template({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Reset window scroll position on page transition
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <>
      {/* Apple-grade dynamic route progress beam */}
      <motion.div
        key={`beam-${pathname}`}
        initial={{ scaleX: 0, opacity: 0.9 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none bg-gradient-to-r from-[#86868b] via-[#1d1d1f] to-[#86868b] shadow-[0_1px_8px_rgba(0,0,0,0.25)]"
      />

      {/* Ultra-smooth spatial content entrance */}
      <motion.div
        key={`page-${pathname}`}
        initial={{ opacity: 0, y: 16, scale: 0.992 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.65, 
          ease: [0.22, 1, 0.36, 1], // Smooth Apple-style fluid easeOut
        }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </>
  );
}
