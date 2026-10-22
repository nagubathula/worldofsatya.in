"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { stagger, useAnimate } from "framer-motion";
import ChibiAvatar from "./ChibiAvatar";
import { onTransitionScreen, screenLabel } from "@/lib/transitionScreen";
import { EASE_OUT, SPRING } from "@/lib/motion";

// A slow-in, slow-out sweep: the curtain gathers speed, then settles.
const SWEEP = [0.76, 0, 0.24, 1];
// Long enough to read the name, short enough not to feel like loading.
const MIN_HOLD = 300;
// Never wait on a page longer than this before lifting the curtain.
const MAX_WAIT = 1500;
// The curved edge, as a share of the screen height.
const LIP = 0.2;

// The curtain's edges, in a 100 x 100 box stretched across the screen.
// The leading edge bulges up while it climbs and lies flat once it lands;
// the trailing edge starts flat and sags as the curtain is pulled away.
const EDGE = {
  rising: "M0 100 Q50 0 100 100 Z",
  landed: "M0 100 Q50 100 100 100 Z",
  taut: "M0 0 Q50 0 100 0 Z",
  sagging: "M0 0 Q50 100 100 0 Z",
};

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// Resolves when the new page has mounted (template.js fires page-ready).
function pageReady() {
  return new Promise((resolve) => {
    const done = () => {
      window.removeEventListener("page-ready", done);
      resolve();
    };
    window.addEventListener("page-ready", done);
    window.setTimeout(done, MAX_WAIT);
  });
}

// The page under the curtain (template.js), so it can move with it.
function currentPage() {
  return document.querySelector("[data-page-root]");
}

// The transition screen between sections: a dark curtain with a soft curved
// edge sweeps up over the page, pushing it aside; the face and where you're
// headed spell in; the next page loads behind it and rises into place as the
// curtain is pulled off the top.
export default function TransitionScreen() {
  const [scope, animate] = useAnimate();
  const [label, setLabel] = useState(null);
  const busy = useRef(false);

  useEffect(
    () =>
      onTransitionScreen(({ href, go }) => {
        // A second click mid-sweep just goes; the curtain is already up.
        if (busy.current) return false;
        busy.current = true;

        const run = async () => {
          // Rendered now, so the name is there to animate in.
          flushSync(() => setLabel(screenLabel(href.split(/[?#]/)[0])));
          const curtain = scope.current;
          // Far enough down that the curved edge starts out of sight too.
          const travel = window.innerHeight * (1 + LIP);
          curtain.style.visibility = "visible";

          const leaving = currentPage();
          await Promise.all([
            animate(curtain, { y: [travel, 0] }, { duration: 0.75, ease: SWEEP }),
            animate("[data-edge='top']", { d: [EDGE.rising, EDGE.landed] }, { duration: 0.75, ease: SWEEP }),
            leaving &&
              animate(leaving, { y: [0, -96], scale: [1, 0.96], opacity: [1, 0.4] }, { duration: 0.75, ease: SWEEP }),
            animate("[data-screen-face]", { opacity: [0, 1], scale: [0.4, 1], rotate: [-14, 0] }, { ...SPRING.pop, delay: 0.38 }),
            animate("[data-screen-eyebrow]", { opacity: [0, 1], y: [8, 0] }, { duration: 0.4, ease: EASE_OUT, delay: 0.45 }),
            animate("[data-screen-char]", { y: ["110%", "0%"] }, { duration: 0.55, ease: EASE_OUT, delay: stagger(0.035, { startDelay: 0.48 }) }),
          ]);

          const ready = pageReady();
          go();
          await Promise.all([ready, wait(MIN_HOLD)]);

          const arriving = currentPage();
          await Promise.all([
            animate("[data-screen-char]", { y: "-110%" }, { duration: 0.35, ease: SWEEP, delay: stagger(0.025) }),
            animate("[data-screen-eyebrow]", { opacity: 0, y: -8 }, { duration: 0.25, ease: SWEEP }),
            animate("[data-screen-face]", { opacity: 0, scale: 0.8, y: -16 }, { duration: 0.3, ease: SWEEP, delay: 0.05 }),
            animate(curtain, { y: -travel }, { duration: 0.8, ease: SWEEP, delay: 0.18 }),
            animate("[data-edge='bottom']", { d: [EDGE.taut, EDGE.sagging] }, { duration: 0.5, ease: SWEEP, delay: 0.18 }),
            arriving &&
              animate(arriving, { y: [140, 0], scale: [0.97, 1], opacity: [0.6, 1] }, { duration: 0.9, ease: EASE_OUT, delay: 0.3 }),
          ]);

          // Hand the page back without our transform on it (it would trap position: fixed).
          if (arriving) {
            arriving.style.transform = "";
            arriving.style.opacity = "";
          }
          curtain.style.visibility = "hidden";
          setLabel(null);
          busy.current = false;
        };

        run().catch(() => {
          // If anything breaks, still get the visitor where they were going.
          go();
          if (scope.current) scope.current.style.visibility = "hidden";
          const page = currentPage();
          if (page) {
            page.style.transform = "";
            page.style.opacity = "";
          }
          setLabel(null);
          busy.current = false;
        });
      }),
    [animate, scope]
  );

  return (
    <div
      ref={scope}
      aria-hidden={label ? undefined : true}
      role={label ? "status" : undefined}
      aria-live="polite"
      style={{ visibility: "hidden", transform: "translateY(120vh)" }}
      className="pointer-events-auto fixed inset-0 z-[100] bg-[#111111] text-white"
    >
      {/* The curved edges, outside the box: one leads the climb, one trails the exit.
          Each overlaps the box by a pixel so no seam shows where they meet. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute bottom-full left-0 -mb-px w-full"
        style={{ height: `${LIP * 100}vh` }}
      >
        <path data-edge="top" d={EDGE.rising} fill="#111111" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute left-0 top-full -mt-px w-full"
        style={{ height: `${LIP * 100}vh` }}
      >
        <path data-edge="bottom" d={EDGE.taut} fill="#111111" />
      </svg>

      {/* Mounted only while showing: the face plays its intro once per load, and that belongs to home. */}
      {label && (
        <div className="flex h-full w-full flex-col items-center justify-center px-4">
          <div data-screen-face className="h-24 w-24 opacity-0 sm:h-28 sm:w-28">
            <ChibiAvatar className="h-full w-full" />
          </div>
          <p data-screen-eyebrow className="mt-6 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50 opacity-0">
            Going to
          </p>
          <p className="mt-1 text-5xl font-semibold leading-[1.1] tracking-[-0.045em] sm:text-7xl" aria-label={label}>
            {[...label, "."].map((char, i, chars) => (
              // Each letter slides up out of its own mask.
              <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span
                  data-screen-char
                  className={`inline-block ${i === chars.length - 1 ? "text-[#2ec4f0]" : ""}`}
                  style={{ transform: "translateY(110%)" }}
                >
                  {char === " " ? " " : char}
                </span>
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
