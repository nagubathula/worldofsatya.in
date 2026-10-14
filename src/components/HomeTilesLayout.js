"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import SocialBurst from "./SocialBurst";
import RiveAboutButton from "./RiveAboutButton";
import FlipCalendarNav from "./FlipCalendarNav";
import { playPopSound } from "./SoundEffects";

export default function HomeTilesLayout() {
  const [currentSection, setCurrentSection] = useState("avatar");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactContainerRef = useRef(null);

  const isAvatarVisible = currentSection === "avatar";

  // Close contact menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isContactOpen) setIsContactOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isContactOpen]);

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
    <div
      data-lenis-prevent="true"
      className="relative w-full min-h-screen bg-[#f4f4f4] text-[#1d1d1f] overflow-x-hidden selection:bg-black selection:text-white"
    >
      <section className="relative w-full max-w-7xl mx-auto min-h-[100dvh] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 xl:gap-20 px-6 sm:px-10 lg:px-14 pt-24 lg:pt-0 pb-12 lg:pb-0 select-none">
        <div className="w-full lg:flex-1 lg:max-w-xl xl:max-w-2xl flex flex-col justify-center px-0 z-20">
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-semibold tracking-tight leading-[1.1] text-[#111111] sm:whitespace-nowrap">
            Satya Sai Nagubathula
          </h1>
          <p className="mt-2 sm:mt-2.5 text-xl sm:text-2xl lg:text-[28px] tracking-tight text-[#8f8f8f]">
            AI + Design Engineer
          </p>
          <p className="mt-5 max-w-xl xl:max-w-2xl text-base sm:text-lg leading-relaxed text-[#515154]">
            I turn ideas into tools that feel clear, useful, and considered — connecting product design, systems engineering, and generative AI.
          </p>
          <p className="mt-3.5 text-sm sm:text-base text-[#6e6e73] tracking-tight">
            Currently building{" "}
            <Link
              href="/works/o0"
              className="text-[#111111] font-medium underline decoration-black/25 underline-offset-4 hover:decoration-[#111111] transition-colors"
            >
              OpenWeave
            </Link>{" "}
            &amp;{" "}
            <Link
              href="/works/case-studies/notbad-design"
              className="text-[#111111] font-medium underline decoration-black/25 underline-offset-4 hover:decoration-[#111111] transition-colors"
            >
              NotBad
            </Link>
            .
          </p>
          <div ref={contactContainerRef} className="mt-8 flex flex-wrap items-start gap-3.5">
            <RiveAboutButton showFace={!isAvatarVisible} />
            <SocialBurst open={isContactOpen} onToggle={toggleContact} />
          </div>
        </div>

        {/* 3D Flip Card Widget */}
        <div className="relative w-full lg:w-auto lg:shrink-0 flex items-center justify-center lg:justify-end px-0 z-10">
          <FlipCalendarNav
            initialSection="avatar"
            onSectionChange={(sectionId) => {
              setCurrentSection(sectionId);
            }}
          />
        </div>
      </section>
    </div>
  );
}
