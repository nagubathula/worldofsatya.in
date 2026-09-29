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
      name: "CompatrIoT",
      role: "Hardware Security",
      description: "An open-source hardware security training platform built on dual STM32 + ESP32 microcontrollers — 20 gamified labs covering UART, JTAG/SWD, I2C, SPI, and BLE exploitation on real hardware.",
      link: "/works/o4",
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
            <Code size={13} /> Community
          </div>
          <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.03em] mb-3 sm:mb-4">
            Open Source
          </h2>
          <p className="text-base sm:text-lg text-[#86868b] max-w-2xl leading-relaxed font-sans">
            Giving back to the community through code, design, and education.
          </p>
        </motion.div>
        
        <div className="flex flex-col gap-4 sm:gap-5">
          {(limit ? projects.slice(0, limit) : projects).map((project, i) => {
            const CardContent = (
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] transition-all h-full"
              >
                {/* Clean Tag */}
                <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
                  <span className="text-[11px] font-sans text-[#86868b] tracking-wider uppercase font-medium">{project.role}</span>
                </div>

                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl sm:text-2xl font-sans font-semibold text-[#1d1d1f] tracking-tight group-hover:text-black transition-colors">{project.name}</h3>
                  {project.link && (
                    <ArrowUpRight size={18} className="text-[#86868b] group-hover:text-[#1d1d1f] transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </div>
                <p className="text-[#515154] text-sm sm:text-base leading-relaxed font-sans">{project.description}</p>
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
            <Link href="/open-source" className="px-6 py-2.5 bg-neutral-900 text-white rounded-full text-xs sm:text-sm font-sans font-medium hover:bg-neutral-800 transition-all shadow-sm">
              View More Open Source
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
