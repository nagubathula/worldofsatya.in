"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RetroBackground from "./RetroBackground";
import ChibiAvatar from "./ChibiAvatar";
import styles from "./LandingStory.module.css";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
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
            onMouseMove={handleHeroMouseMove}
            onMouseLeave={handleHeroMouseLeave}
          >
            {/* Left Content Column */}
            <div className={styles.heroContent}>
              {/* Headline with interactive project hover previews */}
              <motion.h1 variants={item} id="landing-heading" className={styles.headline}>
                Design + Engineering.
                <span className={styles.subheadline}>
                  Currently building{" "}
                  <span className="relative inline-block">
                    <Link
                      href="/works/o0"
                      className="inline-block text-[#1d1d1f] font-medium underline decoration-black/20 underline-offset-4 hover:decoration-[#1d1d1f] transition-colors cursor-pointer"
                      onMouseEnter={() => setHoveredProject("openweave")}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      OpenWeave
                    </Link>
                    <AnimatePresence>
                      {hoveredProject === "openweave" && (
                        <motion.span
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 sm:w-76 p-2 rounded-2xl bg-white border border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.08)] pointer-events-none z-50 not-italic block"
                        >
                          <span className="relative block w-full aspect-[16/10] rounded-xl overflow-hidden border border-black/[0.04] bg-[#f5f5f7]">
                            <Image
                              src="/openweave-app.png"
                              alt="OpenWeave Interface Preview"
                              fill
                              sizes="320px"
                              className="object-cover"
                            />
                          </span>
                          <span className="pt-2 px-1 flex items-center justify-between text-xs font-sans text-[#1d1d1f]">
                            <span className="font-medium">OpenWeave</span>
                            <span className="text-[#86868b] text-[11px]">Design Canvas + AI</span>
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                  {" "}&amp;{" "}
                  <span className="relative inline-block">
                    <Link
                      href="/case-studies/notbad-design"
                      className="inline-block text-[#1d1d1f] font-medium underline decoration-black/20 underline-offset-4 hover:decoration-[#1d1d1f] transition-colors cursor-pointer"
                      onMouseEnter={() => setHoveredProject("notbad")}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      NotBad
                    </Link>
                    <AnimatePresence>
                      {hoveredProject === "notbad" && (
                        <motion.span
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 sm:w-76 p-2 rounded-2xl bg-white border border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.08)] pointer-events-none z-50 not-italic block"
                        >
                          <span className="relative block w-full aspect-[16/10] rounded-xl overflow-hidden border border-black/[0.04] bg-[#f5f5f7]">
                            <Image
                              src="/notbad-demo.gif"
                              alt="NotBad Demo Preview"
                              fill
                              unoptimized
                              sizes="320px"
                              className="object-cover"
                            />
                          </span>
                          <span className="pt-2 px-1 flex items-center justify-between text-xs font-sans text-[#1d1d1f]">
                            <span className="font-medium">NotBad</span>
                            <span className="text-[#86868b] text-[11px]">Flutter Markdown</span>
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
                <span className={styles.statusDot} aria-hidden="true" />
                <span className={styles.subtleText}>Available for select advisory &amp; generative engineering</span>
              </motion.div>
            </div>

            {/* Right Illustration Column with 3D Tilt & Gentle Float */}
            <motion.div 
              variants={item} 
              className={styles.heroIllustration}
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
              style={{ perspective: 1000 }}
            >
              {/* Soft Ambient Studio Aura */}
              <motion.div 
                className={styles.avatarAura}
                animate={{ opacity: [0.4, 0.65, 0.4], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />

              {/* 3D Tilt Shell */}
              <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative flex flex-col items-center justify-center"
              >
                {/* Continuous Organic Floating Motion */}
                <motion.div
                  animate={{ y: [-5, 5, -5], rotate: [-0.4, 0.4, -0.4] }}
                  transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-44 sm:w-56 md:w-64 lg:w-72 xl:w-80 aspect-[9/16] max-h-[46vh]"
                >
                  <ChibiAvatar className={styles.avatarImage} />
                </motion.div>

                {/* Ground Contact Breathing Shadow */}
                <motion.div 
                  className={styles.avatarShadow}
                  animate={{ scaleX: [1, 0.88, 1], opacity: [0.32, 0.16, 0.32] }}
                  transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                />
              </motion.div>
            </motion.div>
          </motion.section>
        </main>

        {/* Minimal Clean Divider */}
        <div className={styles.divider} />

        {/* Footer: Modern Clean Status Bar */}
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
