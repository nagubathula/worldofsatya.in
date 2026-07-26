"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";

export default function TiltCard({ children, className = "", tiltIntensity = 10 }) {
  const ref = useRef(null);

  // Mouse position relative to center of the card, mapped from -0.5 to 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Add spring physics for smooth, elastic return to 0
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 40 });

  // Map mouse positions to rotation angles
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${tiltIntensity}deg`, `-${tiltIntensity}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${tiltIntensity}deg`, `${tiltIntensity}deg`]);

  // Map mouse position to glare position
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);
  const glareOpacity = useTransform(
    mouseXSpring,
    [-0.5, 0, 0.5],
    [0.15, 0, 0.15]
  );
  
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.8), transparent 60%)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate normalized mouse position relative to center (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative w-full h-full perspective-[1000px] ${className}`}
    >
      {/* Content wrapper with perspective translation to push it off the backplate */}
      <div 
        className="w-full h-full"
        style={{ transform: "translateZ(30px)" }}
      >
        {children}
      </div>

      {/* Glare effect overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-50 rounded-[inherit]"
        style={{
          background: glareBackground,
          opacity: glareOpacity,
          mixBlendMode: "overlay"
        }}
      />
    </motion.div>
  );
}
