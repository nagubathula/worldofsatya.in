"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2 second preloader to allow fonts/images to load and build anticipation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100vh", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] bg-[#1a1a1a] flex flex-col items-center justify-center text-white"
        >
          <div className="overflow-hidden">
             <motion.h1 
               initial={{ y: 100 }}
               animate={{ y: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } }}
               exit={{ y: -100, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
               className="text-4xl md:text-6xl font-medium tracking-tight"
             >
               Satya Sai Nagubathula
             </motion.h1>
          </div>
          <div className="overflow-hidden mt-2">
             <motion.p 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.4 } }}
               exit={{ y: -50, opacity: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
               className="text-sm md:text-base text-white/50 tracking-[0.2em] uppercase font-mono"
             >
               Loading Experience
             </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
