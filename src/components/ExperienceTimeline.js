"use client";

import { motion } from "framer-motion";

export default function ExperienceTimeline() {
  const experiences = [
    {
      year: "05/2025 - Present",
      role: "Generative AI Engineer and Creative Lead",
      company: "NXTWAVE DISRUPTIVE TECHNOLOGIES",
      description: "Led AI production, scaling channels to 100K+ followers and orchestrating 2,000+ videos. Pioneered structured JSON automation for models like Veo 3 & Wan 2.2. Built internal tools slashing asset creation time by 90%.",
    },
    {
      year: "11/2024 - 03/2025",
      role: "Freelance",
      company: "CrestLogic Systems",
      description: "Branding, User Interface Design, and marketing funnel development for billjot.",
    },
    {
      year: "07/2024 - 10/2024",
      role: "Product Design Engineer (Consultant)",
      company: "Andhra Pradesh Solar Power Corporation",
      description: "UI Design, Web Design, and Fullstack Web development.",
    },
    {
      year: "08/2023 - 07/2024",
      role: "Product Engineer (Intern)",
      company: "Traboda Solutions",
      description: "UI Designer, Hardware Security Researcher, and Fullstack Web Development.",
    },
    {
      year: "01/2022 - 02/2023",
      role: "Design and Development Engineer (Intern)",
      company: "Redantio Solutions",
      description: "UI Designer, Figma Tutor, Graphic Design, Hardware Security Research and Web Development.",
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="text-xl font-medium text-black">Experience</h2>
          <p className="mt-4 text-sm text-black/60 max-w-xs leading-relaxed">
            A history of bridging design and engineering.
          </p>
        </div>
        
        <div className="md:col-span-8 flex flex-col">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group flex flex-col md:flex-row py-8 border-b border-black/5 last:border-0"
            >
              <div className="md:w-1/4 mb-4 md:mb-0">
                <span className="text-sm font-mono text-black/40">{exp.year}</span>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-medium text-black tracking-tight">{exp.role}</h3>
                <h4 className="text-base text-black/60 mb-4">{exp.company}</h4>
                <p className="text-black/70 text-base max-w-lg leading-relaxed">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
