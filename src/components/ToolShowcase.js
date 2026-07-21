"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function ToolShowcase() {
  const tools = [
    {
      title: "AutoEdit",
      description: "AI-powered infographic and typography editor making complex animations in seconds.",
      tags: ["Python", "React", "Video AI"],
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="text-xl font-medium text-black">Internal Tools</h2>
          <p className="mt-4 text-sm text-black/60 max-w-xs leading-relaxed">
            Zero-cost automation suites and live web products built to scale digital content production by 90%.
          </p>
        </div>
        
        <div className="md:col-span-8 flex flex-col">
          {tools.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-black/5 hover:border-black/20 transition-colors"
            >
              <div className="flex-1 pr-8">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-3xl font-medium text-black tracking-tight group-hover:translate-x-2 transition-transform duration-300">{tool.title}</h3>
                  <span className="text-[10px] font-mono tracking-wider px-2 py-1 bg-black/5 text-black/50 rounded uppercase group-hover:translate-x-2 transition-transform duration-300">Internal</span>
                </div>
                <p className="text-black/60 text-base max-w-md group-hover:translate-x-2 transition-transform duration-300 delay-75">
                  {tool.description}
                </p>
              </div>
              
              <div className="mt-6 md:mt-0 flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                <div className="flex flex-wrap gap-2 md:justify-end">
                  {tool.tags.map((tag, j) => (
                    <span key={j} className="text-xs font-mono text-black/40">
                      {tag}{j < tool.tags.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>
                <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-black/30 bg-black/5 flex-shrink-0" title="Internal Tool - Confidential">
                  <Lock size={16} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
