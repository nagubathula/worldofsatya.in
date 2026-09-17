"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Code, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { allWorks } from "@/data/works";

// Open Source leads; Project follows
const CATEGORY_PRIORITY = { "Open Source": 0, "Project": 1 };

export default function WorksList() {
  const [filter, setFilter] = useState("All");

  const worksOnly = allWorks.filter((work) => work.category !== "Case Study");

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
      case "Project": return <Briefcase size={14} className="mr-1" />;
      case "Open Source": return <Code size={14} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 pb-20">
      
      {/* Filters - Retro Segmented Control */}
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-sm bg-[#3e3832]/[0.05] border-2 border-[#3e3832]/25 max-w-fit mx-auto mb-6 sm:mb-10 shadow-[3px_3px_0px_rgba(62,56,50,0.1)]">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-sm text-xs sm:text-sm font-pixel tracking-wider border transition-all duration-120 ${
              filter === category
                ? "bg-[#3e3832] text-[#f4ebd8] border-[#3e3832] shadow-[2px_2px_0px_rgba(62,56,50,0.25)]"
                : "border-transparent text-[#3e3832]/70 hover:text-[#3e3832] hover:bg-[#3e3832]/[0.06]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredWorks.map((work) => {
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                key={work.id}
              >
                <Link href={`/works/${work.id}`} className="block group h-full">
                  <div className="relative p-4 sm:p-9 retro-card group-hover:scale-[1.008] overflow-hidden">
                    {/* Clean Tag */}
                    <div className="flex items-center gap-1.5 mb-3 sm:mb-5">
                      <span className="text-[11px] sm:text-xs font-pixel text-[#3e3832]/60 tracking-widest uppercase">{work.tag}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 items-center">
                      <div className="flex flex-col flex-1 h-full w-full justify-center">
                        <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm bg-[#3e3832]/5 text-[10px] sm:text-xs font-pixel text-[#3e3832]/80 uppercase tracking-widest border-2 border-[#3e3832]/25 shadow-[1px_1px_0px_rgba(62,56,50,0.12)]">
                            {getIcon(work.category)}
                            {work.category}
                          </span>
                        </div>
                        
                        <h3 className="text-xl sm:text-3xl font-editorial font-normal text-[#3e3832] tracking-tight mb-2 sm:mb-3">
                          {work.title}
                        </h3>
                        
                        <p className="text-[#3e3832]/80 text-sm sm:text-base max-w-2xl leading-relaxed font-editorial mb-4 sm:mb-6">
                          {work.description}
                        </p>
                        
                        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-pixel text-[#3e3832]/70 group-hover:text-[#3e3832] transition-colors mt-auto">
                          View Project
                          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                      
                      {work.image && (
                        <div className="w-full sm:w-[42%] aspect-video sm:aspect-[4/3] relative rounded-sm overflow-hidden shrink-0 border border-[#3e3832]/20 shadow-sm bg-foreground/5">
                          <Image 
                            src={work.image} 
                            alt={work.title} 
                            fill 
                            sizes="(max-width: 640px) 100vw, 400px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out sepia-[0.15] contrast-105" 
                          />
                        </div>
                      )}
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
