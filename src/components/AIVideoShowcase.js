"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AnimatedButton from "./AnimatedButton";
import { Video } from "lucide-react";
import { motion } from "framer-motion";

export default function AIVideoShowcase({ limit }) {
  const videos = [
    {
      src: "/aivideos/AI_ADVERTISEMENT.mp4",
      title: "STERIO HEADPHONES",
      description: "Generative AI commercial showcase.",
      isVertical: false,
    },
    {
      src: "/aivideos/HANGY.mp4",
      title: "HANGY",
      description: "AI Video generation experiment.",
      isVertical: false,
    },
    {
      src: "/aivideos/female_host_ai_generated.mp4",
      title: "AI Virtual Host",
      description: "Hyper-realistic virtual presenter generated with Gemini Omni.",
      isVertical: true,
    },
    {
      src: "/aivideos/niat_ugc.mp4",
      title: "NIAT UGC",
      description: "User-generated content style AI generation.",
      isVertical: true,
    },
    {
      src: "/aivideos/mustang_ai_realism.mp4",
      title: "Mustang AI Realism",
      description: "Photorealistic automotive generation.",
      isVertical: false,
    },
    {
      src: "/aivideos/A_hyper_realistic_extreme_hig (1).mp4",
      title: "Hyper-Realistic Detail",
      description: "Extreme detail latent space manipulation.",
      isVertical: false,
    },
    {
      src: "/aivideos/engineerudu_horizontal.mp4",
      title: "Engineerudu (Horizontal)",
      description: "Promotional AI video for FOSS community.",
      isVertical: false,
    },
    {
      src: "/aivideos/engineerudu_vertical.mp4",
      title: "Engineerudu (Vertical)",
      description: "Vertical format AI promotional content.",
      isVertical: true,
    }
  ];

  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [aspectRatios, setAspectRatios] = useState({});

  // Duplicate the video array for a seamless infinite scroll loop
  const duplicatedVideos = [...videos, ...videos];

  const handleLoadedMetadata = (index, e) => {
    const { videoWidth, videoHeight } = e.target;
    if (videoWidth && videoHeight) {
      const ratio = videoWidth / videoHeight;
      setAspectRatios(prev => ({ ...prev, [index]: ratio }));
    }
  };

  const handlePlay = (e) => {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(v => {
      if (v !== e.target && !v.paused) {
        v.pause();
      }
    });
  };

  useEffect(() => {
    if (isHovered) return;

    let animationFrameId;
    let currentScroll = scrollContainerRef.current?.scrollLeft || 0;

    const scroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        currentScroll += 0.8; // Smooth 0.8px per frame auto-scroll
        
        // Reset seamlessly when reaching half of the duplicated scroll track
        if (currentScroll >= container.scrollWidth / 2) {
          currentScroll = 0;
        }
        
        container.scrollLeft = currentScroll;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.4, bounce: 0 } },
  };

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full border-t border-black/5 py-16 sm:py-32"
    >
      <div className="px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col min-w-0">
        <motion.div variants={itemAnim} className="sticky top-20 sm:top-24 z-10 bg-transparent flex flex-col justify-start gap-4 w-full min-w-0">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-black/60 text-xs font-medium mb-4 uppercase tracking-widest backdrop-blur-md">
              <Video size={14} /> AI Experiments
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold text-black tracking-tight mb-2 sm:mb-4">
              Generative Video
            </h2>
            <p className="text-sm sm:text-lg text-black/60 max-w-2xl leading-relaxed break-words w-full">
              Showcasing advanced generative AI works, focusing on photorealism and dynamic visual storytelling.
            </p>
          </div>
        </motion.div>
      </div>
        
      <div 
        ref={scrollContainerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        style={{ 
          maskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)', 
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%)' 
        }}
        className="flex flex-row items-start overflow-x-auto gap-4 sm:gap-6 pb-6 pt-2 px-4 sm:px-8 w-full mt-8 sm:mt-12 max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {duplicatedVideos.map((video, i) => {
          const rawIdx = i % videos.length;
          
          return (
            <motion.div 
              variants={itemAnim}
              key={i} 
              className="flex flex-col group shrink-0 w-[80vw] sm:w-auto"
            >
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black/5 mb-3 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex justify-center items-center w-full sm:w-auto h-[260px] sm:h-[320px] lg:h-[340px]">
                <video 
                  src={`${video.src}#t=0.001`} 
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={(e) => handleLoadedMetadata(rawIdx, e)}
                  onPlay={handlePlay}
                  className="w-full sm:w-auto h-full object-cover sm:object-contain bg-black/10"
                />
              </div>
              <div className="w-full px-1 sm:max-w-xs sticky left-0 z-10 transition-transform duration-75">
                <h3 className="text-base sm:text-lg font-semibold text-black tracking-tight mb-0.5 truncate">{video.title}</h3>
                <p className="text-xs sm:text-sm text-black/50 line-clamp-1">{video.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
        
      <div className="px-4 sm:px-8 max-w-3xl mx-auto w-full flex justify-center">
        {limit && videos.length > limit && (
          <motion.div variants={itemAnim} className="mt-2 sm:mt-4 flex w-full justify-center">
            <AnimatedButton href="/ai-videos" isPrimary={true}>
              View More Videos
            </AnimatedButton>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
