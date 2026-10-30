"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import SocialBurst, { SLIDE, useBurstWidth, useCompact } from "./SocialBurst";
import RiveAboutButton from "./RiveAboutButton";
import GalleryButton from "./GalleryButton";
import Magnetic from "./Magnetic";
import FlipCalendarNav from "./FlipCalendarNav";
import { faceIntroDelay, setFaceReading } from "./ChibiAvatar";
import { playPopSound } from "./SoundEffects";
import { SPRING } from "@/lib/motion";

// A gentle ease-out cubic: no snap at the start, a long soft settle.
const SMOOTH = { duration: 0.8, ease: [0.33, 1, 0.68, 1] };

const bioReveal = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: SMOOTH },
};

// Small print under a big name, as in the design. Phones get a size up to stay readable.
const bioText = "text-[13px] sm:text-[12px] leading-[1.6] tracking-[-0.01em] text-[#6e6e73]";

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

// A project link that floats its thumbnail above it on hover or keyboard focus.
function ProjectLink({ href, image, children }) {
  const [isShown, setIsShown] = useState(false);

  return (
    <span className="relative inline-block">
      <Link
        href={href}
        className={highlight}
        // Mouse and pen only: a tap on a phone just follows the link.
        onPointerEnter={(e) => e.pointerType !== "touch" && setIsShown(true)}
        onPointerLeave={() => setIsShown(false)}
        onFocus={() => setIsShown(true)}
        onBlur={() => setIsShown(false)}
      >
        {children}
      </Link>
      <AnimatePresence>
        {isShown && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.96, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 6, scale: 0.96, x: "-50%", transition: { ...SMOOTH, duration: 0.25 } }}
            transition={{ ...SMOOTH, duration: 0.45 }}
            style={{ transformOrigin: "50% 100%" }}
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 block w-64 rounded-2xl border border-black/[0.08] bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
          >
            <span className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl border border-black/[0.04] bg-[#f5f5f7]">
              <Image src={image} alt="" fill sizes="256px" unoptimized={image.endsWith(".gif")} className="object-cover object-top" />
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// The "…" that ends a line: there's more of it on another page.
function MoreLink({ href, label }) {
  return (
    <Magnetic max={5} className="-mx-2 -my-2">
      <Link
        href={href}
        aria-label={label}
        title={label}
        // Padding grows the tap area without moving the dots.
        className="inline-block px-2 py-2 font-semibold text-[#0879a0] transition-colors hover:text-[#065f7e]"
      >
        …
      </Link>
    </Magnetic>
  );
}

export default function HomeTilesLayout() {
  const [currentSection, setCurrentSection] = useState("avatar");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactContainerRef = useRef(null);
  const burstWidth = useBurstWidth();
  const hideSideButtons = useCompact() && isContactOpen;

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
      className="relative w-full min-h-screen text-[#1d1d1f] overflow-x-hidden selection:bg-black selection:text-white"
    >
      <section className="relative w-full max-w-5xl mx-auto min-h-[100dvh] flex flex-col items-center justify-center px-4 sm:px-10 pt-28 lg:pt-16 pb-12 select-none">
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
              exit={{ opacity: 0, y: -8, filter: "blur(4px)", transition: { ...SMOOTH, duration: 0.5 } }}
              variants={{
                hidden: {},
                show: { transition: { delayChildren: introDelay, staggerChildren: 0.12 } },
              }}
              // Reading the bio puts the face's reading glasses on. Mouse and pen only.
              onPointerEnter={(e) => e.pointerType !== "touch" && setFaceReading(true)}
              onPointerLeave={() => setFaceReading(false)}
              className="order-3 z-20 mt-5 sm:mt-7 w-full max-w-[570px] flex flex-col items-start text-left"
            >
              <motion.h1 variants={bioReveal} className="text-[34px] sm:text-[44px] lg:text-[48px] font-semibold tracking-[-0.045em] leading-[1.05] text-[#111111]">
                Satya Sai Nagubathula
              </motion.h1>
              <motion.p variants={bioReveal} className={`mt-5 ${bioText}`}>
                I have <BioLink href="/about">4 years of experience</BioLink> in Design and Engineering and worked across software and hardware{" "}
                <MoreLink href="/about" label="More about Satya" />
              </motion.p>
              <motion.p variants={bioReveal} className={`mt-3 ${bioText}`}>
                Apart from work I <BioLink href="/about">train and educate</BioLink> people in Design & Technology to make them build better products currently.
              </motion.p>
              <motion.p variants={bioReveal} className={`mt-3 ${bioText}`}>
                I actively contribute to open-source software and hardware building{" "}
                <ProjectLink href="/works/openweave" image="/openweave-app.png">
                  OpenWeave
                </ProjectLink>{" "}
                and{" "}
                <ProjectLink href="/works/notbad" image="/notbad-demo.gif">
                  NotBad
                </ProjectLink>{" "}
                <MoreLink href="/open-source" label="More open-source work" />
              </motion.p>
              <motion.p variants={bioReveal} className={`mt-3 ${bioText}`}>
                Not boasting but I have 10k+ followers on{" "}
                <BioLink href="https://www.instagram.com/engineerudu">instagram</BioLink>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* About, gallery and contact: under the bio on the face, above the cards on works. */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 8 }}
          // Opening contact slides the row left so the links land centred, not past the bio.
          animate={{ opacity: 1, y: 0, x: isContactOpen ? -burstWidth / 2 : 0 }}
          transition={{
            ...SPRING.enter,
            // Closing waits for the links to fly back in before the row returns.
            x: { ...SLIDE, delay: isContactOpen ? 0 : 0.2 },
            opacity: { ...SMOOTH, delay: introDelay + 0.5 },
            y: { ...SMOOTH, delay: introDelay + 0.5 },
          }}
          ref={contactContainerRef}
          className={`${isAvatarVisible ? "order-4 mt-8 sm:mt-10" : "order-1 mb-4 sm:mb-6"} z-30 flex items-center justify-center gap-4`}
        >
          {/* On a phone the contact links need the whole row, so about and gallery
              tuck away while they're out. The negative margin takes back the row's gap. */}
          <motion.div
            initial={false}
            animate={
              hideSideButtons
                ? { width: 0, opacity: 0, scale: 0.8, marginRight: -16 }
                : { width: "auto", opacity: 1, scale: 1, marginRight: 0 }
            }
            transition={SLIDE}
            aria-hidden={hideSideButtons || undefined}
            inert={hideSideButtons || undefined}
            className="flex shrink-0 items-center gap-4"
          >
            <RiveAboutButton showFace={!isAvatarVisible} />
            <GalleryButton />
          </motion.div>
          <SocialBurst open={isContactOpen} onToggle={toggleContact} />
        </motion.div>

        {/* Say that the face card turns: a scroll on desktop, a swipe on touch screens. */}
        <AnimatePresence>
          {/* Out of the way while the contact links are open: their second row sits here. */}
          {isAvatarVisible && !isContactOpen && (
            <motion.button
              key="swipe-hint"
              type="button"
              onClick={() => window.flipCalendarNext?.()}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ ...SMOOTH, delay: introDelay + 0.9 }}
              className="order-5 mt-12 flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-[#6e6e73] transition-colors hover:text-[#1d1d1f] [@media(hover:none)]:mt-6"
            >
              <span className="[@media(hover:none)]:hidden">Scroll down for works</span>
              <span className="hidden [@media(hover:none)]:inline">Swipe up for works</span>
              <motion.span
                aria-hidden="true"
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="[@media(hover:none)]:hidden">↓</span>
                <span className="hidden [@media(hover:none)]:inline">↑</span>
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
