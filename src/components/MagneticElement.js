"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticElement({ children, className }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Calculate pull strength and 3D tilt for elastic distortion
    setPosition({ 
      x: middleX * 0.4, 
      y: middleY * 0.4,
      rotateX: -(middleY * 0.15), // Tilt based on vertical pull
      rotateY: middleX * 0.15 // Tilt based on horizontal pull
    });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  };

  const { x, y, rotateX, rotateY } = position;
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y, rotateX, rotateY, z: 10 }}
      // Snappier spring physics: higher stiffness, appropriate damping
      transition={{ type: "spring", stiffness: 400, damping: 25, mass: 0.5 }}
      style={{ transformStyle: "preserve-3d" }}
      className={className}
      data-magnetic="true"
    >
      {children}
    </motion.div>
  );
}
