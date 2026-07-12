"use client";

import { motion } from "framer-motion";

export function Archive() {
  return (
    <section id="archive" className="min-h-screen py-32 px-8 md:px-[110px] w-full flex flex-col justify-center">
      <div className="max-w-4xl space-y-12">
        <motion.h4 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xl md:text-2xl text-gray-500 font-serif italic max-w-sm"
        >
          Beyond product work, I make things just because they're beautiful.
        </motion.h4>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-5xl font-semibold tracking-tight text-[#131415] leading-tight"
        >
          I have spent a significant amount of time creating identities — posters, brands, and visual experiences
        </motion.h1>

        <div className="pt-24 space-y-6">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-2xl md:text-3xl text-black font-normal"
          >
            Built things. Led people. Showed up.
          </motion.h4>

          <motion.a 
            href="#"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="inline-block text-base font-sans text-black border-b border-black pb-1 hover:opacity-70 transition-opacity"
          >
            View Resume
          </motion.a>
        </div>
      </div>
    </section>
  );
}
