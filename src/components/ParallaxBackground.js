"use client";

import { useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import useWeatherTheme, { THEMES } from "@/hooks/useWeatherTheme";

const themeConfigs = {
  [THEMES.DAY_CLEAR]: {
    background: "linear-gradient(to bottom, #87CEEB, #e0f7fa)",
    cloudsOpacity: 0.3,
    cloudsBrightness: 1,
    isDark: false,
  },
  [THEMES.DAY_CLOUDY]: {
    background: "linear-gradient(to bottom, #76b5c5, #e0f7fa)",
    cloudsOpacity: 0.8,
    cloudsBrightness: 0.9,
    isDark: false,
  },
  [THEMES.SUNSET]: {
    background: "linear-gradient(to bottom, #ff7e5f, #feb47b)",
    cloudsOpacity: 0.6,
    cloudsBrightness: 0.7,
    isDark: false, // Could be true if we want dark text, but sunset usually looks good with black text
  },
  [THEMES.NIGHT_CLEAR]: {
    background: "linear-gradient(to bottom, #0b1a30, #1a365d)",
    cloudsOpacity: 0.15,
    cloudsBrightness: 0.2,
    isDark: true,
  },
  [THEMES.NIGHT_CLOUDY]: {
    background: "linear-gradient(to bottom, #111827, #374151)",
    cloudsOpacity: 0.5,
    cloudsBrightness: 0.3,
    isDark: true,
  },
  [THEMES.RAIN]: {
    background: "linear-gradient(to bottom, #4b5563, #9ca3af)",
    cloudsOpacity: 1.0,
    cloudsBrightness: 0.5,
    isDark: true, // Rain theme is dark
  },
};

export default function ParallaxBackground() {
  const { scrollYProgress } = useScroll();
  const { theme } = useWeatherTheme();
  
  const themeConfig = themeConfigs[theme] || themeConfigs[THEMES.DAY_CLOUDY];
  
  // Toggle dark mode class on root for text colors
  useEffect(() => {
    if (themeConfig.isDark) {
      document.documentElement.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
    }
  }, [themeConfig.isDark]);
  
  // Create different parallax speeds for different layers of clouds
  const yFast = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const yMedium = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const ySlow = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <>
      {/* Base Sky Color */}
      <motion.div 
        className="fixed inset-0 -z-30"
        initial={{ background: themeConfigs[THEMES.DAY_CLOUDY].background }}
        animate={{ background: themeConfig.background }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      
      {/* Background Clouds (Slow) */}
      <motion.div 
        style={{ y: ySlow }}
        className="fixed top-0 left-0 right-0 h-[120vh] -z-20 pointer-events-none overflow-hidden w-full max-w-full"
        initial={{ opacity: 0.4, filter: "brightness(0.9)" }}
        animate={{ 
          opacity: 0.4 * themeConfig.cloudsOpacity,
          filter: `brightness(${themeConfig.cloudsBrightness})` 
        }}
        transition={{ duration: 2 }}
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
        className="fixed top-0 left-0 right-0 h-[140vh] -z-15 pointer-events-none overflow-hidden w-full max-w-full"
        initial={{ opacity: 0.6, filter: "brightness(0.9)" }}
        animate={{ 
          opacity: 0.6 * themeConfig.cloudsOpacity,
          filter: `brightness(${themeConfig.cloudsBrightness})` 
        }}
        transition={{ duration: 2 }}
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
        className="fixed top-0 left-0 right-0 h-[160vh] -z-10 pointer-events-none drop-shadow-xl overflow-hidden w-full max-w-full"
        initial={{ opacity: 0.3, filter: "brightness(0.9)" }}
        animate={{ 
          opacity: 0.3 * themeConfig.cloudsOpacity,
          filter: `brightness(${themeConfig.cloudsBrightness})` 
        }}
        transition={{ duration: 2 }}
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
        className="fixed top-0 left-0 right-0 h-[160vh] -z-5 pointer-events-none overflow-hidden w-full max-w-full"
        initial={{ opacity: 0.7, filter: "brightness(0.9)" }}
        animate={{ 
          opacity: 0.7 * themeConfig.cloudsOpacity,
          filter: `brightness(${themeConfig.cloudsBrightness})` 
        }}
        transition={{ duration: 2 }}
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
      <motion.div 
        className="fixed inset-0 -z-5 pointer-events-none"
        initial={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.5), rgba(255,255,255,0.9))" }}
        animate={{ 
          background: theme === THEMES.NIGHT_CLEAR || theme === THEMES.NIGHT_CLOUDY 
            ? "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5), rgba(0,0,0,0.8))"
            : theme === THEMES.RAIN
            ? "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.6))"
            : "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.5), rgba(255,255,255,0.9))"
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
    </>
  );
}
