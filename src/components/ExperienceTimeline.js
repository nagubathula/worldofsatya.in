"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function ExperienceTimeline({ limit, showStats = false }) {
  const experiences = [
    {
      year: "05/2025 - Present",
      role: "Generative AI Engineer and Creative Lead",
      company: "NXTWAVE DISRUPTIVE TECHNOLOGIES",
      description: "Led AI production, scaling channels to 100K+ followers and orchestrating 2,000+ videos. Pioneered structured JSON automation for models like Veo 3 & Wan 2.2. Built internal tools slashing asset creation time by 90%.",
    },
    {
      year: "11/2024 - 03/2025",
      role: "Product Engineer",
      company: "CrestLogic Systems",
      description: "Branding, User Interface Design, and marketing funnel development for billjot.",
    },
    {
      year: "07/2024 - 10/2024",
      role: "Product & Design Engineer (Consultant)",
      company: "Andhra Pradesh Solar Power Corporation",
      description: "UI Design, Web Design, and Fullstack Web development.",
    },
    {
      year: "08/2023 - 07/2024",
      role: "Product Engineer (Intern)",
      company: "Traboda Solutions",
      description: "UI Designer, Hardware Security Researcher, and Fullstack Web Development.",
    },
    {
      year: "01/2022 - 02/2023",
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
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.35, ease: "easeOut" } 
    },
  };

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="w-full"
    >
      <div className="py-12 sm:py-20 px-4 sm:px-8 max-w-6xl 2xl:max-w-7xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
        <motion.div variants={itemAnim} className="mb-2 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f5f7] text-[#86868b] text-xs font-sans mb-4 uppercase tracking-wider font-medium border border-black/[0.04]">
            <Briefcase size={13} /> Career
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.03em] mb-3 sm:mb-4">
            Corporate Experience
          </h2>
          <p className="text-base sm:text-lg text-[#86868b] max-w-2xl leading-relaxed font-sans">
            A history of bridging design and engineering.
          </p>
        </motion.div>
        
        <div className="flex flex-col gap-4 sm:gap-5">
          {(limit ? experiences.slice(0, limit) : experiences).map((exp, i) => (
            <motion.div
              variants={itemAnim}
              key={i}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-3 sm:gap-5 p-6 sm:p-8 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all"
            >
              <div>
                <span className="text-xs font-sans font-medium text-[#86868b] bg-[#f5f5f7] border border-black/[0.04] px-3 py-1 rounded-full">
                  {exp.year}
                </span>
              </div>
              <div className="w-full">
                <h3 className="text-xl sm:text-2xl font-sans font-semibold text-[#1d1d1f] tracking-tight mb-1">{exp.role}</h3>
                <h4 className="text-xs sm:text-sm font-sans font-medium text-[#86868b] mb-2 sm:mb-3 uppercase tracking-wider">{exp.company}</h4>
                <p className="text-[#515154] text-sm sm:text-base max-w-2xl leading-relaxed font-sans">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Other experiences */}
        {showStats && (
          <motion.div variants={itemAnim} className="mt-4 sm:mt-8">
            <h3 className="text-xl sm:text-3xl font-sans font-semibold text-[#1d1d1f] tracking-tight mb-4 sm:mb-6">
              Other Experiences
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { value: "280+", label: "Clients served" },
                { value: "6", label: "Years of experience" },
                { value: "36", label: "Students trained in engineering & design" },
                { value: "3", label: "Movies worked on" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-1 p-5 sm:p-6 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                >
                  <span className="text-2xl sm:text-4xl font-sans font-semibold text-[#1d1d1f] tracking-tight">{stat.value}</span>
                  <span className="text-[11px] sm:text-xs font-sans text-[#86868b] leading-snug">{stat.label}</span>
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
