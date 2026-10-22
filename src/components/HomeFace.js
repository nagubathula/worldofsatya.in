"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import ChibiAvatarButton from "./ChibiAvatarButton";
import { SPRING } from "@/lib/motion";

// Scrolling less than this is a wobble, not a direction.
const JITTER = 6;
// Near the top there is nothing under the face to cover.
const TOP = 80;

// The face from the home page, kept in the corner of every other page as the
// way back home. No navbar: the face is the site's mark, so it is the link.
// It ducks out while you scroll down to read and comes back when you scroll up.
export default function HomeFace() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(false);
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < JITTER) return;
      setHidden(y > lastY && y > TOP);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname === "/") return null;

  // Its own transition name keeps it still while the page changes under it.
  return (
    <motion.div
      data-home-face
      style={{ viewTransitionName: "home-face" }}
      animate={hidden ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
      transition={SPRING.enter}
      // Tabbing to it brings it back, so keyboard users never lose it.
      onFocus={() => setHidden(false)}
      className={`fixed left-4 top-4 z-50 sm:left-6 sm:top-6 ${hidden ? "pointer-events-none" : ""}`}
    >
      <ChibiAvatarButton href="/" label="Home" size={48} />
    </motion.div>
  );
}
