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
      {/* Apple-grade dynamic route progress beam (600ms) */}
      <motion.div
        key={`beam-${pathname}`}
        initial={{ scaleX: 0, opacity: 0.85 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ transformOrigin: "0% 50%" }}
        className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none bg-gradient-to-r from-transparent via-[#1d1d1f] to-transparent shadow-[0_1px_6px_rgba(0,0,0,0.25)]"
      />

      {/* 
        The page host container:
        The background stays steady, while the individual elements (cards, text, buttons, avatar, images)
        are individually warped, stretched into funnels, and sucked into the black hole!
      */}
      <div
        id="black-hole-page"
        key={`page-${pathname}`}
        className="min-h-screen w-full relative"
      >
        {children}
      </div>
    </>
  );
}
