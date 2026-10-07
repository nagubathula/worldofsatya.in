"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Calendar,
  MapPin,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Building2,
} from "lucide-react";
import Image from "next/image";
import { playPopSound } from "./SoundEffects";

// Official Company Logos with brand identity containers
function CompanyLogo({ company, className = "w-10 h-10" }) {
  switch (company) {
    case "NXTWAVE DISRUPTIVE TECHNOLOGIES":
      return (
        <div
          className={`${className} rounded-2xl bg-[#0b132b] p-2 flex items-center justify-center shadow-xs shrink-0 overflow-hidden border border-[#1e293b]`}
        >
          <Image
            src="/images/nxtwave-logo.svg"
            alt="NxtWave logo"
            width={44}
            height={44}
            className="w-full h-full object-contain"
          />
        </div>
      );
    case "CrestLogic Systems":
      return (
        <div
          className={`${className} rounded-2xl bg-[#f0fdf4] p-2 flex items-center justify-center shadow-xs shrink-0 overflow-hidden border border-emerald-500/20`}
        >
          <Image
            src="/images/crestlogic-icon.svg"
            alt="CrestLogic Systems logo"
            width={44}
            height={44}
            className="w-full h-full object-contain"
          />
        </div>
      );
    case "Andhra Pradesh Solar Power Corporation":
      return (
        <div
          className={`${className} rounded-2xl bg-white p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden border border-black/[0.08]`}
        >
          <Image
            src="/images/apspcl-logo.svg"
            alt="APSPCL logo"
            width={44}
            height={44}
            className="w-full h-full object-contain"
          />
        </div>
      );
    case "Traboda Solutions":
      return (
        <div
          className={`${className} rounded-2xl bg-[#faf5ff] p-2 flex items-center justify-center shadow-xs shrink-0 overflow-hidden border border-purple-500/20`}
        >
          <Image
            src="/images/traboda-icon.png"
            alt="Traboda Solutions logo"
            width={44}
            height={44}
            className="w-full h-full object-contain"
          />
        </div>
      );
    case "Redantio Solutions":
      return (
        <div
          className={`${className} rounded-2xl bg-white p-1 flex items-center justify-center shadow-xs shrink-0 overflow-hidden border border-black/[0.08]`}
        >
          <Image
            src="/images/redantio-logo.svg"
            alt="Redantio Solutions logo"
            width={44}
            height={44}
            className="w-full h-full object-contain"
          />
        </div>
      );
    default:
      return (
        <div
          className={`${className} rounded-2xl bg-[#1d1d1f] p-2 flex items-center justify-center text-white shrink-0`}
        >
          <Building2 size={20} />
        </div>
      );
  }
}

const EXPERIENCES = [
  {
    company: "NXTWAVE DISRUPTIVE TECHNOLOGIES",
    shortName: "NxtWave",
    role: "Generative AI Engineer and Creative Lead",
    period: "05/2025 — Present",
    isCurrent: true,
    location: "Hyderabad, India",
    type: "Full-Time",
    tags: ["Generative AI", "Veo 3", "ComfyUI", "Automation"],
  },
  {
    company: "CrestLogic Systems",
    shortName: "CrestLogic",
    role: "Product Engineer",
    period: "11/2024 — 03/2025",
    isCurrent: false,
    location: "Hyderabad, India",
    type: "Contract",
    tags: ["Product Design", "Frontend", "Branding", "UI/UX"],
  },
  {
    company: "Andhra Pradesh Solar Power Corporation",
    shortName: "APSPCL",
    role: "Product & Design Engineer (Consultant)",
    period: "07/2024 — 10/2024",
    isCurrent: false,
    location: "Andhra Pradesh, India",
    type: "Consultant",
    tags: ["GovTech", "Fullstack", "Web Architecture", "UI Design"],
  },
  {
    company: "Traboda Solutions",
    shortName: "Traboda",
    role: "Product Engineer (Intern)",
    period: "08/2023 — 07/2024",
    isCurrent: false,
    location: "Amritapuri / Remote",
    type: "Internship",
    tags: ["Chaya UI", "Hardware Security", "React", "Radix UI"],
  },
  {
    company: "Redantio Solutions",
    shortName: "Redantio",
    role: "Design and Development Engineer (Intern)",
    period: "01/2022 — 02/2023",
    isCurrent: false,
    location: "Andhra Pradesh, India",
    type: "Internship",
    tags: ["Design Systems", "Hardware Security", "Figma", "Web Dev"],
  },
];

export default function ExperienceTable() {
  const [filterTag, setFilterTag] = useState("All");

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
      playPopSound(520, 0.1);
    } catch {}
  };

  return (
    <section aria-labelledby="experience-table-heading" className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div>
          <h2
            id="experience-table-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#1d1d1f]"
          >
            Experience Table.
          </h2>
          <p
            className="mt-2 text-lg sm:text-xl text-[#626267] font-normal"
            style={{ fontFamily: "var(--font-editorial)" }}
          >
            Company history, engineering roles, and core technologies.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-[#f0f0f2] border border-black/[0.04]">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleFilter(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                filterTag === tag
                  ? "bg-white text-[#1d1d1f] font-semibold shadow-xs"
                  : "text-[#626267] hover:text-[#1d1d1f]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Modern High-Fidelity Table Container */}
      <div className="rounded-3xl border border-black/[0.08] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] overflow-hidden w-full">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#fafafc] text-[11px] font-mono uppercase tracking-[0.16em] text-[#86868b]">
                <th scope="col" className="py-4.5 px-6 font-semibold w-[42%]">
                  Company
                </th>
                <th scope="col" className="py-4.5 px-6 font-semibold w-[58%]">
                  Work Role & Scope
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {filteredExperiences.map((exp) => (
                <tr
                  key={exp.company}
                  className="group hover:bg-[#fbfbfd] transition-colors"
                >
                  {/* Column 1: Company Logo + Details */}
                  <td className="py-6 px-6 align-top w-[42%]">
                    <div className="flex items-start gap-3.5">
                      <CompanyLogo
                        company={exp.company}
                        className="w-11 h-11 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold tracking-tight text-[#1d1d1f] truncate">
                          {exp.shortName}
                        </h4>
                        <p className="text-[11px] font-mono text-[#86868b] uppercase tracking-wider mt-0.5 truncate">
                          {exp.company}
                        </p>
                        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-mono text-[#626267]">
                          <Calendar size={12} className="text-[#86868b] shrink-0" />
                          <span className="whitespace-nowrap">{exp.period}</span>
                        </div>
                        {exp.isCurrent && (
                          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Current Role
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Work Role & Scope */}
                  <td className="py-6 px-6 align-top w-[58%]">
                    <h3 className="text-base font-semibold text-[#1d1d1f] tracking-tight">
                      {exp.role}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-[#626267]">
                      <span className="inline-block rounded-md border border-black/[0.08] bg-[#f5f5f7] px-2 py-0.5 text-[11px] shrink-0">
                        {exp.type}
                      </span>
                      <span className="flex items-center gap-1 text-[#86868b] shrink-0">
                        <MapPin size={11} className="shrink-0" />
                        {exp.location}
                      </span>
                    </div>

                    {/* Skill Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-black/[0.03] border border-black/[0.04] px-2.5 py-0.5 text-[10px] font-mono text-[#626267] whitespace-nowrap"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Adaptive Card-Table View */}
        <div className="md:hidden divide-y divide-black/[0.06]">
          {filteredExperiences.map((exp) => (
            <div key={exp.company} className="p-5 flex flex-col gap-3">
              {/* Header: Logo + Role + Company */}
              <div className="flex items-start gap-3.5">
                <CompanyLogo company={exp.company} className="w-12 h-12" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-[#1d1d1f]">
                      {exp.role}
                    </h3>
                  </div>
                  <p className="text-xs font-mono font-medium uppercase tracking-wider text-[#626267] mt-0.5">
                    {exp.shortName}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs font-mono text-[#86868b]">
                    <span>{exp.period}</span>
                    {exp.isCurrent && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Current
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {exp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-black/[0.03] border border-black/[0.04] px-2.5 py-0.5 text-[10px] font-mono text-[#626267]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}