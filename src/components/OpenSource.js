"use client";

import Link from "next/link";
import { Code } from "lucide-react";

export default function OpenSource({ limit }) {
  const projects = [
    {
      name: "Toothpaste",
      role: "Creator",
      description: "An open-source Adobe plugin.",
      link: "https://github.com/nagubathula/toothpaste/releases/tag/Release",
    },
    {
      name: "CHAYA UI",
      role: "Core Contributor",
      description: "A modern, functional design system and component library for React built with Next.js and TailwindCSS. Collaborated directly with creators on design, development, and optimization. Authored several exclusive custom components.",
    },
    {
      name: "Engineerudu",
      role: "FOSS Community Builder",
      description: "Building Andhra Pradesh's first Free and Open Source Community to foster local talent and collaborative development.",
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5">
      <div className="flex flex-col gap-10">
        <div className="mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-black/60 text-xs font-medium mb-4 uppercase tracking-widest">
            <Code size={14} /> Community
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-black tracking-tight mb-4">
            Open Source
          </h2>
          <p className="text-base md:text-lg text-black/60 max-w-2xl leading-relaxed">
            Giving back to the community through code, design, and education.
          </p>
        </div>
        
        <div className="flex flex-col gap-6">
          {(limit ? projects.slice(0, limit) : projects).map((project, i) => {
            const CardContent = (
              <div
                className="group flex flex-col justify-between p-6 sm:p-8 bg-white rounded-3xl border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:scale-[1.01] transition-all duration-300 h-full"
              >
                <h3 className="text-2xl font-semibold text-black tracking-tight mb-1">{project.name}</h3>
                <p className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-4">{project.role}</p>
                <p className="text-black/70 text-base max-w-2xl leading-relaxed">{project.description}</p>
              </div>
            );

            return project.link ? (
              <a href={project.link} target="_blank" rel="noopener noreferrer" key={i} className="block">
                {CardContent}
              </a>
            ) : (
              <div key={i}>
                {CardContent}
              </div>
            );
          })}
        </div>
        
        {limit && projects.length > limit && (
          <div className="mt-8 flex justify-center">
            <Link href="/open-source" className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors">
              View More Open Source
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
