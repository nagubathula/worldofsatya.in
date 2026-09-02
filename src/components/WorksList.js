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
      
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === category
                ? "bg-foreground text-background shadow-md"
                : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
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
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
                key={work.id}
              >
                <Link href={`/works/${work.id}`} className="block group h-full">
                  <div className="relative p-6 sm:p-10 bg-background rounded-3xl sm:rounded-[2rem] border border-foreground/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group-hover:scale-[1.01] overflow-hidden">
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-center">
                      <div className="flex flex-col flex-1 h-full w-full justify-center">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-foreground/5 text-[10px] sm:text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                            {getIcon(work.category)}
                            {work.category}
                          </span>
                          <span className="text-[10px] sm:text-xs font-semibold text-foreground/40 uppercase tracking-widest">
                            {work.tag}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl sm:text-4xl font-semibold text-foreground tracking-tight mb-4">
                          {work.title}
                        </h3>
                        
                        <p className="text-foreground/70 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
                          {work.description}
                        </p>
                        
                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/50 group-hover:text-foreground transition-colors mt-auto">
                          View Details
                          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                      </div>
                      
                      {work.image && (
                        <div className="w-full sm:w-[45%] md:w-[45%] aspect-video sm:aspect-[4/3] relative rounded-2xl overflow-hidden shrink-0 border border-foreground/[0.05] shadow-sm">
                          <Image 
                            src={work.image} 
                            alt={work.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
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
