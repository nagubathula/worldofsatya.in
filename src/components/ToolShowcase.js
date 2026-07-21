"use client";


import { Lock } from "lucide-react";

export default function ToolShowcase() {
  const tools = [
    {
      title: "AutoEdit",
      description: "AI-powered infographic and typography editor making complex animations in seconds.",
      tags: ["Python", "React", "Whisper","Gemini"],
    },
    {
      title: "WhatThePrompt",
      description: "Web application offering standardized preset pipelines for high-consistency AI video/image generations.",
      tags: ["Next.js", "ComfyUI", "Supabase"],
    },
    {
      title: "Content Nexus",
      description: "Centralized operations suite featuring real-time YouTube analytics, team workflows, and role-based access.",
      tags: ["PostgreSQL", "React", "REST APIs"],
    },
    {
      title: "WA-Guardian",
      description: "Real-time browser extension detecting harmful content and scam alerts in chat apps.",
      tags: ["JavaScript", "Extension", "AI Filter"],
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5">
      <div className="flex flex-col gap-10">
        <div>
          <h2 className="text-xl font-medium text-black">Internal Tools</h2>
          <p className="mt-4 text-sm text-black/60 max-w-xl leading-relaxed">
            Zero-cost automation suites and live web products built to scale digital content production by 90%.
          </p>
        </div>
        
        <div className="flex flex-col gap-6">
          {tools.map((tool, i) => (
            <div
              key={i}
              className="group flex flex-col gap-6 p-6 sm:p-8 bg-white rounded-3xl border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-semibold text-black tracking-tight">{tool.title}</h3>
                  <span className="text-[10px] font-semibold tracking-wider px-2 py-1 bg-black/5 text-black/50 rounded-full uppercase">Internal</span>
                </div>
                <p className="text-black/60 text-base max-w-2xl">
                  {tool.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between gap-6 w-full pt-4 border-t border-black/[0.04]">
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag, j) => (
                    <span key={j} className="text-xs font-mono text-black/50 bg-black/[0.03] px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-black/30 bg-black/5 flex-shrink-0" title="Internal Tool - Confidential">
                  <Lock size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
