"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import MagneticElement from "@/components/MagneticElement";
import TextReveal from "@/components/TextReveal";
import dynamic from 'next/dynamic';

const CassettePlayer = dynamic(() => import('@/components/CassettePlayer').then((mod) => mod.CassettePlayer));

export default function HeroSection() {
  // Parallax setup
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 150]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 2.2, // Wait for preloader
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", duration: 0.4, bounce: 0 } },
  };

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col lg:flex-row items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto w-full pt-24 pb-12 gap-12 lg:gap-8 min-h-[90vh]"
    >
      <div className="flex-1 w-full lg:w-1/2 flex flex-col justify-center">
        <TextReveal delay={2.2}>
          <div className="mb-8">
            <p className="text-sm md:text-base font-medium text-black/60">
              I am <span className="font-bold"> Satya Sai Nagubathula </span>, currently
            </p>
          </div>
        </TextReveal>

        <TextReveal delay={2.3}>
          <h1 className="text-[12vw] sm:text-7xl lg:text-7xl xl:text-[90px] font-medium leading-[0.9] tracking-[-0.04em] max-w-5xl text-black">
            The AI/UI Guy.
          </h1>
        </TextReveal>
        
        <TextReveal delay={2.4}>
          <div className="mt-8">
            <p className="text-sm md:text-base font-medium text-black/60">
              at <span className="font-bold"> NXTWAVE DISRUPTIVE TECHNOLOGIES </span>
            </p>
          </div>
        </TextReveal>
        
        <motion.div variants={item} className="mt-10 max-w-2xl">
          <p className="text-lg sm:text-xl text-black/70 leading-relaxed font-normal">
            I bridge the gap between creative visual direction and deep technical automation. Currently architecting multi-modal AI video pipelines and building tools that scale digital content production by 90%.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 sm:gap-6 items-center">
            <MagneticElement>
              <a href="/files/Resume.pdf" target="_blank" rel="noopener noreferrer" className="block text-sm font-medium bg-black text-white px-5 py-2.5 rounded-full hover:bg-black/80 transition-colors shadow-sm shadow-black/10">Resume</a>
            </MagneticElement>
            <MagneticElement>
              <a href="mailto:nagubathula.satyasai@gmail.com" className="block text-sm font-medium px-5 py-2.5 rounded-full border border-black/10 hover:border-black/30 hover:bg-black/5 transition-colors">Email</a>
            </MagneticElement>
            <MagneticElement>
              <a href="https://www.linkedin.com/in/satyasainagubathula" target="_blank" rel="noopener noreferrer" className="block text-sm font-medium px-5 py-2.5 rounded-full border border-black/10 hover:border-black/30 hover:bg-black/5 transition-colors">LinkedIn</a>
            </MagneticElement>
            <MagneticElement>
              <a href="https://hippogriff.medium.com" target="_blank" rel="noopener noreferrer" className="block text-sm font-medium px-5 py-2.5 rounded-full border border-black/10 hover:border-black/30 hover:bg-black/5 transition-colors">Medium</a>
            </MagneticElement>
          </div>
        </motion.div>
      </div>

      <motion.div 
        variants={item} 
        style={{ y: yParallax }}
        className="flex-1 w-full lg:w-1/2 flex justify-center lg:justify-end mt-12 lg:mt-0"
      >
        <CassettePlayer />
      </motion.div>
    </motion.section>
  );
}
