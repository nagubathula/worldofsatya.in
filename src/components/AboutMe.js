"use client";

import VennDiagram from "./VennDiagram";
import ExperienceTable from "./ExperienceTable";

export default function AboutMe() {
  return (
    <div className="mx-auto w-full max-w-6xl text-[#1d1d1f] flex flex-col gap-16 sm:gap-24 pb-16 sm:pb-24">
      {/* ==============================================================
          1) VENN DIAGRAM (Me in a VENN: Designer, Engineer, AI)
         ============================================================== */}
      <div id="who-am-i" className="scroll-mt-24 w-full">
        <VennDiagram />
      </div>

      {/* ==============================================================
          2) EXPERIENCE TABLE (Company History, Roles, Tech Stack)
         ============================================================== */}
      <div id="experience" className="scroll-mt-24 border-t border-black/[0.08] pt-16 sm:pt-20">
        <ExperienceTable />
      </div>
    </div>
  );
}
