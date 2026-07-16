"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="min-h-screen pt-32 pb-16 px-8 flex flex-col items-start justify-center max-w-3xl mx-auto w-full gap-8">
      
      {/* Content */}
      <div className="flex-1 flex flex-col justify-center h-auto z-10 relative gap-12">
        <div className="space-y-1">
          <p className="text-[21px] text-[#5d5d5d] font-serif italic leading-snug">
            Press play on the left. <br/>
            Pick a cassette below.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pb-12"
        >
          <h1 className="text-[36px] md:text-[52px] font-sans font-semibold tracking-tight text-[#636264] leading-[1.1]">
            This is, <span className="text-black italic">Satya Sai</span>.<br />
            <span className="text-[#636264]">A Product Engineer</span><br />
            <span className="text-[#636264]">& AI Prompt Engineer.</span><br />
            <span className="text-[#636264]">turning ideas into products.</span>
          </h1>
        </motion.div>
      </div>

    </section>
  );
}
