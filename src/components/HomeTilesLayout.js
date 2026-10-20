"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SocialBurst from "./SocialBurst";
import RiveAboutButton from "./RiveAboutButton";
import FlipCalendarNav from "./FlipCalendarNav";
import { playPopSound } from "./SoundEffects";
import { useNavbar } from "./NavbarContext";
import { SPRING } from "@/lib/motion";

export default function HomeTilesLayout() {
  const [currentSection, setCurrentSection] = useState("avatar");
  const { setHomeSection } = useNavbar();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactContainerRef = useRef(null);

  const isAvatarVisible = currentSection === "avatar";

  // Sync section with global navbar context
  useEffect(() => {
    setHomeSection(currentSection);
    return () => {
      setHomeSection("avatar");
    };
  }, [currentSection, setHomeSection]);

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
      <section className="relative w-full max-w-3xl mx-auto min-h-[100dvh] flex flex-col items-center justify-center px-6 sm:px-10 pt-20 pb-12 select-none">
        {/* 3D Flip Card Widget + Floating Hand-drawn Annotation */}
        <div className="relative flex items-center justify-center z-10 mb-5 sm:mb-7">
          <FlipCalendarNav
            initialSection="avatar"
            onSectionChange={(sectionId) => {
              setCurrentSection(sectionId);
              setHomeSection(sectionId);
            }}
          />

          {/* Floating 'AI + Design Engineer' Handwritten Annotation with Curved Blue Arrow */}
          <AnimatePresence>
            {isAvatarVisible && (
              <motion.div
                key="avatar-annotation"
                initial={{ opacity: 0, scale: 0.8, rotate: -10, y: 12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -8 }}
                transition={SPRING.pop}
                className="absolute -top-3 sm:-top-5 left-[62%] sm:left-[66%] md:left-[70%] flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap pointer-events-none select-none z-20 scale-[0.85] sm:scale-100 origin-left"
              >
                <svg
                  width="34"
                  height="26"
                  viewBox="0 0 34 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#20a8e3] shrink-0 -rotate-6 sm:-rotate-3"
                  aria-hidden="true"
                >
                  <path
                    d="M3 21C9 12 18 7 30 5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M22 3.5L30 5L25 12.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-handwriting text-xl sm:text-2xl text-[#111111] font-semibold tracking-wide">
                  AI + Design Engineer
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`w-full max-w-[560px] flex flex-col ${isAvatarVisible ? "items-start text-left" : "items-center text-center"} justify-center px-0 z-20`}>
          <AnimatePresence mode="wait">
            {isAvatarVisible && (
              <motion.div
                key="home-bio-content"
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
                transition={SPRING.enter}
                className="w-full flex flex-col items-start text-left"
              >
                <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-tight leading-[1.12] text-[#111111]">
                  Satya Sai Nagubathula
                </h1>
                <p className="mt-4 sm:mt-5 text-base sm:text-[17px] leading-relaxed text-[#515154]">
                  I turn design ideas into working software — interfaces, interactive prototypes, and AI-powered tools. My work brings together product design, frontend engineering, and generative AI, from the first interaction to the systems behind it.
                </p>
                <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-[#6e6e73] tracking-tight">
                  <span className="inline-block mr-1 text-[#111111] font-normal">→</span>
                  Currently building{" "}
                  <Link
                    href="/works/openweave"
                    className="text-[#111111] font-medium underline decoration-black/25 underline-offset-4 hover:decoration-[#111111] transition-colors"
                  >
                    OpenWeave
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/works/case-studies/notbad-design"
                    className="text-[#111111] font-medium underline decoration-black/25 underline-offset-4 hover:decoration-[#111111] transition-colors"
                  >
                    NotBad
                  </Link>
                  .
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            layout
            transition={SPRING.enter}
            ref={contactContainerRef}
            className={`${isAvatarVisible ? "mt-6 sm:mt-8" : "mt-2"} flex flex-wrap items-center ${isAvatarVisible ? "justify-start" : "justify-center"} gap-3.5`}
          >
            <RiveAboutButton showFace={!isAvatarVisible} />
            <SocialBurst open={isContactOpen} onToggle={toggleContact} />
          </motion.div>
          <AnimatePresence>
            {!isAvatarVisible && (
              <motion.p
                key="works-continue"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ ...SPRING.enter, delay: 0.48 }}
                className="mt-4 text-[12px] font-sans tracking-wide text-[#8e8e93]"
              >
                Scroll to continue
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
