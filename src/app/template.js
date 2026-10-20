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
    // A timer, not requestAnimationFrame: the browser pauses frames while a view
    // transition waits for the new page, so a frame callback would never fire.
    // Cancelling on cleanup keeps Strict Mode's first mount from signalling early.
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event("page-ready"));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  // Browsers with view transitions get the CSS page-enter in globals.css.
  // Everyone else gets a plain fade, so there is only ever one page animation.
  return (
    <motion.div
      key={`page-${pathname}`}
      initial={reduceMotion || crossfade ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.68, ease: EASE_OUT }}
      className="relative min-h-screen w-full"
    >
      {children}
    </motion.div>
  );
}
