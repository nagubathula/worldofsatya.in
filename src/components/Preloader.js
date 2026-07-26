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
  const [showFinalIntro, setShowFinalIntro] = useState(false);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col justify-center items-center text-white overflow-hidden"
        >
          {/* Background Video */}
          <video
            autoPlay
            playsInline
            onTimeUpdate={(e) => {
              if (e.target.duration && e.target.duration - e.target.currentTime <= 1.0) {
                setShowFinalIntro(true);
              }
            }}
            onEnded={() => setIsLoading(false)}
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
            src="/videos/intro.mp4"
          />

          <AnimatePresence>
            {showFinalIntro && (
              <motion.div
                key="final-intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3 } }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col justify-center items-center z-10"
              >
                {/* Physical Clouds for Fly-Through Effect */}
                <motion.img 
                  src="/images/cloud.png"
                  alt=""
                  initial={{ scale: 1, x: "-50%", y: "-50%", opacity: 0.6 }}
                  exit={{ scale: 10, opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                  className="absolute top-1/4 left-1/4 w-[150vw] md:w-[60vw] max-w-[1200px] pointer-events-none drop-shadow-2xl object-contain"
                />
                
                <motion.img 
                  src="/images/cloud.png"
                  alt=""
                  initial={{ scale: 1.5, x: "-50%", y: "-50%", opacity: 0.8 }}
                  exit={{ scale: 15, opacity: 0, transition: { duration: 0.9, ease: "easeInOut", delay: 0.05 } }}
                  className="absolute top-[70%] left-[80%] w-[200vw] md:w-[80vw] max-w-[1600px] pointer-events-none drop-shadow-2xl object-contain z-10"
                />

                <motion.img 
                  src="/images/cloud.png"
                  alt=""
                  initial={{ scale: 0.8, x: "-50%", y: "-50%", opacity: 0.4 }}
                  exit={{ scale: 6, opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
                  className="absolute top-[80%] left-[20%] w-[100vw] md:w-[40vw] max-w-[800px] pointer-events-none object-contain"
                />

                {/* Subtle dark overlay */}
                <div className="absolute inset-0 bg-black/10 z-0"></div>

                <div className="relative z-20 flex flex-col items-center justify-center w-full px-4">
                  <motion.h1 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1, transition: { type: "spring", duration: 0.8 } }}
                    exit={{ opacity: 0, scale: 1.5, transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    className="text-[15vw] md:text-[10vw] leading-none font-bold tracking-tighter text-center drop-shadow-2xl"
                  >
                    Welcome
                  </motion.h1>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
