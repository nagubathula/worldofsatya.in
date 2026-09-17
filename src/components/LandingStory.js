"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Code2, Layers3, Mail, Moon, Sparkles, Sun } from "lucide-react";
import { motion } from "framer-motion";
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
            {/* Exact Desired Headline */}
            <motion.h1 variants={item} id="landing-heading" className={styles.headline}>
              Design + Engineering.
              <span>Currently building OpenWeave &amp; NotBad.</span>
            </motion.h1>

            {/* Narrative Story Bio */}
            <motion.p variants={item} className={styles.bio}>
              I’m Satya — operating at the boundary where interface craft, typography, and deep systems engineering converge. Leading Generative AI at NxtWave (2,000+ productions orchestrated) while building sovereign open tools for creators.
            </motion.p>



            {/* Bottom Actions & Quick Proof Anchors */}
            <motion.div variants={item} className={styles.actionRow}>
              <div className={styles.ctaGroup}>
                <a href="mailto:nagubathula.satyasai@gmail.com" className={styles.primaryPill}>
                  Let’s talk <ArrowUpRight size={15} aria-hidden="true" />
                </a>
                <Link href="/works" className={styles.secondaryPill}>
                  <Sparkles size={14} aria-hidden="true" /> All Works &amp; Archive
                </Link>
              </div>

              <div className={styles.metaChips}>
                <Link href="/ai-videos" className={styles.metaChip} title="View AI Video Orchestration">
                  <Layers3 size={12} className={styles.chipIcon} aria-hidden="true" />
                  2,000+ AI Video Pipelines
                </Link>
                <Link href="/about" className={styles.metaChip} title="About Satya">
                  6y Craft · 280+ Clients
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
