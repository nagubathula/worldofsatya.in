"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import VennDiagram from "./VennDiagram";
import ExperienceTable from "./ExperienceTable";
import { useReducedMotionAfterHydration } from "@/lib/reducedMotion";

const STATS = [
  { value: "6", label: "Years Experience" },
  { value: "280+", label: "Clients Served" },
  // The biggest number gets the dark tile, so the row has one focal point.
  { value: "2,000+", label: "AI Video Pipelines", featured: true },
  { value: "36", label: "Students Mentored" },
  { value: "3", label: "Film Credits" },
];

// "2,000+" counts up from 0 the first time it comes into view, keeping its
// commas and its "+". With reduced motion it just shows the number.
function CountUp({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const target = Number(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9,]/g, "");
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, target, {
      duration: target > 100 ? 1.4 : 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (n) => setShown(`${Math.round(n).toLocaleString("en-US")}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, target, suffix]);

  return (
    <span ref={ref} className="tabular-nums" aria-label={value}>
      {shown}
    </span>
  );
}

function StatTile({ stat, index, total }) {
  const dark = stat.featured;
  return (
    <div
      className={`flex w-[72vw] max-w-[320px] shrink-0 flex-col rounded-3xl border p-7 sm:p-8 ${
        dark
          ? "border-white/10 bg-[#1a1a1a] text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
          : "border-black/[0.06] bg-white text-[#111111] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
      }`}
    >
      <span className={`self-end text-[11px] font-medium tabular-nums ${dark ? "text-white/40" : "text-[#b0b0b5]"}`}>
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <span className="mt-6 text-6xl font-semibold tracking-[-0.05em] sm:text-7xl">
        <CountUp value={stat.value} />
      </span>
      <span className={`mt-3 text-[11px] font-medium uppercase tracking-[0.16em] ${dark ? "text-white/60" : "text-[#86868b]"}`}>
        {stat.label}
      </span>
    </div>
  );
}

function StatsIntro({ hint }) {
  return (
    <div className="flex w-full flex-col justify-center pr-4 sm:w-[60vw] sm:max-w-[280px] sm:shrink-0">
      <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#111111] sm:text-5xl">By the numbers</h2>
      <p className="mt-3 text-sm text-[#86868b]">Six years of design, engineering, and AI work.</p>
      {/* The row moves sideways as you scroll down; say so. */}
      {hint && (
        <p className="mt-6 flex items-center gap-2 text-xs font-medium text-[#86868b]">
          Scroll
          <motion.span aria-hidden="true" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            →
          </motion.span>
        </p>
      )}
    </div>
  );
}

// Phones have room for the stats as they are, so they skip the sideways ride.
// Matches Tailwind's sm breakpoint.
function usePhone() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return phone;
}

// On a phone: the heading, then a two-column grid with the featured stat across both.
function StatsGrid() {
  return (
    <section aria-label="By the numbers" className="w-full">
      <StatsIntro />
      <div className="mt-8 grid grid-cols-2 gap-3">
        {STATS.map((stat) => {
          const dark = stat.featured;
          return (
            <div
              key={stat.label}
              className={`flex flex-col rounded-3xl border p-5 ${
                dark
                  ? "order-first col-span-2 border-white/10 bg-[#1a1a1a] text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                  : "border-black/[0.06] bg-white text-[#111111] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              }`}
            >
              <span className={`font-semibold tracking-[-0.05em] ${dark ? "text-6xl" : "text-5xl"}`}>
                <CountUp value={stat.value} />
              </span>
              <span className={`mt-2 text-[10px] font-medium uppercase leading-snug tracking-[0.14em] ${dark ? "text-white/60" : "text-[#86868b]"}`}>
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// The stats as a row of tiles. Scrolling down pins the row and slides it
// sideways, one pixel across for each pixel down, until the last tile is in
// view; then the page carries on. With reduced motion it is a row to swipe.
function StatsTiles() {
  return usePhone() ? <StatsGrid /> : <StatsRow />;
}

function StatsRow() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reduceMotion = useReducedMotionAfterHydration();
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
          {STATS.map((stat, i) => (
            <StatTile key={stat.label} stat={stat} index={i} total={STATS.length} />
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
        {/* It opens on the heading, centred like the rest of the page (the intro is
            280px wide), with the tiles waiting to its right; the scroll brings them in. */}
        <motion.div ref={trackRef} style={{ x }} className="flex w-max items-center gap-5 pl-[max(6vw,calc(50vw-140px))] pr-[6vw]">
          <StatsIntro hint />
          {STATS.map((stat, i) => (
            <StatTile key={stat.label} stat={stat} index={i} total={STATS.length} />
          ))}
        </motion.div>

        {/* How far along the row you are. */}
        <div aria-hidden="true" className="absolute bottom-[12svh] left-[6vw] right-[6vw] h-px bg-black/[0.08]">
          <motion.div style={{ scaleX: scrollYProgress, originX: 0 }} className="h-full bg-[#111111]" />
        </div>
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
