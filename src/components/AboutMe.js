"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import VennDiagram from "./VennDiagram";
import ExperienceTable from "./ExperienceTable";

const STATS = [
  { value: "6", label: "Years Experience" },
  { value: "280+", label: "Clients Served" },
  { value: "2,000+", label: "AI Video Pipelines" },
  { value: "36", label: "Students Mentored" },
  { value: "3", label: "Film Credits" },
];

function StatTile({ stat }) {
  return (
    <div className="flex aspect-[5/4] w-[72vw] max-w-[360px] shrink-0 flex-col justify-between rounded-3xl border border-black/[0.06] bg-white p-7 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:p-8">
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#86868b]">{stat.label}</span>
      <span className="text-6xl font-semibold tracking-[-0.05em] text-[#111111] sm:text-7xl">{stat.value}</span>
    </div>
  );
}

function StatsIntro() {
  return (
    <div className="flex w-[60vw] max-w-[280px] shrink-0 flex-col justify-center pr-4">
      <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#111111] sm:text-5xl">By the numbers</h2>
      <p className="mt-3 text-sm text-[#86868b]">Six years of design, engineering, and AI work.</p>
    </div>
  );
}

// The stats as a row of tiles. Scrolling down pins the row and slides it
// sideways, one pixel across for each pixel down, until the last tile is in
// view; then the page carries on. With reduced motion it is a row to swipe.
function StatsTiles() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reduceMotion = useReducedMotion();
  // How far the row has to travel: its width beyond the screen's.
  const [distance, setDistance] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduceMotion]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (progress) => x.set(-progress * distance));
  useEffect(() => x.set(-scrollYProgress.get() * distance), [distance, scrollYProgress, x]);

  if (reduceMotion) {
    return (
      <section aria-label="By the numbers" className="ml-[calc(50%-50vw)] w-screen overflow-x-auto">
        <div className="flex w-max gap-5 px-[6vw] py-2">
          <StatsIntro />
          {STATS.map((stat) => (
            <StatTile key={stat.label} stat={stat} />
          ))}
        </div>
      </section>
    );
  }

  return (
    // Full-bleed, and as tall as the screen plus the sideways distance.
    <section
      ref={sectionRef}
      aria-label="By the numbers"
      className="relative ml-[calc(50%-50vw)] w-screen"
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-stretch gap-5 px-[6vw]">
          <StatsIntro />
          {STATS.map((stat) => (
            <StatTile key={stat.label} stat={stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default function AboutMe() {
  return (
    <div className="mx-auto w-full max-w-6xl text-[#1d1d1f] flex flex-col gap-14 sm:gap-20 pb-16 sm:pb-24">
      {/* The page's heading, for screen readers and search; the page itself opens on the Venn. */}
      <h1 className="sr-only">About Satya Sai Nagubathula, AI + Design Engineer</h1>

      {/* 1) VENN DIAGRAM (Me in a VENN: Designer, Engineer, AI) */}
      <div id="who-am-i" className="scroll-mt-24 w-full">
        <VennDiagram />
      </div>

      {/* 2) STATS: tiles that slide sideways as you scroll */}
      <StatsTiles />

      {/* 3) EXPERIENCE TABLE (Company History, Roles, Tech Stack) */}
      <div id="experience" className="scroll-mt-24 w-full">
        <ExperienceTable />
      </div>
    </div>
  );
}
