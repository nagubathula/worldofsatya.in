"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { canViewTransition, EASE_OUT } from "@/lib/motion";

// Template remounts on every navigation. This is set after the first client
// mount so later pages can crossfade, while the hydrated page matches the HTML.
let viewTransitionsReady = false;

export default function Template({ children }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  // useReducedMotion() is null on the server and a boolean on the client.
  // Keep the first paint identical, then apply the real setting.
  const [reduceMotion, setReduceMotion] = useState(false);
  const crossfade = viewTransitionsReady && !reduceMotion;

  useEffect(() => {
    viewTransitionsReady = canViewTransition();
    setReduceMotion(prefersReducedMotion === true);
  }, [prefersReducedMotion]);

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } catch {
      window.scrollTo(0, 0);
    }
    // Wait two frames, and cancel on cleanup, so Strict Mode's first mount
    // does not snapshot the page before the real one is painted.
    let outer = 0;
    let inner = 0;
    outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => {
        window.dispatchEvent(new Event("page-ready"));
      });
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [pathname]);

  return (
    <>
      <motion.div
        key={`beam-${pathname}`}
        initial={{ scaleX: 0, opacity: reduceMotion ? 0 : 0.7 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.9, ease: EASE_OUT }}
        style={{ transformOrigin: "0% 50%" }}
        className="pointer-events-none fixed left-0 right-0 top-0 z-[9999] h-[2px] bg-gradient-to-r from-transparent via-[#1d1d1f] to-transparent"
      />

      {!reduceMotion && (
        <motion.div
          key={`wash-${pathname}`}
          aria-hidden
          initial={{ opacity: crossfade ? 0 : 0.28 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.72, ease: EASE_OUT }}
          className="pointer-events-none fixed inset-0 z-[70] bg-[#f4f4f4]"
        />
      )}

      <motion.div
        key={`page-${pathname}`}
        initial={reduceMotion || crossfade ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.68, ease: EASE_OUT }}
        className="relative min-h-screen w-full"
      >
        {children}
      </motion.div>
    </>
  );
}
