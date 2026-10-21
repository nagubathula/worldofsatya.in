"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SocialBurst from "./SocialBurst";
import RiveAboutButton from "./RiveAboutButton";
import FlipCalendarNav from "./FlipCalendarNav";
import { faceIntroDelay, setFaceReading } from "./ChibiAvatar";
import { playPopSound } from "./SoundEffects";
import { EASE_OUT, SPRING } from "@/lib/motion";

const bioReveal = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: SPRING.enter },
};

const bioText = "text-[13px] sm:text-[14px] leading-[1.6] tracking-[-0.01em] text-[#8e8e93]";

const highlight =
  "font-medium text-[#3a3a3c] underline decoration-wavy decoration-[#2ec4f0] decoration-[1.5px] underline-offset-[4px] transition-colors hover:text-[#111111]";

// A highlighted phrase in the bio. Outside links open in a new tab.
function BioLink({ href, children }) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={highlight}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={highlight}>
      {children}
    </Link>
  );
}

// The "…" that ends a line: there's more of it on another page.
function MoreLink({ href, label }) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="font-semibold text-[#2ec4f0] transition-colors hover:text-[#0b9fd0]"
    >
      …
    </Link>
  );
}

export default function HomeTilesLayout() {
  const [currentSection, setCurrentSection] = useState("avatar");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactContainerRef = useRef(null);

  const isAvatarVisible = currentSection === "avatar";
  // On the first visit the face lands first and everything else follows it.
  // Read each render: it drops to 0 once the intro has played.
  const introDelay = faceIntroDelay();

  // Take the reading glasses off when the bio leaves, even mid-hover.
  useEffect(() => () => setFaceReading(false), [isAvatarVisible]);

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
      className="relative w-full min-h-screen bg-white text-[#1d1d1f] overflow-x-hidden selection:bg-black selection:text-white"
    >
      <section className="relative w-full max-w-5xl mx-auto min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-10 pt-16 pb-12 select-none">
        {/* The face, or the fanned works once the card turns */}
        <div className="relative order-2 z-10 flex w-full items-center justify-center">
          <FlipCalendarNav
            initialSection="avatar"
            onSectionChange={setCurrentSection}
          />
        </div>

        {/* popLayout: the bio steps out of the flow as it leaves, so the cards don't wait for it. */}
        <AnimatePresence mode="popLayout">
          {isAvatarVisible && (
            <motion.div
              key="home-bio-content"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
              variants={{
                hidden: {},
                show: { transition: { delayChildren: introDelay, staggerChildren: 0.08 } },
              }}
              // Reading the bio puts the face's reading glasses on. Mouse and pen only.
              onPointerEnter={(e) => e.pointerType !== "touch" && setFaceReading(true)}
              onPointerLeave={() => setFaceReading(false)}
              className="order-3 z-20 mt-5 sm:mt-7 w-full max-w-[500px] flex flex-col items-start text-left"
            >
              <motion.h1 variants={bioReveal} className="text-[34px] sm:text-[40px] lg:text-[44px] font-semibold tracking-[-0.045em] leading-[1.05] text-[#111111]">
                Satya Sai Nagubathula
              </motion.h1>
              <motion.p variants={bioReveal} className={`mt-5 ${bioText}`}>
                I have <BioLink href="/experience">6 years of experience</BioLink> in Design and Engineering and worked across software and hardware{" "}
                <MoreLink href="/about" label="More about Satya" />
              </motion.p>
              <motion.p variants={bioReveal} className={`mt-3 ${bioText}`}>
                Apart from work I <BioLink href="/experience">train and educate</BioLink> people in Design & Technology to make them build better products currently.
              </motion.p>
              <motion.p variants={bioReveal} className={`mt-3 ${bioText}`}>
                I actively contribute to open-source software and hardware building{" "}
                <BioLink href="/works/openweave">OpenWeave</BioLink> and{" "}
                <BioLink href="/works/case-studies/notbad-design">NotBad</BioLink>{" "}
                <MoreLink href="/open-source" label="More open-source work" />
              </motion.p>
              <motion.p variants={bioReveal} className={`mt-3 ${bioText}`}>
                Not boasting but I have 10k+ followers on{" "}
                <BioLink href="https://www.instagram.com/engineerudu">instagram</BioLink>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* About and contact: under the bio on the face, above the cards on works. */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ...SPRING.enter,
            opacity: { duration: 0.5, ease: EASE_OUT, delay: introDelay + 0.4 },
            y: { ...SPRING.enter, delay: introDelay + 0.4 },
          }}
          ref={contactContainerRef}
          className={`${isAvatarVisible ? "order-4 mt-8 sm:mt-10" : "order-1 mb-4 sm:mb-6"} z-30 flex items-center justify-center gap-4`}
        >
          <RiveAboutButton showFace={!isAvatarVisible} />
          <SocialBurst open={isContactOpen} onToggle={toggleContact} />
        </motion.div>
      </section>
    </div>
  );
}
