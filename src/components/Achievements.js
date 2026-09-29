"use client";

import { Trophy, Star, Medal, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Achievements({ limit }) {
  const achievements = [
    {
      title: "GSOC 2024 Qualified",
      description: "Qualified for Google Summer of Code 2024.",
      icon: <Trophy className="w-4 h-4 text-neutral-700" />,
      link: "https://summerofcode.withgoogle.com/"
    },
    {
      title: "NASA Space Apps Awards",
      description: "Galactic Impact Award (2023) and Local Award for Local Impact (2022).",
      icon: <Trophy className="w-4 h-4 text-neutral-700" />,
      link: "https://www.spaceappschallenge.org/"
    },
    {
      title: "Hackathon Highlights",
      description: "Runner Up at Kavach Cyber Security Hackathon (2023). Top 5 at Nullcon Goa (2022).",
      icon: <Medal className="w-4 h-4 text-neutral-700" />
    },
    {
      title: "SIH 2022 Finalist",
      description: "National Finalist in Smart India Hackathon Hardware Edition.",
      icon: <Star className="w-4 h-4 text-neutral-700" />
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.35, ease: "easeOut" } 
    },
  };

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="w-full"
    >
      <div className="py-16 sm:py-24 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8 sm:gap-10" suppressHydrationWarning>
        <motion.div variants={itemAnim} className="mb-2 sm:mb-8" suppressHydrationWarning>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f5f7] text-[#86868b] text-xs font-sans mb-4 uppercase tracking-wider font-medium border border-black/[0.04]" suppressHydrationWarning>
            <Trophy size={13} /> Recognition
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.03em] mb-3 sm:mb-4">
            Achievements
          </h2>
          <p className="text-base sm:text-lg text-[#86868b] max-w-2xl leading-relaxed font-sans">
            Milestones and awards from my journey in design and development.
          </p>
        </motion.div>
        
        <div className="flex flex-col gap-4 sm:gap-5" suppressHydrationWarning>
          {(limit ? achievements.slice(0, limit) : achievements).map((item, i) => {
            const isLink = !!item.link;
            
            const CardContent = (
              <div
                suppressHydrationWarning
                className={`group flex flex-col p-6 sm:p-8 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all ${isLink ? 'cursor-pointer block' : ''}`}
              >
                <div className="flex justify-between items-start mb-3 sm:mb-4" suppressHydrationWarning>
                  <div suppressHydrationWarning className="p-2.5 rounded-full bg-[#f5f5f7] text-[#1d1d1f]">{item.icon}</div>
                  {isLink && (
                    <ArrowUpRight size={16} className="text-[#86868b] group-hover:text-[#1d1d1f] transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-sans font-semibold text-[#1d1d1f] tracking-tight mb-1.5 group-hover:text-black transition-colors">{item.title}</h3>
                <p className="text-[#515154] text-sm sm:text-base leading-relaxed font-sans">{item.description}</p>
              </div>
            );

            return isLink ? (
              <motion.a variants={itemAnim} href={item.link} target="_blank" rel="noopener noreferrer" key={i} className="block">
                {CardContent}
              </motion.a>
            ) : (
              <motion.div variants={itemAnim} key={i} suppressHydrationWarning>
                {CardContent}
              </motion.div>
            );
          })}
        </div>
        
        {limit && achievements.length > limit && (
          <motion.div variants={itemAnim} className="mt-4 sm:mt-8 flex justify-center" suppressHydrationWarning>
            <Link href="/achievements" className="px-6 py-2.5 bg-[#1d1d1f] text-white rounded-full text-xs sm:text-sm font-sans font-medium hover:bg-[#333336] transition-all shadow-sm">
              View More Achievements
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
