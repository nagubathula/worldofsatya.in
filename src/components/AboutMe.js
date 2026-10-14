"use client";

import VennDiagram from "./VennDiagram";
import ExperienceTable from "./ExperienceTable";

const STATS = [
  { value: "6", label: "Years Experience" },
  { value: "280+", label: "Clients Served" },
  { value: "2,000+", label: "AI Video Pipelines" },
  { value: "36", label: "Students Mentored" },
  { value: "3", label: "Film Credits" },
];

export default function AboutMe() {
  return (
    <div className="mx-auto w-full max-w-6xl text-[#1d1d1f] flex flex-col gap-14 sm:gap-20 pb-16 sm:pb-24">
      {/* 1) VENN DIAGRAM (Me in a VENN: Designer, Engineer, AI) */}
      <div id="who-am-i" className="scroll-mt-24 w-full">
        <VennDiagram />
      </div>

      {/* 2) STATS & MILESTONES (from full profile) */}
      <div className="border-y border-black/[0.08] py-8 sm:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#111111]">
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-mono uppercase tracking-wider text-[#8e8e93]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3) EXPERIENCE TABLE (Company History, Roles, Tech Stack) */}
      <div id="experience" className="scroll-mt-24 w-full">
        <ExperienceTable />
      </div>
    </div>
  );
}
