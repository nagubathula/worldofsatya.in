"use client";


import { Trophy, Star, Medal, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Achievements({ limit }) {
  const achievements = [
    {
      title: "GSOC 2024 Qualified",
      description: "Qualified for Google Summer of Code 2024.",
      icon: <Trophy className="w-5 h-5 text-foreground/60" />,
      link: "https://summerofcode.withgoogle.com/"
    },
    {
      title: "NASA Space Apps Awards",
      description: "Galactic Impact Award (2023) and Local Award for Local Impact (2022).",
      icon: <Trophy className="w-5 h-5 text-foreground/60" />,
      link: "https://www.spaceappschallenge.org/"
    },
    {
      title: "Hackathon Highlights",
      description: "Runner Up at Kavach Cyber Security Hackathon (2023). Top 5 at Nullcon Goa (2022).",
      icon: <Medal className="w-5 h-5 text-foreground/60" />
    },
    {
      title: "SIH 2022 Finalist",
      description: "National Finalist in Smart India Hackathon Hardware Edition.",
      icon: <Star className="w-5 h-5 text-foreground/60" />
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
    hidden: { opacity: 0, scale: 0.85, y: 20 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25, 
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
      className="w-full border-t border-foreground/5"
    >
      <div className="py-16 sm:py-32 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8 sm:gap-10" suppressHydrationWarning>
        <motion.div variants={itemAnim} className="mb-2 sm:mb-10" suppressHydrationWarning>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 text-foreground/60 text-xs font-medium mb-4 uppercase tracking-widest" suppressHydrationWarning>
            <Trophy size={14} /> Recognition
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold text-foreground tracking-tight mb-3 sm:mb-4">
            Achievements
          </h2>
          <p className="text-sm sm:text-lg text-foreground/60 max-w-2xl leading-relaxed">
            Milestones and awards from my journey in design and development.
          </p>
        </motion.div>
        
        <div className="flex flex-col gap-4 sm:gap-6" suppressHydrationWarning>
          {(limit ? achievements.slice(0, limit) : achievements).map((item, i) => {
            const isLink = !!item.link;
            
            const CardContent = (
              <motion.div
                suppressHydrationWarning
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                className={`group flex flex-col p-5 sm:p-8 bg-background rounded-2xl sm:rounded-3xl border border-foreground/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 ${isLink ? 'cursor-pointer block' : ''}`}
              >
                <div className="flex justify-between items-start mb-3 sm:mb-4" suppressHydrationWarning>
                  <div suppressHydrationWarning>{item.icon}</div>
                  {isLink && (
                    <ArrowUpRight size={18} className="text-foreground/40 group-hover:text-foreground transition-colors" />
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight mb-1.5 sm:mb-2">{item.title}</h3>
                <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed font-medium">{item.description}</p>
              </motion.div>
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
            <Link href="/achievements" className="px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors">
              View More Achievements
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
