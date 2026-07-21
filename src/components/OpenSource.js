"use client";

import { motion } from "framer-motion";

export default function OpenSource() {
  const projects = [
    {
      name: "CHAYA UI",
      role: "Core Contributor",
      description: "A modern, functional design system and component library for React built with Next.js and TailwindCSS. Collaborated directly with creators on design, development, and optimization. Authored several exclusive custom components.",
    },
    {
      name: "Engineerudu",
      role: "FOSS Community Builder",
      description: "Building Andhra Pradesh's first Free and Open Source Community to foster local talent and collaborative development.",
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="text-xl font-medium text-black">Open Source</h2>
          <p className="mt-4 text-sm text-black/60 max-w-xs leading-relaxed">
            Giving back to the community through code, design, and education.
          </p>
        </div>
        
        <div className="md:col-span-8 flex flex-col gap-12">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group"
            >
              <h3 className="text-2xl font-medium text-black tracking-tight mb-1">{project.name}</h3>
              <p className="text-sm font-mono text-black/40 mb-3">{project.role}</p>
              <p className="text-black/70 text-base max-w-lg leading-relaxed">{project.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
