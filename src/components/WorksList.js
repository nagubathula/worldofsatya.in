"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpen, Code, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { allWorks } from "@/data/works";

// Open Source leads; everything else follows in data order
const CATEGORY_PRIORITY = { "Open Source": 0, "Project": 1, "Case Study": 2 };

export default function WorksList() {
  const [filter, setFilter] = useState("All");

  const categories = [
    "All",
    ...[...new Set(allWorks.map(work => work.category))].sort(
      (a, b) => (CATEGORY_PRIORITY[a] ?? 99) - (CATEGORY_PRIORITY[b] ?? 99)
    ),
  ];

  const sortedWorks = [...allWorks].sort(
    (a, b) => (CATEGORY_PRIORITY[a.category] ?? 99) - (CATEGORY_PRIORITY[b.category] ?? 99)
  );

  const filteredWorks = filter === "All"
    ? sortedWorks
    : sortedWorks.filter(work => work.category === filter);

  const getIcon = (category) => {
    switch(category) {
      case "Project": return <Briefcase size={14} className="mr-1" />;
      case "Case Study": return <BookOpen size={14} className="mr-1" />;
      case "Open Source": return <Code size={14} className="mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 pb-20">
      
      {/* Filters - Apple Segmented Control */}
      <div className="flex flex-wrap items-center justify-center gap-1 p-1 rounded-full bg-foreground/[0.04] border border-foreground/[0.06] backdrop-blur-xl max-w-fit mx-auto mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-180 ${
              filter === category
                ? "bg-foreground text-background shadow-sm"
                : "text-foreground/65 hover:text-foreground hover:bg-foreground/[0.05]"
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
                  <div className="relative p-6 sm:p-9 bg-background/80 backdrop-blur-2xl rounded-3xl border border-foreground/[0.08] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] hover:border-foreground/20 transition-all duration-300 group-hover:scale-[1.008] overflow-hidden">
                    {/* Clean Tag */}
                    <div className="flex items-center gap-1.5 mb-5">
                      <span className="text-[11px] font-medium text-foreground/50 tracking-wider uppercase">{work.tag}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center">
                      <div className="flex flex-col flex-1 h-full w-full justify-center">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-foreground/5 text-[10px] sm:text-xs font-semibold text-foreground/70 uppercase tracking-wider border border-foreground/[0.06]">
                            {getIcon(work.category)}
                            {work.category}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mb-3">
                          {work.title}
                        </h3>
                        
                        <p className="text-foreground/70 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
                          {work.description}
                        </p>
                        
                        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-foreground/60 group-hover:text-foreground transition-colors mt-auto">
                          View Case Study
                          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                      
                      {work.image && (
                        <div className="w-full sm:w-[42%] aspect-video sm:aspect-[4/3] relative rounded-2xl overflow-hidden shrink-0 border border-foreground/[0.08] shadow-sm bg-foreground/5">
                          <Image 
                            src={work.image} 
                            alt={work.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
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
