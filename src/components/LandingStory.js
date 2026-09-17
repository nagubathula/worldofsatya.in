"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RetroBackground from "./RetroBackground";
import RetroRainbowRibbon from "./RetroRainbowRibbon";
import styles from "./LandingStory.module.css";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } }
};


export default function LandingStory() {
  const [hoveredProject, setHoveredProject] = useState(null);

  return (
    <div className={styles.page}>
      <RetroBackground />
      <div className={styles.shell}>
        {/* Main Editorial Hero */}
        <main id="main-content" className={styles.main}>
          <motion.section 
            className={styles.heroPanel} 
            aria-labelledby="landing-heading"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Exact Desired Headline with interactive project hover previews */}
            <motion.h1 variants={item} id="landing-heading" className={styles.headline}>
              Design + Engineering.
              <span className={styles.subheadline}>
                Currently building{" "}
                <span className="relative inline-block">
                  <Link
                    href="/works/o0"
                    className="inline-block text-[#3e3832] font-medium underline decoration-[#3e3832]/35 underline-offset-4 hover:decoration-[#c2410c] hover:text-[#c2410c] transition-colors cursor-pointer"
                    onMouseEnter={() => setHoveredProject("openweave")}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    OpenWeave
                  </Link>
                  <AnimatePresence>
                    {hoveredProject === "openweave" && (
                      <motion.span
                        initial={{ opacity: 0, y: 12, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.94 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 sm:w-72 p-2 rounded-sm bg-[#fcf8f0] border-2 border-[#3e3832] shadow-[4px_4px_0px_rgba(62,56,50,0.3)] pointer-events-none z-50 not-italic block"
                      >
                        <span className="relative block w-full aspect-[16/10] rounded-[2px] overflow-hidden border border-[#3e3832]/20 bg-[#3e3832]/5">
                          <Image
                            src="/openweave-app.png"
                            alt="OpenWeave Interface Preview"
                            fill
                            sizes="300px"
                            className="object-cover sepia-[0.08] contrast-105"
                          />
                        </span>
                        <span className="pt-2 px-1 flex items-center justify-between text-[10px] font-pixel text-[#3e3832]/85 uppercase tracking-wider">
                          <span>OpenWeave</span>
                          <span className="text-[#c2410c] font-bold">Design Canvas + AI</span>
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                {" "}&amp;{" "}
                <span className="relative inline-block">
                  <Link
                    href="/case-studies/notbad-design"
                    className="inline-block text-[#3e3832] font-medium underline decoration-[#3e3832]/35 underline-offset-4 hover:decoration-[#0f766e] hover:text-[#0f766e] transition-colors cursor-pointer"
                    onMouseEnter={() => setHoveredProject("notbad")}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    NotBad
                  </Link>
                  <AnimatePresence>
                    {hoveredProject === "notbad" && (
                      <motion.span
                        initial={{ opacity: 0, y: 12, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.94 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 sm:w-72 p-2 rounded-sm bg-[#fcf8f0] border-2 border-[#3e3832] shadow-[4px_4px_0px_rgba(62,56,50,0.3)] pointer-events-none z-50 not-italic block"
                      >
                        <span className="relative block w-full aspect-[16/10] rounded-[2px] overflow-hidden border border-[#3e3832]/20 bg-[#3e3832]/5">
                          <Image
                            src="/notbad-demo.gif"
                            alt="NotBad Demo Preview"
                            fill
                            unoptimized
                            className="object-cover sepia-[0.05] contrast-105"
                          />
                        </span>
                        <span className="pt-2 px-1 flex items-center justify-between text-[10px] font-pixel text-[#3e3832]/85 uppercase tracking-wider">
                          <span>NotBad</span>
                          <span className="text-[#0f766e] font-bold">Flutter Markdown</span>
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                .
              </span>
            </motion.h1>

            {/* Narrative Story Bio */}
            <motion.p variants={item} className={styles.bio}>
              I’m Satya — operating at the boundary where interface craft, typography, and deep systems engineering converge. Leading Generative AI at NxtWave (2,000+ productions orchestrated) while building sovereign open tools for creators.
            </motion.p>

            {/* Bottom Actions */}
            <motion.div variants={item} className={styles.actionRow}>
              <div className={styles.ctaGroup}>
                <a href="mailto:nagubathula.satyasai@gmail.com" className={styles.primaryPill}>
                  Let’s talk <ArrowUpRight size={15} aria-hidden="true" />
                </a>
                <Link href="/works" className={styles.secondaryPill}>
                  <Sparkles size={14} aria-hidden="true" /> All Works &amp; Archive
                </Link>
              </div>
            </motion.div>

            <motion.div variants={item} className={styles.experienceStatus}>
              <span className={styles.subtleText}>Available for select advisory &amp; generative engineering</span>
            </motion.div>
          </motion.section>
        </main>

        {/* 6-Stripe Apple / Polaroid Retro Rainbow Ribbon Divider */}
        <RetroRainbowRibbon className={styles.rainbowDivider} />

        {/* Footer: macOS / visionOS Status Bar */}
        <footer className={styles.footer}>
          <p><span className={styles.statusDot} aria-hidden="true" /> Currently at <span className={styles.employer}>NxtWave</span></p>
          <nav className={styles.footerLinks} aria-label="More about Satya">
            <details className={styles.more}>
              <summary>Explore more</summary>
              <nav aria-label="Portfolio sections" className={styles.moreMenu}>
                <Link href="/case-studies">Case studies</Link>
                <Link href="/experience">Experience</Link>
                <Link href="/ai-videos">AI videos</Link>
                <Link href="/internal-tools">Internal tools</Link>
                <Link href="/open-source">Open source</Link>
                <Link href="/achievements">Achievements</Link>
              </nav>
            </details>
            <a href="https://www.linkedin.com/in/satyasainagubathula" target="_blank" rel="noopener noreferrer">
              LinkedIn <ArrowUpRight size={11} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href="mailto:nagubathula.satyasai@gmail.com" aria-label="Email Satya">
              <Mail size={15} aria-hidden="true" />
            </a>
          </nav>
        </footer>
      </div>
    </div>
  );
}
