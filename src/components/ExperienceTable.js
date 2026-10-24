"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { playPopSound } from "./SoundEffects";

function CompanyLogo({ logo, name, className = "w-10 h-10" }) {
  return (
    <div
      className={`${className} rounded-xl bg-[#fafafa] border border-black/[0.06] p-2 flex items-center justify-center shadow-2xs shrink-0 overflow-hidden group-hover:border-black/20 group-hover:bg-white group-hover:shadow-xs transition-all duration-200`}
    >
      <Image
        src={logo}
        alt={`${name} logo`}
        width={32}
        height={32}
        className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-200"
      />
    </div>
  );
}

const EXPERIENCES = [
  {
    company: "NxtWave",
    role: "Generative AI Engineer and Creative Lead",
    period: "05/2025 — Present",
    isCurrent: true,
    location: "Hyderabad, India",
    type: "Full-Time",
    logo: "/images/nxtwave-logo.svg",
    description:
      "Led AI production, scaling channels to 100K+ followers and orchestrating 2,000+ videos. Pioneered structured JSON automation for models like Veo 3 & Wan 2.2. Built internal tools slashing asset creation time by 90%.",
    tags: ["Generative AI", "Veo 3", "ComfyUI", "Automation", "Wan 2.2"],
  },
  {
    company: "CrestLogic",
    role: "Product Engineer",
    period: "11/2024 — 03/2025",
    isCurrent: false,
    location: "Hyderabad, India",
    type: "Contract",
    logo: "/images/crestlogic-icon.svg",
    description:
      "Branding, User Interface Design, and marketing funnel development for billjot.",
    tags: ["Product Design", "Frontend", "Branding", "UI/UX"],
  },
  {
    company: "APSPCL",
    role: "Product & Design Engineer (Consultant)",
    period: "07/2024 — 10/2024",
    isCurrent: false,
    location: "Andhra Pradesh, India",
    type: "Consultant",
    logo: "/images/apspcl-logo.svg",
    description:
      "UI Design, Web Design, and Fullstack Web development for Andhra Pradesh Solar Power Corporation.",
    tags: ["GovTech", "Fullstack", "Web Architecture", "UI Design"],
  },
  {
    company: "Traboda",
    role: "Product Engineer (Intern)",
    period: "08/2023 — 07/2024",
    isCurrent: false,
    location: "Amritapuri / Remote",
    type: "Internship",
    logo: "/images/traboda-icon.png",
    description:
      "UI Designer, Hardware Security Researcher, and Fullstack Web Development on Chaya UI component library.",
    tags: ["Chaya UI", "Hardware Security", "React", "Radix UI"],
  },
  {
    company: "Redantio",
    role: "Design and Development Engineer (Intern)",
    period: "01/2022 — 02/2023",
    isCurrent: false,
    location: "Andhra Pradesh, India",
    type: "Internship",
    logo: "/images/redantio-icon.png",
    description:
      "UI Designer, Figma Tutor, Graphic Design, Hardware Security Research, and Web Development.",
    tags: ["Design Systems", "Hardware Security", "Figma", "Web Dev"],
  },
];

// The year a role started: "05/2025 — Present" → "2025".
function startYear(period) {
  return period.match(/\d{4}/)?.[0] ?? "";
}

const EASE = [0.22, 1, 0.36, 1];

// One role on the timeline: the start year beside the line, a dot on it, and
// the card. The current role is the dark card.
function TimelineEntry({ exp, reduceMotion }) {
  const dark = exp.isCurrent;
  return (
    <motion.li
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-x-4 pb-10 last:pb-0 md:grid-cols-[120px_40px_minmax(0,1fr)] md:gap-x-6"
    >
      {/* Year, beside the line on wide screens */}
      <div className="hidden pt-5 text-right md:block">
        <p className="text-4xl font-semibold leading-none tracking-[-0.04em] text-[#111111]">{startYear(exp.period)}</p>
        <p className="mt-2 text-[11px] text-[#86868b]">{exp.period}</p>
      </div>

      {/* The dot on the line; it fills in as the role comes into view */}
      <div className="relative flex justify-center pt-7">
        <motion.span
          initial={reduceMotion ? false : { scale: 0.6, backgroundColor: "#ffffff" }}
          whileInView={{ scale: 1, backgroundColor: dark ? "#34c759" : "#111111" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
          className="relative z-10 h-3.5 w-3.5 rounded-full border-2 border-[#111111] ring-4 ring-[#fafafc]"
        />
      </div>

      {/* The role */}
      <article
        className={`rounded-3xl border p-5 sm:p-6 ${
          dark
            ? "border-white/10 bg-[#1a1a1a] text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
            : "border-black/[0.06] bg-white text-[#111111] shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        }`}
      >
        {/* Year and dates, above the card on phones */}
        <p className={`mb-3 text-[11px] font-medium md:hidden ${dark ? "text-white/50" : "text-[#86868b]"}`}>{exp.period}</p>

        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <CompanyLogo logo={exp.logo} name={exp.company} className="h-10 w-10" />
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold">{exp.company}</h4>
              <p className={`truncate text-xs ${dark ? "text-white/50" : "text-[#86868b]"}`}>{exp.location}</p>
            </div>
          </div>
          {dark ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34c759]" />
              Current role
            </span>
          ) : (
            <span className="shrink-0 whitespace-nowrap rounded-full bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium text-[#6e6e73]">
              {exp.type}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-lg font-semibold leading-snug tracking-[-0.02em]">{exp.role}</h3>
        <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-white/70" : "text-[#515154]"}`}>{exp.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {exp.tags.map((tag) => (
            <span
              key={tag}
              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium ${
                dark ? "bg-white/10 text-white/80" : "bg-[#f5f5f7] text-[#515154]"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </motion.li>
  );
}

export default function ExperienceTable() {
  const [filterTag, setFilterTag] = useState("All");
  const reduceMotion = useReducedMotion();
  const listRef = useRef(null);
  // The line fills in as the list scrolls past the middle of the screen.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 55%"] });

  const allTags = [
    "All",
    "Generative AI",
    "Product Design",
    "Hardware Security",
    "Frontend",
  ];

  const filteredExperiences =
    filterTag === "All"
      ? EXPERIENCES
      : EXPERIENCES.filter((exp) =>
          exp.tags.some((t) => t.toLowerCase().includes(filterTag.toLowerCase()))
        );

  const handleFilter = (tag) => {
    setFilterTag(tag);
    try {
      playPopSound(520, 0.03);
    } catch {}
  };

  return (
    <section aria-labelledby="experience-heading" className="w-full select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
        <div>
          <h2
            id="experience-heading"
            className="text-3xl sm:text-4xl lg:text-[44px] font-semibold tracking-[-0.03em] text-[#111111] leading-tight"
          >
            Work Experience
          </h2>
          <p className="mt-2 text-base text-[#6e6e73]">
            Engineering roles, company history, and core technologies.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const isActive = filterTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleFilter(tag)}
                aria-pressed={isActive}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#111111] text-white shadow-xs"
                    : "bg-white/80 hover:bg-white text-[#515154] hover:text-[#111111] border border-black/5"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* The timeline: a line down the left that draws itself as you scroll,
          with each role hung off it, newest first. */}
      <div ref={listRef} className="relative mx-auto max-w-4xl">
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-[13px] top-0 w-0.5 rounded-full bg-black/[0.08] md:left-[163px]"
        >
          <motion.div
            style={{ scaleY: reduceMotion ? 1 : scrollYProgress, originY: 0 }}
            className="h-full w-full rounded-full bg-[#111111]"
          />
        </div>
        <ol className="relative">
          <AnimatePresence initial={false} mode="popLayout">
            {filteredExperiences.map((exp) => (
              <TimelineEntry key={exp.company} exp={exp} reduceMotion={reduceMotion} />
            ))}
          </AnimatePresence>
        </ol>
      </div>
    </section>
  );
}
