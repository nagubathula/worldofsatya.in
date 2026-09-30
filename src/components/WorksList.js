"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Code, Briefcase, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { allWorks } from "@/data/works";

// Keep every discipline together in one collection.
const CATEGORY_PRIORITY = { "Open Source": 0, "Project": 1, "Case Study": 2 };

export default function WorksList() {
  const [filter, setFilter] = useState("All");

  const worksOnly = allWorks;

  const categories = [
    "All",
    ...[...new Set(worksOnly.map(work => work.category))].sort(
      (a, b) => (CATEGORY_PRIORITY[a] ?? 99) - (CATEGORY_PRIORITY[b] ?? 99)
    ),
  ];

  const sortedWorks = [...worksOnly].sort(
    (a, b) => (CATEGORY_PRIORITY[a.category] ?? 99) - (CATEGORY_PRIORITY[b.category] ?? 99)
  );

  const filteredWorks = filter === "All"
    ? sortedWorks
    : sortedWorks.filter(work => work.category === filter);

  const getIcon = (category) => {
    switch(category) {
      case "Case Study": return <BookOpen size={13} className="mr-1" />;
      case "Project": return <Briefcase size={13} className="mr-1" />;
      case "Open Source": return <Code size={13} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 pb-20">
      
      {/* Filters - Apple Segmented Control */}
      <div className="flex flex-wrap items-center justify-center gap-1 p-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] max-w-fit mx-auto mb-6 sm:mb-10 shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)]">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            aria-pressed={filter === category}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-sans font-medium transition-all duration-150 ${
              filter === category
                ? "bg-white text-[#1d1d1f] shadow-sm"
                : "text-[#86868b] hover:text-[#1d1d1f] hover:bg-white/60"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-4 sm:gap-5">
        <AnimatePresence mode="popLayout">
          {filteredWorks.map((work) => {
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                key={work.id}
              >
                <Link href={work.link?.startsWith("/works/case-studies/") ? work.link : `/works/${work.id}`} className="block group h-full">
                  <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all duration-200 overflow-hidden">
                    {/* Clean Tag */}
                    <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
                      <span className="text-[11px] font-sans text-[#86868b] tracking-wider uppercase font-medium">{work.tag}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center">
                      {work.image && (
                        <div className="w-full sm:w-[38%] lg:w-[35%] aspect-video sm:aspect-[4/3] relative rounded-2xl overflow-hidden shrink-0 border border-black/[0.06] bg-[#f5f5f7]">
                          <Image 
                            src={work.image} 
                            alt={work.title} 
                            fill 
                            sizes="(max-width: 640px) 100vw, 400px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                          />
                        </div>
                      )}

                      <div className="flex flex-col flex-1 h-full w-full justify-center">
                        <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[11px] font-sans text-[#86868b] uppercase tracking-wider font-medium border border-black/[0.04]">
                            {getIcon(work.category)}
                            {work.category}
                          </span>
                        </div>
                        
                        <h2 className="text-xl sm:text-2xl font-sans font-semibold text-[#1d1d1f] tracking-tight mb-2 sm:mb-3 group-hover:text-black transition-colors">
                          {work.title}
                        </h2>
                        
                        <p className="text-[#515154] text-sm sm:text-base max-w-2xl leading-relaxed font-sans mb-4 sm:mb-6">
                          {work.description}
                        </p>
                        
                        <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans font-medium text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors mt-auto">
                          {work.category === "Case Study" ? "Read the story" : "Explore work"}
                          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
