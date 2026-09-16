"use client";

import Link from "next/link";
import { ArrowUpRight, Code2, Layers3, Mail, Moon, Sparkles, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import styles from "./LandingStory.module.css";

export default function LandingStory() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        {/* Apple Floating Glass Capsule Header */}
        <header className={styles.header}>
          <div className={styles.capsuleNav}>
            <Link href="/" className={styles.wordmark} aria-label="Satya — home">
              satya<span>.</span>
            </Link>
            <div className={styles.navDivider} aria-hidden="true" />
            <nav aria-label="Main navigation" className={styles.navLinks}>
              <Link href="/works">Works</Link>
              <Link href="/about">About</Link>
              <Link href="/case-studies">Case Studies</Link>
            </nav>
            <div className={styles.navDivider} aria-hidden="true" />
            <button
              type="button"
              onClick={toggleTheme}
              className={styles.themeBtn}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun size={13} aria-hidden="true" /> : <Moon size={13} aria-hidden="true" />}
            </button>
            <a href="mailto:nagubathula.satyasai@gmail.com" className={styles.navCta}>
              Let’s talk <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </header>

        {/* Main Editorial Hero */}
        <main id="main-content" className={styles.main}>
          <section className={styles.heroPanel} aria-labelledby="landing-heading">
            {/* Live Context & Identity */}
            <div className={styles.identityLockup}>
              <div className={styles.statusPill}>
                <span className={styles.statusDot} aria-hidden="true" />
                <span className={styles.statusCompany}>Generative AI Lead @ NxtWave</span>
                <span className={styles.statusSep}>•</span>
                <span className={styles.statusRole}>Design Technologist</span>
              </div>
              <span className={styles.authorName}>Satya Sai Nagubathula</span>
            </div>

            {/* Exact Desired Headline */}
            <h1 id="landing-heading" className={styles.headline}>
              Design + Engineering.
              <span>Currently building OpenWeave &amp; NotBad.</span>
            </h1>

            {/* Narrative Story Bio */}
            <p className={styles.bio}>
              I’m Satya — operating at the boundary where interface craft, typography, and deep systems engineering converge. Leading Generative AI at NxtWave (2,000+ productions orchestrated) while building sovereign open tools for creators.
            </p>

            {/* Featured Builds: OpenWeave & NotBad */}
            <div className={styles.buildCards}>
              <Link href="/works/o0" className={styles.buildCard} title="Explore OpenWeave">
                <div className={styles.buildCardHeader}>
                  <div className={styles.buildBadge}>
                    <Sparkles size={12} className={styles.badgeIcon} aria-hidden="true" />
                    Open Canvas + AI
                  </div>
                  <span className={styles.cardArrow}>
                    Explore <ArrowUpRight size={13} aria-hidden="true" />
                  </span>
                </div>
                <h2 className={styles.cardTitle}>OpenWeave</h2>
                <p className={styles.cardTagline}>Why should designs remain locked in proprietary clouds?</p>
                <p className={styles.cardDesc}>
                  An open-source Figma alternative that decodes raw .fig binaries into an open JSON scene graph connected to 90+ MCP tools for AI agents.
                </p>
                <div className={styles.cardTokens}>
                  <span>Figma binary parser</span>
                  <span className={styles.tokenDot}>•</span>
                  <span>MCP Server</span>
                  <span className={styles.tokenDot}>•</span>
                  <span>React primitives</span>
                </div>
              </Link>

              <Link href="/case-studies/notbad-design" className={styles.buildCard} title="Read NotBad case study">
                <div className={styles.buildCardHeader}>
                  <div className={styles.buildBadge}>
                    <Code2 size={12} className={styles.badgeIcon} aria-hidden="true" />
                    Native Markdown Writer
                  </div>
                  <span className={styles.cardArrow}>
                    Case Study <ArrowUpRight size={13} aria-hidden="true" />
                  </span>
                </div>
                <h2 className={styles.cardTitle}>NotBad</h2>
                <p className={styles.cardTagline}>When modern writing apps became noisy notification centers.</p>
                <p className={styles.cardDesc}>
                  A distraction-free desktop editor built with 3,500 lines of pure Dart in Flutter, concealing Markdown syntax until your caret touches it.
                </p>
                <div className={styles.cardTokens}>
                  <span>1.0s cold start</span>
                  <span className={styles.tokenDot}>•</span>
                  <span>10.8 MB installer</span>
                  <span className={styles.tokenDot}>•</span>
                  <span>Pure Flutter</span>
                </div>
              </Link>
            </div>

            {/* Bottom Actions & Quick Proof Anchors */}
            <div className={styles.actionRow}>
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
            </div>

            <div className={styles.experienceStatus}>
              <span className={styles.subtleText}>Available for select advisory &amp; generative engineering</span>
            </div>
          </section>
        </main>

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
