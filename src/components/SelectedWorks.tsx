"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "Designing India’s First Employee Advocacy Platform",
    role: "Design Lead • b2b • SaaS",
    image: "/images/NbU0l0KX6AVILpHZr98II19w.png",
  },
  {
    id: 2,
    title: "Designing an Affordable IoT Companion for Everyday Plant Owners",
    role: "Product Designer • b2c • IoT + App",
    image: "/images/cf7Ykti8tN1i5SnENxbgv3AZhM.jpg",
  },
  {
    id: 3,
    title: "Building a Multi-Feature Campus Platform Around a Dating Experience",
    role: "Founding Designer • b2c • Mobile App",
    image: "/images/qPo8UwbXYQLdfL9GWywM4qmZs.jpg",
  },
  {
    id: 4,
    title: "Creating a Community-Driven Archive of Indian Maximalist Aesthetics",
    role: "Brand Identity • Web Design • Passion Project",
    image: "/images/OWAfbCEyptdBvl7S7klcSgsu5Q.jpeg",
  },
  {
    id: 5,
    title: "Stealstickers.com - Coming Soon",
    role: "Side Project",
    image: "/images/OWAfbCEyptdBvl7S7klcSgsu5Q.jpeg",
  }
];

export function SelectedWorks() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75vw"]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section ref={targetRef} className={`relative bg-[#f2f2f2] ${isMobile ? 'h-auto pb-32' : 'h-[400vh]'}`} id="projects">
      <div className={`flex flex-col ${isMobile ? '' : 'sticky top-0 h-screen items-center overflow-hidden'}`}>
        
        {/* Section Title */}
        <div className={`${isMobile ? 'pt-24 px-8 pb-12' : 'absolute top-24 left-[110px] z-10'}`}>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black font-sans">
            Selected Works
          </h2>
        </div>

        {/* Mobile layout (Vertical Stack) */}
        {isMobile && (
          <div className="flex flex-col gap-12 px-8">
            {projects.map((project) => (
              <div key={project.id} className="flex flex-col gap-4">
                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden relative shadow-md">
                  <Image src={project.image} alt={project.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold font-sans leading-snug text-black">
                    {project.title}
                  </h3>
                  <p className="text-sm font-normal font-sans text-gray-600">
                    {project.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop layout (Horizontal Scroll) */}
        {!isMobile && (
          <motion.div style={{ x }} className="flex gap-16 px-[110px] mt-32 w-max">
            {projects.map((project) => (
              <div key={project.id} className="flex flex-col gap-6 shrink-0 w-[45vw]">
                <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden relative shadow-md group">
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-semibold font-sans leading-snug text-black">
                    {project.title}
                  </h3>
                  <p className="text-base font-normal font-sans text-gray-600">
                    {project.role}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
