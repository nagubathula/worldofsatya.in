"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { motion, LayoutGroup, MotionConfig, useReducedMotion } from "framer-motion";
import SocialBurst from "./SocialBurst";
import RiveAboutButton from "./RiveAboutButton";
import FlipCalendarNav from "./FlipCalendarNav";
import { play8BitTapSound, playPopSound } from "./SoundEffects";

// The 4 featured works matching Frame 1 (2x2 grid) & Frame 2 (Bento stack)
const bentoWorks = [
  {
    id: "openweave",
    title: "OpenWeave",
    category: "Open Source",
    tag: "Design Canvas + AI",
    description: "An open design editor that treats design files as inspectable, sovereign documents with Figma binary support and natural AI co-creation.",
    image: "/openweave-app.png",
    href: "/works/o0",
  },
  {
    id: "notbad",
    title: "NotBad",
    category: "Case Study",
    tag: "Distraction-Free Writing",
    description: "An editorial sanctuary built in Flutter where Markdown syntax conceals on rest, delivering a 1.0s cold start and zero-distraction focus.",
    image: "/notbad-editor.png",
    href: "/works/case-studies/notbad-design",
  },
  {
    id: "toothpaste",
    title: "Toothpaste",
    category: "Open Source",
    tag: "Media Workflow Engine",
    description: "A specialized workflow utility engineered to bridge timeline sequencing, asset generation, and automated media pipelines.",
    image: "/toothpaste-panel.png",
    href: "/works/o1",
  },
  {
    id: "tailus",
    title: "Tailus",
    category: "Project",
    tag: "Design System",
    description: "A utility-first Tailwind CSS UI kit and component library with refined aesthetics, custom tokens, and modular interface blocks.",
    image: "/tailus.png",
    href: "/works/p5",
  },
];

export default function HomeTilesLayout() {
  const reduceMotion = useReducedMotion();
  const [isWorksExpanded, setIsWorksExpanded] = useState(false);
  const [previewSection, setPreviewSection] = useState("avatar");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactContainerRef = useRef(null);

  // Close works or contact on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isWorksExpanded) setIsWorksExpanded(false);
        if (isContactOpen) setIsContactOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWorksExpanded, isContactOpen]);

  // Close contact menu when clicking outside
  useEffect(() => {
    if (!isContactOpen) return;

    const handlePointerDown = (e) => {
      if (contactContainerRef.current && !contactContainerRef.current.contains(e.target)) {
        setIsContactOpen(false);
        try {
          playPopSound(440, 0.08);
        } catch {}
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isContactOpen]);

  const toggleContact = () => {
    setIsContactOpen((prev) => !prev);

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(18);
      } catch {}
    }
  };

  return (
    <MotionConfig reducedMotion="never" transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
    <LayoutGroup id="home-works">
    <div className="relative w-full min-h-screen bg-[#f4f4f4] text-[#1d1d1f] overflow-x-hidden selection:bg-black selection:text-white">
      {/* ============================================================
          IN-PLACE SMART ANIMATE: FRAME 1 (Hero) <-> FRAME 2 (Bento Works)
         ============================================================ */}
      <section className="relative w-full max-w-7xl mx-auto min-h-[100dvh] flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-12 px-6 sm:px-10 lg:px-12 py-8 lg:py-0 select-none">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-0 shrink-0 z-20">
          <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-semibold tracking-tight leading-tight text-[#111111]">Satya Sai Nagubathula</h1>
          <p className="mt-2 text-xl sm:text-2xl lg:text-3xl tracking-tight text-[#8f8f8f]">AI + Design Engineer</p>
          <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-[#515154]">
            I turn ideas into tools that feel clear, useful, and considered — connecting product design, systems engineering, and generative AI.
          </p>
          <p className="mt-3 text-sm sm:text-base text-[#6e6e73] tracking-tight">
            Currently working on{" "}
            <Link
              href="/works/o0"
              className="text-[#111111] font-medium underline decoration-black/25 underline-offset-4 hover:decoration-[#111111] transition-colors"
            >
              OpenWeave
            </Link>
            .
          </p>
          <div ref={contactContainerRef} className="mt-6 flex flex-wrap items-start gap-3">
            <RiveAboutButton />
            <SocialBurst open={isContactOpen} onToggle={toggleContact} />
          </div>
          {isWorksExpanded && <button type="button" aria-expanded={true} aria-controls="home-work-preview"
            onClick={() => { setIsWorksExpanded(value => !value); setIsContactOpen(false); }}
            className="mt-8 flex w-fit items-center gap-3 rounded-full px-3 py-2 text-sm text-[#515154] transition-colors duration-500 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            <ArrowLeft size={16} />
            Back to preview
          </button>}
          <div className="h-8 pt-3">{isWorksExpanded && <Link href="/works" className="px-3 text-xs text-[#666666] underline underline-offset-4">View all works</Link>}</div>
        </div>
        {/* Shared thumbnails travel from the compact grid into the work list. */}
        <div id="home-work-preview" className="relative w-full min-w-0 lg:w-1/2 flex items-center justify-center lg:justify-end px-0 z-10">
          {!isWorksExpanded ? (
            <motion.div key="calendar" className="w-full flex justify-center">
              <FlipCalendarNav initialSection={previewSection} onExpandWorks={() => { setPreviewSection("works"); setIsWorksExpanded(true); setIsContactOpen(false); }} />
            </motion.div>
          ) : (
            <motion.div key="expanded" layout className="w-full max-w-[540px] py-6 flex flex-col gap-5 sm:gap-6">
              {bentoWorks.map((work, idx) => (
                <motion.div layout key={work.id} className="min-w-0">
                  <Link href={work.href} className="group flex items-center gap-4 sm:gap-6 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                    <motion.div layoutId={'work-image-' + work.id}
                      className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-xl bg-white"
                      style={{ borderRadius: 12 }}>
                      <Image src={work.image} alt={work.title} fill sizes="112px" className="object-cover object-top" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.65, delay: 0.15 + idx * 0.06, ease: [0.22, 1, 0.36, 1] }} className="min-w-0 flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-[#727272]">{work.category}</p>
                      <h2 className="mt-1 text-lg font-semibold tracking-tight group-hover:underline">{work.title}</h2>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#666666]">{work.description}</p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs">Explore work <ArrowUpRight size={12} /></span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
    </LayoutGroup>
    </MotionConfig>
  );
}
