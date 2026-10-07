"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function ExperienceTimeline({ limit, showStats = false, bento = false }) {
  const experiences = [
    {
      year: "05/2025 — Present",
      role: "Generative AI Engineer and Creative Lead",
      company: "NXTWAVE DISRUPTIVE TECHNOLOGIES",
      description: "Led AI production, scaling channels to 100K+ followers and orchestrating 2,000+ videos. Pioneered structured JSON automation for models like Veo 3 & Wan 2.2. Built internal tools slashing asset creation time by 90%.",
    },
    {
      year: "11/2024 — 03/2025",
      role: "Product Engineer",
      company: "CrestLogic Systems",
      description: "Branding, User Interface Design, and marketing funnel development for billjot.",
    },
    {
      year: "07/2024 — 10/2024",
      role: "Product & Design Engineer (Consultant)",
      company: "Andhra Pradesh Solar Power Corporation",
      description: "UI Design, Web Design, and Fullstack Web development.",
    },
    {
      year: "08/2023 — 07/2024",
      role: "Product Engineer (Intern)",
      company: "Traboda Solutions",
      description: "UI Designer, Hardware Security Researcher, and Fullstack Web Development.",
    },
    {
      year: "01/2022 — 02/2023",
      role: "Design and Development Engineer (Intern)",
      company: "Redantio Solutions",
      description: "UI Designer, Figma Tutor, Graphic Design, Hardware Security Research and Web Development.",
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.35, ease: "easeOut" } 
    },
  };

  // Card-less editorial layout for About page
  if (bento) {
    return (
      <section aria-labelledby="career-heading" className="mx-auto mb-20 w-full max-w-5xl text-[#1d1d1f]">
        <div className="border-t border-black/[0.08] pt-14 sm:pt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#86868b]">06 / Chronology</span>
              <h2 id="career-heading" className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                A history of bridging design & engineering.
              </h2>
            </div>
            <p className="max-w-md text-sm text-[#626267]">
              Career trajectory across creative software, startups, and product engineering.
            </p>
          </div>

          <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {experiences.map((exp) => (
              <div 
                key={exp.company + exp.year} 
                className="group py-7 sm:py-9 transition-colors hover:bg-black/[0.015] px-2 -mx-2 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-baseline">
                  {/* Period */}
                  <div className="md:col-span-3">
                    <span className="inline-block font-mono text-xs sm:text-sm font-medium text-[#86868b]">
                      {exp.year}
                    </span>
                  </div>

                  {/* Role & Company */}
                  <div className="md:col-span-4">
                    <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[#1d1d1f]">
                      {exp.role}
                    </h3>
                    <p className="mt-1 text-xs font-mono uppercase tracking-wider text-[#626267]">
                      {exp.company}
                    </p>
                  </div>

                  {/* Narrative Description */}
                  <div className="md:col-span-5">
                    <p className="text-sm leading-relaxed text-[#515154]">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#626267] hover:text-[#1d1d1f] transition-colors underline decoration-black/20 underline-offset-4"
            >
              Full timeline & details →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="w-full"
    >
      <div className="py-12 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
        <motion.div variants={itemAnim} className="mb-2 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f5f7] text-[#86868b] text-xs font-mono mb-4 uppercase tracking-wider font-medium border border-black/[0.04]">
            <Briefcase size={13} /> Chronology
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.03em] mb-3 sm:mb-4">
            Corporate Experience
          </h2>
          <p className="text-base sm:text-lg text-[#86868b] max-w-2xl leading-relaxed font-sans">
            A history of bridging design and engineering.
          </p>
        </motion.div>
        
        <div className="divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {(limit ? experiences.slice(0, limit) : experiences).map((exp, i) => (
            <motion.div
              variants={itemAnim}
              key={i}
              className="py-7 sm:py-9 transition-colors hover:bg-black/[0.015] px-2 -mx-2 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-baseline">
                <div className="md:col-span-3">
                  <span className="font-mono text-xs sm:text-sm font-medium text-[#86868b]">
                    {exp.year}
                  </span>
                </div>
                <div className="md:col-span-4">
                  <h3 className="text-base sm:text-lg font-semibold tracking-tight text-[#1d1d1f]">{exp.role}</h3>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[#626267] mt-1">{exp.company}</h4>
                </div>
                <div className="md:col-span-5">
                  <p className="text-[#515154] text-sm leading-relaxed">{exp.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Other experiences */}
        {showStats && (
          <motion.div variants={itemAnim} className="mt-8 sm:mt-12 border-t border-black/[0.08] pt-10">
            <h3 className="text-xl sm:text-2xl font-sans font-semibold text-[#1d1d1f] tracking-tight mb-6">
              Impact at a Glance
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: "280+", label: "Clients served" },
                { value: "6+", label: "Years of experience" },
                { value: "36", label: "Students mentored in design & engineering" },
                { value: "3", label: "Feature films credited" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-1 border-l border-black/[0.1] pl-4"
                >
                  <span className="text-2xl sm:text-4xl font-semibold text-[#1d1d1f] tracking-tight">{stat.value}</span>
                  <span className="text-[11px] sm:text-xs text-[#86868b] leading-snug">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {limit && experiences.length > limit && (
          <motion.div variants={itemAnim} className="mt-4 sm:mt-8 flex justify-center">
            <Link href="/experience" className="px-6 py-2.5 bg-[#1d1d1f] text-white rounded-full text-xs sm:text-sm font-sans font-medium hover:bg-[#333336] transition-all shadow-sm">
              View Full Experience
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
