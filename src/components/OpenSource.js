"use client";

import Link from "next/link";
import { Code, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OpenSource({ limit }) {
  const projects = [
    {
      name: "Toothpaste",
      role: "Creator",
      description: "A plug-and-play Adobe CEP (Common Extensibility Platform) extension for Premiere Pro. Built to streamline workflows and provide an easy-to-use template for Adobe extension development.",
      link: "https://github.com/nagubathula/toothpaste",
    },
    {
      name: "CHAYA UI",
      role: "Core Contributor",
      description: "A modern, functional design system and component library for React built with Next.js and TailwindCSS. Collaborated directly with creators on design, development, and optimization. Authored several exclusive custom components.",
      link: "https://github.com/traboda/chaya",
    },
    {
      name: "Engineerudu",
      role: "FOSS Community Builder",
      description: "Building Andhra Pradesh's first Free and Open Source Community to foster local talent and collaborative development.",
      link: "https://engineerudu.com",
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.4, bounce: 0 } },
  };

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5"
    >
      <div className="flex flex-col gap-10">
        <motion.div variants={itemAnim} className="mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-black/60 text-xs font-medium mb-4 uppercase tracking-widest">
            <Code size={14} /> Community
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-black tracking-tight mb-4">
            Open Source
          </h2>
          <p className="text-base md:text-lg text-black/60 max-w-2xl leading-relaxed">
            Giving back to the community through code, design, and education.
          </p>
        </motion.div>
        
        <div className="flex flex-col gap-6">
          {(limit ? projects.slice(0, limit) : projects).map((project, i) => {
            const CardContent = (
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                className="group flex flex-col justify-between p-6 sm:p-8 bg-white rounded-3xl border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 h-full"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-2xl font-semibold text-black tracking-tight">{project.name}</h3>
                  {project.link && (
                    <ArrowUpRight size={20} className="text-black/40 group-hover:text-black transition-colors" />
                  )}
                </div>
                <p className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-4">{project.role}</p>
                <p className="text-black/70 text-base max-w-2xl leading-relaxed">{project.description}</p>
              </motion.div>
            );

            return project.link ? (
              <motion.a variants={itemAnim} href={project.link} target="_blank" rel="noopener noreferrer" key={i} className="block">
                {CardContent}
              </motion.a>
            ) : (
              <motion.div variants={itemAnim} key={i}>
                {CardContent}
              </motion.div>
            );
          })}
        </div>
        
        {limit && projects.length > limit && (
          <motion.div variants={itemAnim} className="mt-8 flex justify-center">
            <Link href="/open-source" className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors">
              View More Open Source
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
