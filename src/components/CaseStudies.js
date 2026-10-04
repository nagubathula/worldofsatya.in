"use client";

import { ArrowUpRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CaseStudies({ limit }) {
  const studies = [
    {
      title: "From Doodles to Design",
      description: "My journey bridging creative visual direction and deep technical automation.",
      type: "Medium Article",
      link: "https://hippogriff.medium.com",
    },
    {
      title: "How I Built My Pseudo Fullstack Portfolio",
      description: "An in-depth breakdown of the design and development process for my portfolio website.",
      type: "Medium Article",
      link: "https://medium.com/@hippogriff/how-i-built-my-psuedo-fullstack-portfolio-73cd1f6aecda",
    },
    {
      title: "Zero-Cost Automation",
      description: "Building an internal productivity suite using Google Colab, Supabase, and lightweight web extensions.",
      type: "Architecture Breakdown",
      link: "/case-studies/zero-cost-automation",
    },
    {
      title: "Why Are You Still Confused When Turning Your Design To Code?",
      description: "A guide on bridging the gap between design and development, avoiding common handoff pitfalls.",
      type: "Medium Article",
      link: "https://medium.com/design-bootcamp/why-are-you-still-confusing-when-turning-your-design-to-code-a7489d544deb",
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
      <div className="py-16 sm:py-24 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
        <motion.div variants={itemAnim} className="mb-2 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f5f7] text-[#86868b] text-xs font-sans mb-4 uppercase tracking-wider font-medium border border-black/[0.04]">
            <BookOpen size={13} /> Writing
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.03em] mb-3 sm:mb-4">
            Case Studies
          </h2>
          <p className="text-base sm:text-lg text-[#86868b] max-w-2xl leading-relaxed font-sans">
            Technical breakdowns, engineering experiments, and thoughts on the future of generative UI.
          </p>
        </motion.div>
        
        <div className="flex flex-col gap-4 sm:gap-5">
          {(limit ? studies.slice(0, limit) : studies).map((study, i) => {
            const isLink = study.link !== "#";
            
            const CardContent = (
              <motion.div
                whileHover={isLink ? { y: -2 } : {}}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`group block p-6 sm:p-8 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all duration-500 ${isLink ? 'cursor-pointer' : ''} relative overflow-hidden h-full`}
              >
                {/* Clean Tag */}
                <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
                  <span className="text-[11px] font-sans text-[#86868b] tracking-wider uppercase font-medium">{study.type}</span>
                </div>

                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-sans font-semibold text-[#1d1d1f] tracking-tight mb-2 sm:mb-3 group-hover:text-black transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-[#515154] text-sm sm:text-base max-w-2xl leading-relaxed font-sans">{study.description}</p>
                  </div>
                  {isLink && (
                    <div className="mt-4 sm:mt-6 flex justify-end">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f5f5f7] flex items-center justify-center group-hover:bg-[#1d1d1f] group-hover:text-white transition-colors duration-200">
                        <ArrowUpRight size={15} className="text-[#1d1d1f] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );

            return isLink ? (
              <motion.a variants={itemAnim} href={study.link} target={study.link.startsWith("http") ? "_blank" : undefined} rel={study.link.startsWith("http") ? "noopener noreferrer" : undefined} key={i} className="block">
                {CardContent}
              </motion.a>
            ) : (
              <motion.div variants={itemAnim} key={i}>
                {CardContent}
              </motion.div>
            );
          })}
        </div>
        
        {limit && studies.length > limit && (
          <motion.div variants={itemAnim} className="mt-4 sm:mt-8 flex justify-center">
            <Link href="/case-studies" className="px-6 py-2.5 bg-neutral-900 text-white rounded-full text-xs sm:text-sm font-sans font-medium hover:bg-neutral-800 transition-all shadow-sm">
              View More Case Studies
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
