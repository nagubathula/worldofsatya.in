"use client";

import Link from "next/link";
import Image from "next/image";
import { Briefcase, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { allWorks } from "@/data/works";

// Flagship picks shown on the homepage — one for each target role:
// product design + engineering (NotBad), generative AI (OpenWeave),
// design sprint (Redantio), product design (KLU PAS)
const FEATURED_IDS = ["o5", "o0", "p1", "p3"];

export default function FeaturedWorks({ limit }) {
  const featured = FEATURED_IDS.map((id) => allWorks.find((w) => w.id === id)).filter(Boolean);
  const works = limit ? featured.slice(0, limit) : featured;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, scale: 0.85, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.8,
      },
    },
  };

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-100px" }}
      className="w-full"
    >
      <div className="py-16 sm:py-32 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
        <motion.div variants={itemAnim} className="mb-2 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f5f7] text-[#86868b] text-xs font-sans mb-4 uppercase tracking-wider font-medium border border-black/[0.04]">
            <Briefcase size={13} /> Portfolio
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.03em] mb-3 sm:mb-4">
            Works
          </h2>
          <p className="text-sm sm:text-base text-[#86868b] max-w-2xl leading-relaxed font-sans">
            Selected projects across generative AI, product design, and the web.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4 sm:gap-5">
          {works.map((work) => (
            <motion.div variants={itemAnim} key={work.id}>
              <Link href={`/works/${work.id}`} className="block group h-full">
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center p-6 sm:p-8 bg-white rounded-3xl border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all duration-200 h-full"
                >
                  <div className="flex flex-col flex-1 w-full">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl sm:text-2xl font-sans font-semibold text-[#1d1d1f] tracking-tight group-hover:text-black transition-colors">{work.title}</h3>
                      <ArrowUpRight size={17} className="text-[#86868b] group-hover:text-[#1d1d1f] transition-colors" />
                    </div>
                    <p className="text-[11px] font-sans font-medium text-[#86868b] uppercase tracking-wider mb-3 sm:mb-4">{work.tag}</p>
                    <p className="text-[#515154] text-sm sm:text-base max-w-2xl leading-relaxed font-sans">{work.description}</p>
                  </div>
                  {work.image && (
                    <div className="w-full sm:w-[38%] aspect-video relative rounded-2xl overflow-hidden shrink-0 border border-black/[0.06] bg-[#f5f5f7]">
                      <Image
                        src={work.image}
                        alt={work.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemAnim} className="mt-4 sm:mt-8 flex justify-center">
          <Link href="/works" className="px-6 py-2.5 bg-[#1d1d1f] text-white rounded-full text-xs sm:text-sm font-sans font-medium hover:bg-[#333336] transition-all shadow-sm">
            View All Works
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
