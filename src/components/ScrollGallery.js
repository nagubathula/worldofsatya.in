"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const ScrollGallery = () => {
  const containerRef = useRef(null);


  const topGifs = [
    { id: 1, src: "/videos/1.gif", alt: "HVAC website" },
    { id: 2, src: "/videos/2.gif", alt: "Car service website" },
    { id: 3, src: "/videos/3.gif", alt: "Fashion website" },
    { id: 4, src: "/videos/4.gif", alt: "Credit card design" },
  ];

  const bottomGifs = [
    { id: 5, src: "/videos/5.gif", alt: "AI product website" },
    { id: 6, src: "/videos/6.gif", alt: "Banking app" },
    { id: 7, src: "/videos/7.gif", alt: "Creative agency website" },
    { id: 8, src: "/videos/8.gif", alt: "Mobile wallet app" },
  ];


  // Duplicate gifs for infinite effect
  const duplicatedTopGifs = [...topGifs, ...topGifs, ...topGifs];
  const duplicatedBottomGifs = [...bottomGifs, ...bottomGifs, ...bottomGifs];

  return (
    <div className="w-full py-16">
      {/* <div className="px-4 mb-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Our Portfolio</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Explore our digital creations
        </p>
      </div> */}

      {/* Top row - infinite scroll to left */}
      <div className="overflow-hidden relative mb-12">
        <motion.div 
          className="flex gap-6 w-max"
          animate={{ 
            x: [0, '-33.33%'],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 25,
            ease: "linear",
            repeatType: "loop"
          }}
        >
          {duplicatedTopGifs.map((gif, index) => (
            <div 
              key={`${gif.id}-${index}`} 
              className="relative w-64 h-48 rounded-lg overflow-hidden shadow-lg flex-shrink-0"
            >
              <img 
                src={gif.src} 
                alt={gif.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom row - infinite scroll to right */}
      {/* <div className="overflow-hidden relative">
        <motion.div 
          className="flex gap-6 w-max"
          animate={{ 
            x: ['-33.33%',0 ],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 25, 
            ease: "linear",
            repeatType: "loop"
          }}
        >
          {duplicatedBottomGifs.map((gif, index) => (
            <div 
              key={`${gif.id}-${index}`} 
              className="relative w-96 h-64 rounded-lg overflow-hidden shadow-lg flex-shrink-0"
            >
              <img 
                src={gif.src} 
                alt={gif.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div> */}
    </div>
  );
};

export default ScrollGallery;
