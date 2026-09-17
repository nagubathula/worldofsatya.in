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
        staggerChildren: 0.15,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, scale: 0.85, y: 40, filter: "blur(10px)" },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        stiffness: 350, 
        damping: 22, 
        mass: 0.8 
      } 
    },
  };

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full"
    >
      <div className="py-16 sm:py-32 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
        <motion.div variants={itemAnim} className="mb-2 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#3e3832]/5 text-[#3e3832] text-xs font-pixel mb-4 uppercase tracking-widest border border-[#3e3832]/25 shadow-[1px_1px_0px_rgba(62,56,50,0.1)]">
            <BookOpen size={14} /> Writing
          </div>
          <h2 className="text-3xl sm:text-5xl font-editorial font-normal text-[#3e3832] tracking-tight mb-3 sm:mb-4">
            Case Studies
          </h2>
          <p className="text-base sm:text-lg text-[#3e3832]/75 max-w-2xl leading-relaxed font-editorial">
            Technical breakdowns, engineering experiments, and thoughts on the future of generative UI.
          </p>
        </motion.div>
        
        <div className="flex flex-col gap-4 sm:gap-6">
          {(limit ? studies.slice(0, limit) : studies).map((study, i) => {
            const isLink = study.link !== "#";
            
            const CardContent = (
              <motion.div
                whileHover={isLink ? { scale: 1.01 } : {}}
                transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                className={`group block retro-card p-6 sm:p-8 ${isLink ? 'cursor-pointer' : ''} relative overflow-hidden h-full`}
              >
                {/* Clean Tag */}
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="text-xs font-pixel text-[#3e3832]/60 tracking-widest uppercase">{study.type}</span>
                </div>

                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-editorial font-normal text-[#3e3832] tracking-tight mb-2 sm:mb-3">
                      {study.title}
                    </h3>
                    <p className="text-[#3e3832]/80 text-base max-w-2xl leading-relaxed font-editorial">{study.description}</p>
                  </div>
                  {isLink && (
                    <div className="mt-4 sm:mt-6 flex justify-end">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm bg-[#3e3832]/5 border border-[#3e3832]/20 flex items-center justify-center group-hover:bg-[#3e3832] group-hover:text-[#f4ebd8] transition-colors duration-200 shadow-[1px_1px_0px_rgba(62,56,50,0.1)]">
                        <ArrowUpRight size={16} className="text-[#3e3832]/70 group-hover:text-[#f4ebd8] transition-colors" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );

            return isLink ? (
              <motion.a variants={itemAnim} href={study.link} target="_blank" rel="noopener noreferrer" key={i} className="block">
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
            <Link href="/case-studies" className="px-6 py-3 bg-[#3e3832] text-[#f4ebd8] rounded-sm border-2 border-[#3e3832] text-xs font-pixel tracking-wider shadow-[3px_3px_0px_rgba(62,56,50,0.25)] hover:shadow-[4px_4px_0px_rgba(62,56,50,0.35)] active:translate-x-[2px] active:translate-y-[2px] transition-all">
              View More Case Studies
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
