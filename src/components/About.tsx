"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="min-h-screen py-32 px-8 md:px-[110px] w-full bg-[#f2f2f2]">
      
      <div className="flex flex-col gap-4 mb-24">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-[52px] font-serif text-black"
        >
          Something About Me
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl text-[#666666] font-sans"
        >
          A little bit of bragging can be done right?
        </motion.p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
        <div className="flex-1 space-y-12 max-w-xl">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif text-black leading-tight"
          >
            Music, Cinema <br/>
            <span className="text-[48px]">& Psychology.</span>
          </motion.h3>

          <div className="space-y-6 text-base md:text-lg text-black font-sans leading-relaxed">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Is where my rabbit holes lead all day long. When my brain stops working, I always reach for a Chai ( it never really helps, but I keep trying. 😭)
            </motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Inspired by people like Pranav Mistry.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              I grew up loving the design era of the PS2, iPod, BlackBerry, flip phones, and Walkmans—objects that had soul baked into them. They felt like a reason to live, rather than just a tool for surviving.
            </motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              Born in Mumbai, the city that never sleeps, I found my inspiration from it. Thankfully, the beaches and the beautiful grit of the local hustlers always keep me grounded.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="pt-8"
          >
            <a href="#" className="inline-block text-base font-sans text-black border-b border-black pb-1 hover:opacity-70 transition-opacity">
              LinkedIn.
            </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 relative w-full aspect-[4/5] max-w-md bg-gray-300 rounded-3xl overflow-hidden"
        >
          {/* Placeholder for the portrait if missing, otherwise image */}
          <div className="absolute inset-0 bg-neutral-200" />
        </motion.div>
      </div>
    </section>
  );
}
