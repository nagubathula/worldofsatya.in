"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="min-h-screen py-32 px-8 md:px-12 w-full bg-[#f2f2f2]">
      
      <div className="flex flex-col gap-4 mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-serif text-black"
        >
          Something About Me
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-[#666666] font-sans"
        >
          A little bit of bragging can be done right?
        </motion.p>
      </div>

      <div className="flex flex-col gap-16 max-w-2xl">
        <div className="space-y-8">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif text-black leading-tight"
          >
            Engineering, Design <br/>
            <span className="text-2xl md:text-3xl">& AI Research.</span>
          </motion.h3>

          <div className="space-y-6 text-base text-black font-sans leading-relaxed">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              I'm a versatile Product Engineer with 5 years of experience turning innovative ideas into scalable products. My work bridges the gap between technology and creativity—I design intuitive systems, write clean code, and build solutions that solve real-world problems.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Alongside my engineering role, I'm a passionate Content Creator and Meme Strategist, using storytelling and humor to simplify complex tech and engage diverse audiences. I've helped scale channels to 100K+ and posted over 1000+ videos in a year.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              As an AI Prompt Engineer, I craft intelligent workflows and optimize language model interactions. I've developed tools like Content Nexus, WA-Guardian, and AutoEdit to enhance automation, content generation, and user experience.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Beyond coding, I've developed and shipped 14+ websites, led design for prominent platforms, won 14 hackathons, and constantly research Generative AI to push boundaries.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="pt-4 flex gap-4"
          >
            <a href="https://www.linkedin.com/in/satyasainagubathula/" target="_blank" rel="noopener noreferrer" className="inline-block text-base font-sans text-black border-b border-black pb-1 hover:opacity-70 transition-opacity">
              LinkedIn.
            </a>
            <a href="https://www.instagram.com/engineerudu" target="_blank" rel="noopener noreferrer" className="inline-block text-base font-sans text-black border-b border-black pb-1 hover:opacity-70 transition-opacity">
              Instagram.
            </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-[4/5] bg-gray-300 rounded-3xl overflow-hidden shadow-lg"
        >
          {/* Placeholder for the portrait if missing, otherwise image */}
          <div className="absolute inset-0 bg-neutral-200" />
        </motion.div>
      </div>
    </section>
  );
}
