"use client";

import Link from "next/link";
import { Code, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OpenSource({ limit }) {
  const projects = [
    {
      name: "OpenWeave",
      role: "Creator",
      description: "An open-source design editor that opens native Figma (.fig) and Pencil (.pen) files, with built-in AI that builds designs from chat, real-time P2P collaboration, and a headless React SDK for building custom editors.",
      link: "/works/o0",
    },
    {
      name: "Toothpaste",
      role: "Creator",
      description: "A plug-and-play Adobe CEP (Common Extensibility Platform) extension for Premiere Pro. Built to streamline workflows and provide an easy-to-use template for Adobe extension development.",
      link: "/works/o1",
    },
    {
      name: "CHAYA UI",
      role: "Core Contributor",
      description: "A modern, functional design system and component library for React built with Next.js and TailwindCSS. Collaborated directly with creators on design, development, and optimization. Authored several exclusive custom components.",
      link: "/works/o2",
    },
    {
      name: "Engineerudu",
      role: "FOSS Community Builder",
      description: "Building Andhra Pradesh's first Free and Open Source Community to foster local talent and collaborative development.",
      link: "/works/o3",
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
      <div className="py-16 sm:py-32 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
        <motion.div variants={itemAnim} className="mb-2 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 text-foreground/60 text-xs font-medium mb-4 uppercase tracking-widest">
            <Code size={14} /> Community
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold text-foreground tracking-tight mb-3 sm:mb-4">
            Open Source
          </h2>
          <p className="text-sm sm:text-lg text-foreground/60 max-w-2xl leading-relaxed">
            Giving back to the community through code, design, and education.
          </p>
        </motion.div>
        
        <div className="flex flex-col gap-4 sm:gap-6">
          {(limit ? projects.slice(0, limit) : projects).map((project, i) => {
            const CardContent = (
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                className="group flex flex-col justify-between p-5 sm:p-8 bg-background rounded-2xl sm:rounded-3xl border border-foreground/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 h-full"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">{project.name}</h3>
                  {project.link && (
                    <ArrowUpRight size={18} className="text-foreground/40 group-hover:text-foreground transition-colors" />
                  )}
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-3 sm:mb-4">{project.role}</p>
                <p className="text-foreground/70 text-sm sm:text-base max-w-2xl leading-relaxed">{project.description}</p>
              </motion.div>
            );

            const isExternal = project.link?.startsWith("http");

            return project.link ? (
              <motion.a
                variants={itemAnim}
                href={project.link}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                key={i}
                className="block"
              >
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
          <motion.div variants={itemAnim} className="mt-4 sm:mt-8 flex justify-center">
            <Link href="/open-source" className="px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors">
              View More Open Source
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
