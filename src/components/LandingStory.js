"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Code2, Eye, Layers3, Lightbulb, Mail, MousePointer2, Sparkles } from "lucide-react";
import { landingProjects } from "@/data/landingProjects";
import styles from "./LandingStory.module.css";

const nodeIcons = { idea: Lightbulb, system: Layers3, output: MousePointer2 };

function SystemView({ project }) {
  return (
    <div className={styles.systemView}>
      <div className={styles.visualLabel}><Code2 size={13} aria-hidden="true" /> Under the surface</div>
      <ol className={styles.systemFlow} aria-label={`${project.name} system overview`}>
        {project.engineering.nodes.map((node, index) => {
          const Icon = nodeIcons[node.icon];
          return (
            <li key={node.label}>
              <div className={styles.nodeIcon}><Icon size={22} strokeWidth={1.5} aria-hidden="true" /></div>
              <strong>{node.label}</strong>
              <span>{node.detail}</span>
              {index < 2 && <ArrowRight className={styles.connector} size={18} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
      <p className={styles.systemNote}>{project.engineering.note}</p>
    </div>
  );
}

function ContentFlowView() {
  return (
    <div className={styles.contentFlowView}>
      <div className={styles.visualLabel}><Layers3 size={13} aria-hidden="true" /> Workspace overview</div>
      <div className={styles.flowHeadline}>The right view.<br /><span>For every role.</span></div>
      <div className={styles.roles} aria-label="Connected workspaces">
        {["Writer", "Voice artist", "Editor", "Designer", "Manager", "Reviewer"].map((role) => (
          <span key={role}><Check size={12} aria-hidden="true" /> {role}</span>
        ))}
      </div>
      <p className={styles.systemNote}>One shared production journey</p>
    </div>
  );
}

export default function LandingStory() {
  const [projectIndex, setProjectIndex] = useState(0);
  const [lens, setLens] = useState("design");
  const project = landingProjects[projectIndex];
  const perspective = project[lens];

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <Link href="/" className={styles.wordmark} aria-label="Satya — home">satya<span>.</span></Link>
          <nav aria-label="Main navigation" className={styles.navigation}>
            <Link href="/about">About</Link>
            <Link href="/works">All work <ArrowUpRight size={13} aria-hidden="true" /></Link>
          </nav>
        </header>

        <main id="main-content" className={styles.main}>
          <section className={styles.intro} aria-labelledby="landing-heading">
            <div className={styles.identity}>
              <p className={styles.name}>Satya Sai Nagubathula</p>
              <p className={styles.role}>Design Technologist <span>&amp; AI Engineer</span></p>
            </div>
            <h1 id="landing-heading" className={styles.headline}>
              I shape the<br />experience.<br />
              <span>I build what<br />powers it.</span>
            </h1>
            <p className={styles.bio}>
              From a sketch to a working product,<br className={styles.desktopBreak} /> I connect design, code, and AI.
            </p>
            <a href="mailto:nagubathula.satyasai@gmail.com" className={styles.contact}>
              Let’s build something <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <p className={styles.experience}>6 years of making ideas real.</p>
          </section>

          <section className={styles.work} aria-label="Selected projects, through two perspectives">
            <div className={styles.workHeading}>
              <span>Selected work</span>
              <span>Two lenses. One builder.</span>
            </div>

            <article id="featured-project" className={styles.project} aria-label={project.name}>
              <div className={styles.projectToolbar}>
                <h2 className={styles.projectName}>{project.name}</h2>
                <div className={styles.lenses} role="group" aria-label="Project perspective">
                  <button type="button" aria-pressed={lens === "design"} aria-controls="project-perspective" onClick={() => setLens("design")}>
                    <Eye size={14} aria-hidden="true" /> Design
                  </button>
                  <button type="button" aria-pressed={lens === "engineering"} aria-controls="project-perspective" onClick={() => setLens("engineering")}>
                    <Code2 size={14} aria-hidden="true" /> Engineering
                  </button>
                </div>
              </div>

              <div id="project-perspective" aria-live="polite" aria-atomic="true">
                <div className={styles.visual} key={`${project.id}-${lens}`}>
                  {lens === "engineering" ? (
                    <SystemView project={project} />
                  ) : project.image ? (
                    <div className={styles.screenshotStage}>
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        fill
                        sizes="(min-width: 1100px) 600px, (min-width: 900px) 52vw, 92vw"
                        className={styles.screenshot}
                        priority={projectIndex === 0}
                      />
                    </div>
                  ) : <ContentFlowView />}
                </div>

                <div className={styles.projectStory}>
                  <h3>{perspective.title}</h3>
                  <p>{perspective.description}</p>
                  <div className={styles.storyBottom}>
                    <span className={styles.evidence}><Sparkles size={12} aria-hidden="true" />{perspective.evidence}</span>
                    <Link href={project.href} className={styles.projectLink}>
                      Read the story <ArrowUpRight size={14} aria-hidden="true" />
                      <span className="sr-only"> of {project.name}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            <div className={styles.projectPicker} role="group" aria-label="Choose a project">
              {landingProjects.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={index === projectIndex}
                  aria-controls="featured-project"
                  onClick={() => setProjectIndex(index)}
                >
                  <span className={styles.projectNumber}>0{index + 1}</span>
                  <span><strong>{item.name}</strong><span className={styles.category}>{item.category}</span></span>
                </button>
              ))}
            </div>
          </section>
        </main>

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
            <a href="https://www.linkedin.com/in/satyasainagubathula" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={12} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            <a href="mailto:nagubathula.satyasai@gmail.com" aria-label="Email Satya"><Mail size={16} aria-hidden="true" /></a>
          </nav>
        </footer>
      </div>
    </div>
  );
}
