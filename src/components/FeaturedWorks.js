"use client";

import Link from "next/link";
import Image from "next/image";
import { Briefcase, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { allWorks } from "@/data/works";

// Flagship picks shown on the homepage — one for each target role:
// generative AI (OpenWeave), design sprint (Redantio), product design (KLU PAS)
const FEATURED_IDS = ["o0", "p1", "p3"];

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
      className="w-full border-t border-foreground/5"
    >
      <div className="py-16 sm:py-32 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
        <motion.div variants={itemAnim} className="mb-2 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 text-foreground/60 text-xs font-medium mb-4 uppercase tracking-widest">
            <Briefcase size={14} /> Portfolio
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold text-foreground tracking-tight mb-3 sm:mb-4">
            Works
          </h2>
          <p className="text-sm sm:text-lg text-foreground/60 max-w-2xl leading-relaxed">
            Selected projects across generative AI, product design, and the web.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4 sm:gap-6">
          {works.map((work) => (
            <motion.div variants={itemAnim} key={work.id}>
              <Link href={`/works/${work.id}`} className="block group h-full">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                  className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-center p-5 sm:p-8 bg-background rounded-2xl sm:rounded-3xl border border-foreground/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 h-full"
                >
                  <div className="flex flex-col flex-1 w-full">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">{work.title}</h3>
                      <ArrowUpRight size={18} className="text-foreground/40 group-hover:text-foreground transition-colors" />
                    </div>
                    <p className="text-[11px] sm:text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-3 sm:mb-4">{work.tag}</p>
                    <p className="text-foreground/70 text-sm sm:text-base max-w-2xl leading-relaxed">{work.description}</p>
                  </div>
                  {work.image && (
                    <div className="w-full sm:w-[38%] aspect-video relative rounded-xl overflow-hidden shrink-0 border border-foreground/[0.05]">
                      <Image
                        src={work.image}
                        alt={work.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemAnim} className="mt-4 sm:mt-8 flex justify-center">
          <Link href="/works" className="px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors">
            View All Works
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
