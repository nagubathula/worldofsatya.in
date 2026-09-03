"use client";

import { useEffect, useRef, useState } from "react";
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
  [THEMES.DAWN]: {
    background: "linear-gradient(to bottom, #9d8bb0, #f6c9ae)",
    cloudsOpacity: 0.55,
    cloudsBrightness: 0.85,
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
  [THEMES.SNOW]: {
    background: "linear-gradient(to bottom, #a9b6c2, #edf1f4)",
    cloudsOpacity: 0.9,
    cloudsBrightness: 0.95,
    isDark: false,
  },
};

const themeEmojis = {
  [THEMES.DAY_CLEAR]: "☀️",
  [THEMES.DAY_CLOUDY]: "⛅",
  [THEMES.DAWN]: "🌄",
  [THEMES.SUNSET]: "🌅",
  [THEMES.NIGHT_CLEAR]: "🌙",
  [THEMES.NIGHT_CLOUDY]: "☁️",
  [THEMES.RAIN]: "🌧️",
  [THEMES.SNOW]: "❄️",
};

const themeLabels = {
  [THEMES.DAY_CLEAR]: "Clear day",
  [THEMES.DAY_CLOUDY]: "Cloudy day",
  [THEMES.DAWN]: "Dawn",
  [THEMES.SUNSET]: "Sunset",
  [THEMES.NIGHT_CLEAR]: "Clear night",
  [THEMES.NIGHT_CLOUDY]: "Cloudy night",
  [THEMES.RAIN]: "Rain",
  [THEMES.SNOW]: "Snow",
};

const cycleOrder = [
  THEMES.DAY_CLEAR,
  THEMES.DAY_CLOUDY,
  THEMES.DAWN,
  THEMES.SUNSET,
  THEMES.RAIN,
  THEMES.SNOW,
  THEMES.NIGHT_CLOUDY,
  THEMES.NIGHT_CLEAR,
];

// Deterministic pseudo-random particle fields (stable across renders, no hydration drift)
const STARS = Array.from({ length: 70 }, (_, i) => ({
  left: (i * 37.3) % 100,
  top: (i * 23.7) % 62,
  size: 1 + ((i * 7) % 3),
  delay: ((i * 13) % 40) / 10,
  duration: 2.2 + ((i * 11) % 28) / 10,
}));

const RAIN_DROPS = Array.from({ length: 70 }, (_, i) => ({
  left: (i * 41.7) % 100,
  delay: ((i * 17) % 90) / 100,
  duration: 0.8 + ((i * 13) % 45) / 100,
  opacity: 0.25 + ((i * 7) % 30) / 100,
}));

const SNOW_FLAKES = Array.from({ length: 55 }, (_, i) => ({
  left: (i * 47.9) % 100,
  size: 3 + ((i * 5) % 5),
  delay: ((i * 29) % 100) / 10,
  duration: 9 + ((i * 7) % 70) / 10,
  opacity: 0.4 + ((i * 11) % 50) / 100,
}));

export default function ParallaxBackground() {
  const { scrollYProgress } = useScroll();
  const { theme, city, condition, isStorm } = useWeatherTheme();

  // Sky preview: clicking the badge cycles themes; real sky returns after 20s idle
  const [override, setOverride] = useState(null);
  const revertTimer = useRef(null);
  const activeTheme = override ?? theme;

  const cycleSky = () => {
    setOverride((prev) => {
      const current = prev ?? theme;
      return cycleOrder[(cycleOrder.indexOf(current) + 1) % cycleOrder.length];
    });
    clearTimeout(revertTimer.current);
    revertTimer.current = setTimeout(() => setOverride(null), 20000);
  };

  useEffect(() => () => clearTimeout(revertTimer.current), []);

  const themeConfig = themeConfigs[activeTheme] || themeConfigs[THEMES.DAY_CLOUDY];

  const isNight = activeTheme === THEMES.NIGHT_CLEAR || activeTheme === THEMES.NIGHT_CLOUDY;
  const showRain = activeTheme === THEMES.RAIN;
  const showSnow = activeTheme === THEMES.SNOW;
  const showLightning = showRain && (isStorm || override === THEMES.RAIN);
  
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
      
      {/* Stars, moon & shooting star (night skies) */}
      {isNight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="fixed inset-0 -z-[25] pointer-events-none overflow-hidden"
        >
          {STARS.map((s, i) => (
            <span
              key={i}
              className="star"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
          {activeTheme === THEMES.NIGHT_CLEAR && (
            <>
              <div
                className="absolute top-[9%] right-[12%] w-14 h-14 sm:w-20 sm:h-20 rounded-full"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #f7f4e8, #d9d6c4 62%, rgba(217,214,196,0) 72%)",
                  boxShadow: "0 0 70px 24px rgba(247,244,232,0.18)",
                }}
              />
              <span className="shooting-star" style={{ top: "12%", right: "18%" }} />
            </>
          )}
        </motion.div>
      )}

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
          background: isNight
            ? "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5), rgba(0,0,0,0.8))"
            : showRain
            ? "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.6))"
            : "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.5), rgba(255,255,255,0.9))"
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Rain, lightning & snow — in front of the legibility fade, behind content */}
      {showRain && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="fixed inset-0 -z-[3] pointer-events-none overflow-hidden"
        >
          {RAIN_DROPS.map((d, i) => (
            <span
              key={i}
              className="rain-drop"
              style={{
                left: `${d.left}%`,
                opacity: d.opacity,
                animationDelay: `${d.delay}s`,
                animationDuration: `${d.duration}s`,
              }}
            />
          ))}
        </motion.div>
      )}
      {showLightning && (
        <div className="lightning fixed inset-0 -z-[3] pointer-events-none bg-white" />
      )}
      {showSnow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="fixed inset-0 -z-[3] pointer-events-none overflow-hidden"
        >
          {SNOW_FLAKES.map((f, i) => (
            <span
              key={i}
              className="snow-flake"
              style={{
                left: `${f.left}%`,
                width: f.size,
                height: f.size,
                opacity: f.opacity,
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.duration}s`,
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Live weather badge — proves the sky is real, and cycles preview skies on click */}
      {condition && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="fixed top-3 right-3 sm:top-4 sm:right-4 z-40"
          title={
            override
              ? "Previewing a sky — click to cycle. Your real sky returns shortly."
              : "Not a random gradient — this site's sky mirrors your local weather and time of day, live. Click to try the other skies."
          }
        >
          <button
            type="button"
            onClick={cycleSky}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-md border border-foreground/10 shadow-sm font-mono text-[10px] sm:text-xs text-foreground/60 cursor-pointer select-none transition-colors duration-300 hover:bg-background/80 hover:text-foreground/80"
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${override ? "bg-amber-500" : "bg-emerald-500"}`}></span>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${override ? "bg-amber-500" : "bg-emerald-500"}`}></span>
            </span>
            <span suppressHydrationWarning className="whitespace-nowrap">
              {override
                ? `${themeEmojis[activeTheme]} ${themeLabels[activeTheme]} — previewing`
                : `${themeEmojis[activeTheme]} ${condition}${city ? ` in ${city}` : ""} — this sky is yours, live`}
            </span>
            <span className="max-w-0 opacity-0 group-hover:max-w-[340px] group-hover:opacity-100 overflow-hidden whitespace-nowrap transition-all duration-500 ease-out">
              {override ? "· click for the next sky" : "· not a gradient — click to try other skies"}
            </span>
          </button>
        </motion.div>
      )}
    </>
  );
}
