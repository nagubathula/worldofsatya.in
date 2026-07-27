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
        className="fixed top-0 left-0 right-0 h-[120vh] -z-20 opacity-40 pointer-events-none overflow-hidden w-full max-w-full"
      >
        <img 
          src="/images/cloud.png" 
          className="absolute top-[10%] w-[60vw] max-w-[800px] cloud-drifting-right" 
          style={{ animationDuration: '200s', animationDelay: '-40s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[40%] w-[50vw] max-w-[700px] cloud-drifting-left" 
          style={{ animationDuration: '240s', animationDelay: '-120s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[80%] w-[70vw] max-w-[900px] cloud-drifting-right" 
          style={{ animationDuration: '220s', animationDelay: '-160s' }}
          alt="" 
        />
        {/* Additional slow clouds */}
        <img 
          src="/images/cloud.png" 
          className="absolute top-[25%] w-[45vw] max-w-[600px] cloud-drifting-left" 
          style={{ animationDuration: '260s', animationDelay: '-80s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[65%] w-[55vw] max-w-[750px] cloud-drifting-right" 
          style={{ animationDuration: '230s', animationDelay: '-10s' }}
          alt="" 
        />
      </motion.div>

      {/* Midground Clouds (Medium) */}
      <motion.div 
        style={{ y: yMedium }}
        className="fixed top-0 left-0 right-0 h-[140vh] -z-15 opacity-60 pointer-events-none overflow-hidden w-full max-w-full"
      >
        <img 
          src="/images/cloud.png" 
          className="absolute top-[20%] w-[80vw] max-w-[1000px] cloud-drifting-left" 
          style={{ animationDuration: '160s', animationDelay: '-50s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[60%] w-[90vw] max-w-[1200px] cloud-drifting-right" 
          style={{ animationDuration: '180s', animationDelay: '-140s' }}
          alt="" 
        />
        {/* Additional medium clouds */}
        <img 
          src="/images/cloud.png" 
          className="absolute top-[5%] w-[65vw] max-w-[900px] cloud-drifting-right" 
          style={{ animationDuration: '170s', animationDelay: '-20s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[45%] w-[75vw] max-w-[1000px] cloud-drifting-left" 
          style={{ animationDuration: '190s', animationDelay: '-90s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[85%] w-[70vw] max-w-[950px] cloud-drifting-right" 
          style={{ animationDuration: '175s', animationDelay: '-110s' }}
          alt="" 
        />
      </motion.div>

      {/* Foreground Clouds (Fast) */}
      <motion.div 
        style={{ y: yFast }}
        className="fixed top-0 left-0 right-0 h-[160vh] -z-10 opacity-30 pointer-events-none drop-shadow-xl overflow-hidden w-full max-w-full"
      >
        <img 
          src="/images/cloud.png" 
          className="absolute top-[-5%] w-[120vw] max-w-[1500px] cloud-drifting-right" 
          style={{ animationDuration: '120s', animationDelay: '-90s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[70%] w-[100vw] max-w-[1300px] cloud-drifting-left" 
          style={{ animationDuration: '140s', animationDelay: '-30s' }}
          alt="" 
        />
        {/* Additional fast clouds */}
        <img 
          src="/images/cloud.png" 
          className="absolute top-[30%] w-[90vw] max-w-[1200px] cloud-drifting-right" 
          style={{ animationDuration: '130s', animationDelay: '-10s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[90%] w-[110vw] max-w-[1400px] cloud-drifting-left" 
          style={{ animationDuration: '135s', animationDelay: '-70s' }}
          alt="" 
        />
      </motion.div>
      
      {/* Small Drifting Clouds (Very Fast & immersive) */}
      <motion.div 
        style={{ y: yFast }}
        className="fixed top-0 left-0 right-0 h-[160vh] -z-5 opacity-70 pointer-events-none overflow-hidden w-full max-w-full"
      >
        <img 
          src="/images/cloud.png" 
          className="absolute top-[15%] w-[20vw] max-w-[300px] blur-[2px] cloud-drifting-right" 
          style={{ animationDuration: '90s', animationDelay: '-10s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[45%] w-[15vw] max-w-[200px] blur-[1px] cloud-drifting-left" 
          style={{ animationDuration: '100s', animationDelay: '-60s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[75%] w-[25vw] max-w-[350px] blur-[3px] cloud-drifting-right" 
          style={{ animationDuration: '110s', animationDelay: '-80s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[35%] w-[18vw] max-w-[250px] blur-[2px] cloud-drifting-right" 
          style={{ animationDuration: '85s', animationDelay: '-30s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[85%] w-[22vw] max-w-[320px] blur-[1px] cloud-drifting-left" 
          style={{ animationDuration: '95s', animationDelay: '-110s' }}
          alt="" 
        />
        {/* Additional small clouds */}
        <img 
          src="/images/cloud.png" 
          className="absolute top-[5%] w-[12vw] max-w-[180px] blur-[1px] cloud-drifting-left" 
          style={{ animationDuration: '80s', animationDelay: '-45s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[25%] w-[28vw] max-w-[380px] blur-[3px] cloud-drifting-right" 
          style={{ animationDuration: '105s', animationDelay: '-15s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[55%] w-[16vw] max-w-[220px] blur-[2px] cloud-drifting-left" 
          style={{ animationDuration: '92s', animationDelay: '-85s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[65%] w-[20vw] max-w-[280px] blur-[1px] cloud-drifting-right" 
          style={{ animationDuration: '88s', animationDelay: '-50s' }}
          alt="" 
        />
        <img 
          src="/images/cloud.png" 
          className="absolute top-[95%] w-[24vw] max-w-[340px] blur-[2px] cloud-drifting-left" 
          style={{ animationDuration: '98s', animationDelay: '-25s' }}
          alt="" 
        />
      </motion.div>
      
      {/* Subtle white fade over everything to ensure text remains perfectly legible */}
      <div className="fixed inset-0 -z-5 bg-gradient-to-b from-white/10 via-white/50 to-white/90 pointer-events-none"></div>
    </>
  );
}
