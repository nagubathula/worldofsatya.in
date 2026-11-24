"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SHOWCASE_ITEMS = [
  {
    id: "contentflow",
    slug: "contentflow",
    title: "ContentFlow & Content Nexus",
    category: "AI & Media Operations",
    tag: "30+ Views · RBAC · YouTube Telemetry",
    year: "2025 – Present",
    image: "/cases/content-nexus/overview-hero-dark.webp",
    description: "The internal operations and telemetry platform orchestrating 2,000+ videos across 5 regional languages.",
    metrics: "2,000+ Videos · 100K+ Followers",
  },
  {
    id: "openweave",
    slug: "openweave",
    title: "OpenWeave",
    category: "Product & Canvas",
    tag: "Design Editor · Motion & Handoff",
    year: "2024",
    image: "/openweave-app.png",
    description: "Sovereign desktop design editor folding motion, responsive device prototypes, and code exports into one canvas.",
    metrics: "4 Native Tools · Open Source",
  },
  {
    id: "billjot",
    slug: "billjot",
    title: "Billjot POS",
    category: "Founding & Product Design",
    tag: "Hardware OS · PWA · Billing Engine",
    year: "2024 – 2025",
    image: "/videos/8.webp",
    description: "Cloud POS and billing operating on custom touch terminals, tested across 168 restaurants.",
    metrics: "584 Restaurants · ₹20L Revenue",
  },
  {
    id: "ai-production",
    slug: "gen-ai-production",
    title: "Generative AI Video Engine",
    category: "Generative AI",
    tag: "ComfyUI · Veo 3 · Wan 2.2 · Agents",
    year: "2025",
    image: "/cases/ai-hyper_realistic_detail-frames.webp",
    description: "High-throughput AI commercial production engine with automated voice synthesis and custom LoRA character pipelines.",
    metrics: "1,000+ Videos/Month · 14 Channels",
  },
  {
    id: "notbad",
    slug: "notbad",
    title: "NotBad Writer",
    category: "Desktop & Interaction",
    tag: "Flutter · Minimalist Markdown",
    year: "2024",
    image: "/notbad-editor.png",
    description: "Distraction-free markdown editor where syntax fades as you type, leaving pure typography on the screen.",
    metrics: "Multi-platform · Pure Dart",
  },
  {
    id: "chaya",
    slug: "chaya-ui-design-system",
    title: "Chaya UI Design System",
    category: "Design System",
    tag: "React · TypeScript · Radix · Tailwind",
    year: "2023 – 2024",
    image: "/chaya.avif",
    description: "Data-first enterprise design system powering security consoles and high-density analytics tables.",
    metrics: "Production Component System",
  },
  {
    id: "tailus",
    slug: "tailus-design",
    title: "Tailus UI Kit",
    category: "Tokens & Systems",
    tag: "Figma Tokens · Tailwind Sync",
    year: "2024",
    image: "/tailus.png",
    description: "Figma UI library mapped 1:1 to Tailwind tokens, saving hours of frontend synchronization.",
    metrics: "65+ Designer Interviews",
  },
  {
    id: "trip-south",
    slug: "trip-south",
    title: "Trip South Festival",
    category: "Art Direction & Posters",
    tag: "Typography · Print · Motion",
    year: "2024",
    image: "/gallery/trip-south.jpg",
    description: "Visual identity and editorial poster series for an Afro-Asian music festival.",
    metrics: "Featured Visual Archive",
  },
];

export default function HorizontalShowcase({ onOpen }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressFillRef = useRef(null);
  const counterRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Check if user prefers reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => track.scrollWidth - window.innerWidth + 80;

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollAmount() * 1.15}`,
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update progress bar
            if (progressFillRef.current) {
              progressFillRef.current.style.transform = `scaleX(${self.progress})`;
            }
            // Update active index
            const index = Math.min(
              SHOWCASE_ITEMS.length - 1,
              Math.floor(self.progress * SHOWCASE_ITEMS.length)
            );
            setActiveIndex(index);
          },
        },
      });

      // Internal image parallax
      const cardImages = track.querySelectorAll("[data-parallax-img]");
      cardImages.forEach((img) => {
        gsap.fromTo(
          img,
          { x: "6%" },
          {
            x: "-6%",
            ease: "none",
            scrollTrigger: {
              trigger: img,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="showcase"
      aria-label="Horizontal Works Showcase"
      className="relative w-full overflow-hidden bg-[#0c0d0e] py-12 text-white sm:py-16"
    >
      {/* Top Header & Telemetry Bar */}
      <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between px-6 sm:px-10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[#2ec4f0] animate-pulse" />
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#2ec4f0]">
              Interactive Showcase
            </p>
          </div>
          <h2 className="mt-2 text-[26px] font-medium tracking-[-0.03em] text-white sm:text-[36px]">
            Selected Works &amp; Systems
          </h2>
          <p className="mt-1 text-[13px] text-white/50 sm:text-[14px]">
            Scroll down to glide horizontally through products, canvas tools, and AI pipelines.
          </p>
        </div>

        {/* Counter and Drag cue */}
        <div className="hidden items-center gap-6 sm:flex">
          <div className="text-right">
            <span
              ref={counterRef}
              className="text-[20px] font-semibold tabular-nums text-white"
            >
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="text-[14px] text-white/40"> / {String(SHOWCASE_ITEMS.length).padStart(2, "0")}</span>
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] font-medium text-white/60">
            Scroll to slide →
          </span>
        </div>
      </div>

      {/* Horizontal Slider Track */}
      <div
        ref={trackRef}
        className="flex w-max items-center gap-6 px-6 sm:gap-8 sm:px-10"
      >
        {SHOWCASE_ITEMS.map((item, index) => (
          <article
            key={item.id}
            onClick={() => onOpen && onOpen(item)}
            className="group relative flex h-[480px] w-[82vw] shrink-0 cursor-pointer flex-col justify-between overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#141517] p-6 transition-all duration-300 hover:border-white/20 hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)] sm:h-[540px] sm:w-[580px] sm:p-8 lg:w-[680px]"
          >
            {/* Card Top: Tags and Number */}
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md">
                  {item.category}
                </span>
                <span className="hidden rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-white/60 sm:inline-block">
                  {item.year}
                </span>
              </div>
              <span className="text-[13px] font-semibold tabular-nums text-white/40">
                #{String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Middle: Media Window with Internal Parallax */}
            <div className="relative my-4 flex-1 overflow-hidden rounded-[16px] bg-[#000000]/60 border border-white/[0.05]">
              <div
                data-parallax-img
                className="relative h-full w-[112%] -left-[6%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 85vw, 680px"
                  className="object-cover object-top"
                  unoptimized={item.image.endsWith(".gif") || item.image.endsWith(".svg")}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11.5px] font-medium text-white/80 backdrop-blur-md border border-white/10">
                {item.metrics}
              </div>
            </div>

            {/* Card Bottom: Title & Action */}
            <div className="relative z-10 flex items-end justify-between gap-4">
              <div className="max-w-[78%]">
                <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-white sm:text-[24px]">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-white/65 sm:text-[14px]">
                  {item.description}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#111111] transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#2ec4f0] group-hover:text-black">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Persistent Bottom Scroll Progress Line */}
      <div className="mx-auto mt-8 w-full max-w-7xl px-6 sm:px-10">
        <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            ref={progressFillRef}
            className="h-full w-full origin-left bg-gradient-to-r from-[#2ec4f0] to-[#2fbf71] transition-transform duration-100 ease-out"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
