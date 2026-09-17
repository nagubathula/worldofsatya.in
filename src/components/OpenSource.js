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
      className="w-full"
    >
      <div className="py-16 sm:py-32 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
        <motion.div variants={itemAnim} className="mb-2 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#3e3832]/5 text-[#3e3832] text-xs font-pixel mb-4 uppercase tracking-widest border border-[#3e3832]/25 shadow-[1px_1px_0px_rgba(62,56,50,0.1)]">
            <Code size={14} /> Community
          </div>
          <h2 className="text-3xl sm:text-5xl font-editorial font-normal text-[#3e3832] tracking-tight mb-3 sm:mb-4">
            Open Source
          </h2>
          <p className="text-base sm:text-lg text-[#3e3832]/75 max-w-2xl leading-relaxed font-editorial">
            Giving back to the community through code, design, and education.
          </p>
        </motion.div>
        
        <div className="flex flex-col gap-4 sm:gap-6">
          {(limit ? projects.slice(0, limit) : projects).map((project, i) => {
            const CardContent = (
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                className="group flex flex-col justify-between p-6 sm:p-8 retro-card h-full"
              >
                {/* Clean Tag */}
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="text-xs font-pixel text-[#3e3832]/60 tracking-widest uppercase">{project.role}</span>
                </div>

                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl sm:text-2xl font-editorial font-normal text-[#3e3832] tracking-tight">{project.name}</h3>
                  {project.link && (
                    <ArrowUpRight size={18} className="text-[#3e3832]/50 group-hover:text-[#3e3832] transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </div>
                <p className="text-[#3e3832]/80 text-base max-w-2xl leading-relaxed font-editorial">{project.description}</p>
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
            <Link href="/open-source" className="px-6 py-3 bg-[#3e3832] text-[#f4ebd8] rounded-sm border-2 border-[#3e3832] text-xs font-pixel tracking-wider shadow-[3px_3px_0px_rgba(62,56,50,0.25)] hover:shadow-[4px_4px_0px_rgba(62,56,50,0.35)] active:translate-x-[2px] active:translate-y-[2px] hover:opacity-95 transition-all">
              View More Open Source
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
