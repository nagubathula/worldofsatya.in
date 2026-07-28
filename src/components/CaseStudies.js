"use client";

import { ArrowUpRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import TiltCard from "@/components/TiltCard";

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
      viewport={{ once: false, margin: "-100px" }}
      className="w-full border-t border-foreground/5"
    >
      <div className="py-16 sm:py-32 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
        <motion.div variants={itemAnim} className="mb-2 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 text-foreground/60 text-xs font-medium mb-4 uppercase tracking-widest">
            <BookOpen size={14} /> Writing
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold text-foreground tracking-tight mb-3 sm:mb-4">
            Case Studies
          </h2>
          <p className="text-sm sm:text-lg text-foreground/60 max-w-2xl leading-relaxed">
            Technical breakdowns, engineering experiments, and thoughts on the future of generative UI.
          </p>
        </motion.div>
        
        <div className="flex flex-col gap-4 sm:gap-6">
          {(limit ? studies.slice(0, limit) : studies).map((study, i) => {
            const isLink = study.link !== "#";
            
            const CardContent = (
              <TiltCard tiltIntensity={5}>
                <motion.div
                  whileHover={isLink ? { scale: 1.02 } : {}}
                  transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                  className={`group block bg-background rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-foreground/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${isLink ? 'hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] cursor-pointer' : ''} transition-all duration-300 relative overflow-hidden h-full`}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <p className="text-[11px] sm:text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-2 sm:mb-3">{study.type}</p>
                      <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-2 sm:mb-3">
                        {study.title}
                      </h3>
                      <p className="text-foreground/60 text-sm sm:text-base max-w-2xl leading-relaxed">{study.description}</p>
                    </div>
                    {isLink && (
                      <div className="mt-4 sm:mt-6 flex justify-end">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground transition-colors duration-300">
                          <ArrowUpRight size={16} className="text-foreground/60 group-hover:text-background transition-colors" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </TiltCard>
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
            <Link href="/case-studies" className="px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors">
              View More Case Studies
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
