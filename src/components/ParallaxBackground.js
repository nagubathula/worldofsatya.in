"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxBackground() {
  const { scrollYProgress } = useScroll();
  
  // Create different parallax speeds for different layers of clouds
  const yFast = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const yMedium = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const ySlow = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <>
      {/* Base Sky Color */}
      <div className="fixed inset-0 -z-30 bg-gradient-to-b from-[#76b5c5] to-[#e0f7fa]"></div>
      
      {/* Background Clouds (Slow) */}
      <motion.div 
        style={{ y: ySlow }}
        className="fixed top-0 left-0 right-0 h-[120vh] -z-20 opacity-40 pointer-events-none"
      >
        <img src="/images/cloud.png" className="absolute top-[10%] left-[-10%] w-[60vw] max-w-[800px]" alt="" />
        <img src="/images/cloud.png" className="absolute top-[40%] right-[-5%] w-[50vw] max-w-[700px]" alt="" />
        <img src="/images/cloud.png" className="absolute top-[80%] left-[20%] w-[70vw] max-w-[900px]" alt="" />
      </motion.div>

      {/* Midground Clouds (Medium) */}
      <motion.div 
        style={{ y: yMedium }}
        className="fixed top-0 left-0 right-0 h-[140vh] -z-15 opacity-60 pointer-events-none"
      >
        <img src="/images/cloud.png" className="absolute top-[20%] right-[10%] w-[80vw] max-w-[1000px]" alt="" />
        <img src="/images/cloud.png" className="absolute top-[60%] left-[-20%] w-[90vw] max-w-[1200px]" alt="" />
      </motion.div>

      {/* Foreground Clouds (Fast) */}
      <motion.div 
        style={{ y: yFast }}
        className="fixed top-0 left-0 right-0 h-[160vh] -z-10 opacity-30 pointer-events-none drop-shadow-xl"
      >
        <img src="/images/cloud.png" className="absolute top-[-5%] left-[30%] w-[120vw] max-w-[1500px]" alt="" />
        <img src="/images/cloud.png" className="absolute top-[70%] right-[20%] w-[100vw] max-w-[1300px]" alt="" />
      </motion.div>
      
      {/* Subtle white fade over everything to ensure text remains perfectly legible */}
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-white/10 via-white/50 to-white/90 pointer-events-none"></div>
    </>
  );
}
