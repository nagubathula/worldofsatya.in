"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const greetings = [
  "Hello", "Hola", "Bonjour", "Ciao", "Namastey", 
  "Salaam", "Privet", "Nǐ hǎo", "Konnichiwa", "Anyoung", 
  "Hallo", "Olá", "Guten Tag", "Shalom", "Marhaba", 
  "Jambo", "Szia", "Ahoj", "Sveiki", "Hej", 
  "Hei", "Merhaba", "Salut", "Sawubona", "Yassou", 
  "Cześć", "Bok", "Dobrý den", "Aloha", "Welcome"
];

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // 30 words in ~1000ms = 33ms per word. Let's use 35ms to be safe.
    const interval = 35; 
    let currentIndex = 0;

    const timer = setInterval(() => {
      currentIndex++;
      if (currentIndex >= greetings.length) {
        clearInterval(timer);
        // Small pause on the final word before sliding up
        setTimeout(() => setIsLoading(false), 400); 
      } else {
        setIndex(currentIndex);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100vh", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] bg-[#111111] flex flex-col justify-between p-8 md:p-16 text-white"
        >
          <div className="overflow-hidden">
             <motion.div
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } }}
               exit={{ y: -50, opacity: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
               className="flex flex-col gap-1"
             >
               <span className="text-xs md:text-sm text-white/50 tracking-widest uppercase font-mono">Portfolio</span>
               <span className="text-lg md:text-2xl font-medium tracking-tight">Satya Sai Nagubathula</span>
             </motion.div>
          </div>
          
          <div className="flex justify-end overflow-hidden">
             <motion.h1 
               initial={{ y: 100 }}
               animate={{ y: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
               exit={{ y: -100, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
               className="text-[12vw] md:text-[8vw] leading-none font-semibold tracking-tighter"
             >
               {greetings[index]}
             </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
