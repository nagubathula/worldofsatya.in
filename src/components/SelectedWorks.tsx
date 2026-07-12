"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "Designing India’s First Employee Advocacy Platform",
    role: "Design Lead • b2b • SaaS",
    image: "/images/NbU0l0KX6AVILpHZr98II19w.png", // Replace with real asset if available
    color: "bg-[#F3F4F6]",
    textColor: "text-black",
  },
  {
    id: 2,
    title: "Designing an Affordable IoT Companion for Everyday Plant Owners",
    role: "Product Designer • b2c • IoT + App",
    image: "/images/cf7Ykti8tN1i5SnENxbgv3AZhM.jpg", // Replace with real asset if available
    color: "bg-[#E5E7EB]",
    textColor: "text-black",
  },
  {
    id: 3,
    title: "Building a Multi-Feature Campus Platform Around a Dating Experience",
    role: "Founding Designer • b2c • Mobile App",
    image: "/images/qPo8UwbXYQLdfL9GWywM4qmZs.jpg", // Replace with real asset if available
    color: "bg-[#D1D5DB]",
    textColor: "text-black",
  },
  {
    id: 4,
    title: "Creating a Community-Driven Archive of Indian Maximalist Aesthetics",
    role: "Brand Identity • Web Design • Passion Project",
    image: "/images/OWAfbCEyptdBvl7S7klcSgsu5Q.jpeg", // Replace with real asset if available
    color: "bg-[#9CA3AF]",
    textColor: "text-white",
  },
  {
    id: 5,
    title: "Stealstickers.com - Coming Soon",
    role: "Side Project",
    image: "/images/OWAfbCEyptdBvl7S7klcSgsu5Q.jpeg", // Placeholder
    color: "bg-[#374151]",
    textColor: "text-white",
  }
];

export function SelectedWorks() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Calculate translation based on the number of cards
  // 5 cards = 4 gaps to scroll. We move x from 0% to -80% if there were 5 cards full width,
  // but let's just use window width.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75vw"]); // Approximate for 5 items

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#f2f2f2]" id="projects">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Section Title */}
        <div className="absolute top-12 md:top-24 left-8 md:left-[110px] z-10">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black font-sans">
            Selected Works
          </h2>
        </div>

        {/* Horizontal scroll container */}
        <motion.div style={{ x }} className="flex gap-16 px-8 md:px-[110px] mt-32">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="flex flex-col gap-6 shrink-0"
            >
              <div className="w-[85vw] md:w-[60vw] lg:w-[45vw] aspect-[4/3] rounded-3xl overflow-hidden relative shadow-md group">
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              
              <div className="flex flex-col gap-2 max-w-[85vw] md:max-w-[60vw] lg:max-w-[45vw]">
                <h3 className="text-xl md:text-2xl font-semibold font-sans leading-snug text-black">
                  {project.title}
                </h3>
                <p className="text-sm md:text-base font-normal font-sans text-gray-600">
                  {project.role}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
