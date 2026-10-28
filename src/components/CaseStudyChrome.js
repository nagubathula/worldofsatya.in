"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, animate } from "framer-motion";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { useReducedMotionAfterHydration } from "@/lib/reducedMotion";

// A hairline across the top that fills as you read.
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotionAfterHydration();
  const smooth = useSpring(scrollYProgress, { stiffness: 260, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduceMotion ? scrollYProgress : smooth }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-[#1d1d1f]"
    />
  );
}

// The sections down the left on wide screens, marking the one you're in.
export function CaseStudyContents({ sections }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Contents" className="sticky top-32">
      <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#86868b]">Contents</p>
      <ol className="flex flex-col">
        {sections.map(({ id, title }, i) => {
          const on = id === active;
          return (
            <li key={id} className="relative">
              {on && (
                <motion.span
                  layoutId="case-study-contents"
                  transition={SPRING.pill}
                  className="absolute -left-4 top-1.5 bottom-1.5 w-[2px] rounded-full bg-[#1d1d1f]"
                />
              )}
              <a
                href={`#${id}`}
                aria-current={on ? "true" : undefined}
                className={`flex gap-3 py-1.5 text-[13px] leading-snug transition-colors duration-200 ${on ? "text-[#1d1d1f]" : "text-[#86868b] hover:text-[#515154]"}`}
              >
                <span className="w-4 shrink-0 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="line-clamp-2">{title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Sections below the fold ease up as they arrive. They render visible, and are
// only held back once this runs, so nothing is lost without JavaScript.
export function RevealOnScroll() {
  const reduceMotion = useReducedMotionAfterHydration();

  useEffect(() => {
    if (reduceMotion) return;
    const els = [...document.querySelectorAll("[data-cs-reveal]")].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight
    );
    els.forEach((el) => (el.dataset.csReveal = "waiting"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.dataset.csReveal = "shown";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      els.forEach((el) => (el.dataset.csReveal = "shown"));
    };
  }, [reduceMotion]);

  return null;
}

// "10.8 MB" counts up from 0.0 MB; the text around the number stays put.
export function CountUp({ value, delay = 0 }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotionAfterHydration();

  useEffect(() => {
    const el = ref.current;
    const match = String(value).match(/^(\D*)([\d,]*\.?\d+)(.*)$/);
    if (!el || !match || reduceMotion) return;
    const [, before, digits, after] = match;
    const target = parseFloat(digits.replace(/,/g, ""));
    const decimals = (digits.split(".")[1] || "").length;
    const format = (n) =>
      before + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + after;

    el.textContent = format(0);
    const controls = animate(0, target, {
      duration: 1.1,
      delay,
      ease: EASE_OUT,
      onUpdate: (n) => (el.textContent = format(n)),
    });
    return () => {
      controls.stop();
      el.textContent = value;
    };
  }, [value, delay, reduceMotion]);

  return <span ref={ref}>{value}</span>;
}
