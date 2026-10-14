"use client";

import { useState } from "react";
import Image from "next/image";
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
      playPopSound(520, 0.03);
    } catch {}
  };

  return (
    <section aria-labelledby="experience-heading" className="w-full select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
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

      {/* Modern High-Fidelity Table Container */}
      <div className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden w-full">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#fafafa] text-[11px] font-mono uppercase tracking-[0.14em] text-[#8e8e93]">
                <th scope="col" className="py-3.5 px-6 font-semibold w-[26%]">
                  Company
                </th>
                <th scope="col" className="py-3.5 px-6 font-semibold w-[50%]">
                  Role & Scope
                </th>
                <th scope="col" className="py-3.5 px-6 font-semibold w-[24%] text-right">
                  Timeline
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.06]">
              {filteredExperiences.map((exp) => (
                <tr
                  key={exp.company}
                  className="group hover:bg-[#fafafc] transition-colors duration-200"
                >
                  {/* Column 1: Company Logo + Details */}
                  <td className="py-5 px-6 align-top w-[26%]">
                    <div className="flex items-center gap-3.5">
                      <CompanyLogo
                        logo={exp.logo}
                        name={exp.company}
                        className="w-10 h-10"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold tracking-tight text-[#111111] group-hover:text-black transition-colors">
                          {exp.company}
                        </h4>
                        <p className="text-xs text-[#8e8e93] font-normal truncate mt-0.5">
                          {exp.location}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Work Role & Scope */}
                  <td className="py-5 px-6 align-top w-[50%]">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-[#111111] tracking-tight">
                          {exp.role}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/[0.04] text-[#6e6e73] font-medium shrink-0">
                          {exp.type}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#515154]">
                        {exp.description}
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {exp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-[#f5f5f7] border border-black/[0.04] px-2 py-0.5 text-[10px] font-mono text-[#515154] whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Timeline & Current Badge */}
                  <td className="py-5 px-6 align-top w-[24%] text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-mono text-[#515154] font-medium whitespace-nowrap">
                        {exp.period}
                      </span>
                      {exp.isCurrent && (
                        <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Current Role
                        </span>
                      )}
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
            <div key={exp.company} className="p-4 sm:p-5 flex flex-col gap-3 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <CompanyLogo logo={exp.logo} name={exp.company} className="w-10 h-10" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-[#111111] truncate">{exp.company}</h4>
                    <p className="text-xs text-[#8e8e93] truncate">{exp.location}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono text-[#515154] whitespace-nowrap">{exp.period}</p>
                  {exp.isCurrent && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Current
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#111111]">{exp.role}</h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/[0.04] text-[#6e6e73]">
                    {exp.type}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#515154]">
                  {exp.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-[#f5f5f7] border border-black/[0.04] px-2 py-0.5 text-[10px] font-mono text-[#515154]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}