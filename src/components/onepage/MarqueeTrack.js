"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  "FIGMA TO PRODUCTION",
  "REACT & NEXT.JS",
  "TYPESCRIPT",
  "RAG & LLM PIPELINES",
  "SPRING PHYSICS & MOTION",
  "GSAP & THREE.JS",
  "COMFYUI & FLUX",
  "HARDWARE GUIS",
  "584 RESTAURANTS ON POS",
  "GSOC 2024 QUALIFIED",
  "NASA SPACE APPS WINNER",
];

export default function MarqueeTrack() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let tween;
    const ctx = gsap.context(() => {
      // Continuous loop
      tween = gsap.to(track, {
        xPercent: -50,
        repeat: -1,
        duration: 28,
        ease: "none",
      });

      // Scroll speed modifier: scrolling down speeds it up, scrolling up reverses it
      ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const speed = Math.abs(velocity) / 400;
          const targetTimeScale = velocity < 0 ? -1 - speed : 1 + speed;
          gsap.to(tween, {
            timeScale: targetTimeScale,
            duration: 0.4,
            overwrite: "auto",
            onComplete: () => {
              gsap.to(tween, { timeScale: 1, duration: 1.2, ease: "power1.out" });
            },
          });
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden border-y border-black/[0.06] bg-[#fafafa] py-3.5 select-none"
    >
      <div
        ref={trackRef}
        className="flex w-max items-center gap-8 whitespace-nowrap will-change-transform"
      >
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#666]"
          >
            <span>{item}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#2ec4f0]" />
          </span>
        ))}
      </div>
    </div>
  );
}
