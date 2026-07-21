"use client";


import { ArrowUpRight } from "lucide-react";

export default function CaseStudies() {
  const studies = [
    {
      title: "From Doodles to Design",
      description: "My journey bridging creative visual direction and deep technical automation.",
      type: "Medium Article",
      link: "https://hippogriff.medium.com",
    },
    {
      title: "8-Element Prompt Framework",
      description: "Achieving 95% character consistency across AI generated video using Shot, Subject, Style, Color, and Lighting parameters.",
      type: "Engineering Experiment",
      link: "#",
    },
    {
      title: "Zero-Cost Automation",
      description: "Building an internal productivity suite using Google Colab, Supabase, and lightweight web extensions.",
      type: "Architecture Breakdown",
      link: "#",
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="text-xl font-medium text-black">Case Studies & Writing</h2>
          <p className="mt-4 text-sm text-black/60 max-w-xs leading-relaxed">
            Technical breakdowns, engineering experiments, and thoughts on the future of generative UI.
          </p>
        </div>
        
        <div className="md:col-span-8 flex flex-col gap-12">
          {studies.map((study, i) => (
            <a
              href={study.link}
              target="_blank"
              rel="noopener noreferrer"
              key={i}
              className="group block"
            >
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="text-2xl font-medium text-black group-hover:text-black/60 transition-colors tracking-tight">
                  {study.title}
                </h3>
                <ArrowUpRight size={20} className="text-black/30 group-hover:text-black transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
              <p className="text-black/60 text-base max-w-lg mb-2">{study.description}</p>
              <p className="text-sm font-mono text-black/40 uppercase tracking-wider">{study.type}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
