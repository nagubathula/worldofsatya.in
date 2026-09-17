"use client";

import Link from "next/link";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function ExperienceTimeline({ limit }) {
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
        staggerChildren: 0.15,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, scale: 0.85, y: 20 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25, 
        mass: 0.8 
      } 
    },
  };

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full"
    >
      <div className="py-12 sm:py-20 px-4 sm:px-8 max-w-6xl 2xl:max-w-7xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
        <motion.div variants={itemAnim} className="mb-2 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#3e3832]/5 text-[#3e3832] text-xs font-pixel mb-4 uppercase tracking-widest border border-[#3e3832]/25 shadow-[1px_1px_0px_rgba(62,56,50,0.1)]">
            <Briefcase size={14} /> Career
          </div>
          <h2 className="text-3xl sm:text-5xl font-editorial font-normal text-[#3e3832] tracking-tight mb-3 sm:mb-4">
            Corporate Experience
          </h2>
          <p className="text-base sm:text-lg text-[#3e3832]/75 max-w-2xl leading-relaxed font-editorial">
            A history of bridging design and engineering.
          </p>
        </motion.div>
        
        <div className="flex flex-col gap-4 sm:gap-6">
          {(limit ? experiences.slice(0, limit) : experiences).map((exp, i) => (
            <motion.div
              variants={itemAnim}
              key={i}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="flex flex-col gap-3 sm:gap-6 p-6 sm:p-8 retro-card transition-all duration-300"
            >
              <div>
                <span className="text-xs sm:text-sm font-pixel text-[#3e3832]/80 bg-[#3e3832]/5 border border-[#3e3832]/20 px-3 py-1 rounded-sm shadow-[1px_1px_0px_rgba(62,56,50,0.08)]">{exp.year}</span>
              </div>
              <div className="w-full">
                <h3 className="text-xl sm:text-2xl font-editorial font-normal text-[#3e3832] tracking-tight mb-1">{exp.role}</h3>
                <h4 className="text-sm sm:text-base font-pixel text-[#c2410c] mb-2 sm:mb-4">{exp.company}</h4>
                <p className="text-[#3e3832]/80 text-base max-w-2xl leading-relaxed font-editorial">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Other experiences: the numbers that don't fit a timeline */}
        <motion.div variants={itemAnim} className="mt-2 sm:mt-6">
          <h3 className="text-xl sm:text-3xl font-editorial font-normal text-[#3e3832] tracking-tight mb-4 sm:mb-6">
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
                className="flex flex-col gap-1 p-4 sm:p-6 retro-card"
              >
                <span className="text-2xl sm:text-4xl font-editorial font-normal text-[#3e3832] tracking-tight">{stat.value}</span>
                <span className="text-[11px] sm:text-xs font-pixel uppercase tracking-wider text-[#3e3832]/60 leading-snug">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {limit && experiences.length > limit && (
          <motion.div variants={itemAnim} className="mt-4 sm:mt-8 flex justify-center">
            <Link href="/experience" className="px-6 py-3 bg-[#3e3832] text-[#f4ebd8] rounded-sm border-2 border-[#3e3832] text-xs font-pixel tracking-wider shadow-[3px_3px_0px_rgba(62,56,50,0.25)] hover:shadow-[4px_4px_0px_rgba(62,56,50,0.35)] active:translate-x-[2px] active:translate-y-[2px] transition-all">
              View Full Experience
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
