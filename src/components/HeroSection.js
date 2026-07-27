"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import MagneticElement from "@/components/MagneticElement";
import TextReveal from "@/components/TextReveal";
import AnimatedButton from "@/components/AnimatedButton";
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
        delayChildren: 0.1,
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
      className="flex flex-col items-start justify-center px-4 sm:px-8 max-w-3xl mx-auto w-full pt-16 sm:pt-24 pb-12 gap-8 min-h-[85vh]"
    >
      <div className="w-full flex flex-col justify-center items-start text-left">
        <TextReveal delay={0.1}>
          <div className="mb-3 sm:mb-6">
            <p className="text-sm sm:text-base font-medium text-black/60">
              I am <span className="font-bold text-black"> Satya Sai Nagubathula </span>, currently
            </p>
          </div>
        </TextReveal>

        <TextReveal delay={0.2}>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold leading-[0.96] tracking-[-0.04em] text-black">
            The AI/UI Guy.
          </h1>
        </TextReveal>
        
        <TextReveal delay={0.3}>
          <div className="mt-3 sm:mt-6">
            <p className="text-sm sm:text-base font-medium text-black/60">
              at <span className="font-bold text-black"> NXTWAVE DISRUPTIVE TECHNOLOGIES </span>
            </p>
          </div>
        </TextReveal>
        
        <motion.div variants={item} className="mt-6 sm:mt-8 w-full">
          <p className="text-base sm:text-lg text-black/70 leading-relaxed font-normal">
            I bridge the gap between creative visual direction and deep technical automation. Currently architecting multi-modal AI video pipelines and building tools that scale digital content production by 90%.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-nowrap sm:flex-wrap items-center gap-2 sm:gap-4 overflow-x-auto max-w-full pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <AnimatedButton href="/files/Resume.pdf" isPrimary={true}>
              Resume
            </AnimatedButton>
            <AnimatedButton href="mailto:nagubathula.satyasai@gmail.com">
              Email
            </AnimatedButton>
            <AnimatedButton href="https://www.linkedin.com/in/satyasainagubathula">
              LinkedIn
            </AnimatedButton>
            <AnimatedButton href="https://hippogriff.medium.com">
              Medium
            </AnimatedButton>
          </div>
        </motion.div>
      </div>

      <motion.div 
        variants={item} 
        style={{ y: yParallax }}
        className="w-full flex justify-center mt-4 sm:mt-8"
      >
        <CassettePlayer />
      </motion.div>
    </motion.section>
  );
}
