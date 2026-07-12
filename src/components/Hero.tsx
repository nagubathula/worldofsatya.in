"use client";

import { motion } from "framer-motion";
import { CassettePlayer } from "./CassettePlayer";

export function Hero() {
  return (
    <section className="min-h-screen pt-32 pb-16 px-8 md:px-[110px] flex flex-col lg:flex-row items-center justify-between max-w-[1920px] mx-auto w-full gap-8">
      
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-between h-auto lg:h-[600px] z-10 relative gap-12 lg:gap-0">
        <div className="space-y-1">
          <p className="text-[21px] text-[#5d5d5d] font-serif italic leading-snug">
            Press play on the right. <br/>
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
            This is, <span className="text-black italic">Krrish</span>.<br />
            <span className="text-[#636264]">A product designer</span><br />
            <span className="text-[#636264]">interested more in</span><br />
            <span className="text-[#636264]">people, not just tools.</span>
          </h1>
        </motion.div>
      </div>

      {/* Right Content - Cassette Player */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="flex-1 w-full max-w-xl lg:max-w-2xl flex justify-center lg:justify-end relative"
      >
        <CassettePlayer />
      </motion.div>

    </section>
  );
}
