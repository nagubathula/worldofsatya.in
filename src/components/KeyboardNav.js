"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useBlackHoleTransition } from "./BlackHoleTransition";
import { markReturnToWorks } from "@/lib/worksReturn";

// Keys that would mean something else where they are pressed.
const TYPING = "input, textarea, select, video, audio, [contenteditable='true'], [role='slider']";

// Esc goes up a level: a project to the works list, any other page home.
function parentOf(pathname) {
  return pathname.startsWith("/works/") ? "/works" : "/";
}

// Site-wide keys for a site without a navbar: Esc goes up, the arrow keys
// follow the Back/Next links at the end of the page. Home and the gallery
// keep their own keys (the flip card and the camera use them).
export default function KeyboardNav() {
  const pathname = usePathname();
  const { navigate } = useBlackHoleTransition();

  useEffect(() => {
    if (pathname === "/" || pathname.startsWith("/gallery")) return;

    const onKey = (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      if (event.target instanceof Element && event.target.closest(TYPING)) return;
      // An open dialog (video player, code prompt) gets the keys first.
      if (document.querySelector("[aria-modal='true']")) return;

      if (event.key === "Escape") {
        const parent = parentOf(pathname);
        if (parent === "/works") markReturnToWorks();
        navigate(parent);
        return;
      }

      const rel = event.key === "ArrowLeft" ? "prev" : event.key === "ArrowRight" ? "next" : null;
      if (!rel) return;
      const link = document.querySelector(`nav[aria-label="More pages"] a[rel="${rel}"]`);
      if (!link) return;
      event.preventDefault();
      // A click, so it takes the same page transition as a pointer would.
      link.click();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, navigate]);

  return null;
}
