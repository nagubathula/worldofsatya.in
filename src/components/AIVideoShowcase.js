"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Video } from "lucide-react";

export default function AIVideoShowcase({ limit }) {
  const videos = [
    {
      src: "/aivideos/AI_ADVERTISEMENT.mp4",
      title: "STERIO HEADPHONES",
      description: "Generative AI commercial showcase.",
    },
    {
      src: "/aivideos/HANGY.mp4",
      title: "HANGY",
      description: "AI Video generation experiment.",
    },
    {
      src: "/aivideos/female_host_ai_generated.mp4",
      title: "AI Virtual Host",
      description: "Hyper-realistic virtual presenter generated with Gemini Omni.",
    },
    {
      src: "/aivideos/niat_ugc.mp4",
      title: "NIAT UGC",
      description: "User-generated content style AI generation.",
    },
    {
      src: "/aivideos/mustang_ai_realism.mp4",
      title: "Mustang AI Realism",
      description: "Photorealistic automotive generation.",
    },
    {
      src: "/aivideos/A_hyper_realistic_extreme_hig (1).mp4",
      title: "Hyper-Realistic Detail",
      description: "Extreme detail latent space manipulation.",
    },
    {
      src: "/aivideos/engineerudu_horizontal.mp4",
      title: "Engineerudu (Horizontal)",
      description: "Promotional AI video for FOSS community.",
    },
    {
      src: "/aivideos/engineerudu_vertical.mp4",
      title: "Engineerudu (Vertical)",
      description: "Vertical format AI promotional content.",
    }
  ];

  const scrollContainerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate the videos to create a seamless infinite loop
  const displayedVideos = limit ? videos.slice(0, limit) : videos;
  const duplicatedVideos = limit ? displayedVideos : [...videos, ...videos];

  const handlePlay = (e) => {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(v => {
      if (v !== e.target && !v.paused) {
        v.pause();
      }
    });
  };

  useEffect(() => {
    if (isHovered || limit) return; // Disable auto-scroll if limit is set or hovered

    let animationFrameId;

    const scroll = () => {
      if (window.innerWidth < 768) {
        animationFrameId = requestAnimationFrame(scroll);
        return;
      }
      const container = scrollContainerRef.current;
      if (container) {
        // Increment scroll position
        let currentScroll = container.scrollLeft;
        currentScroll += 1; // 1 pixel per frame
        
        // When we've scrolled past the first set, reset to the beginning
        // The first set of videos occupies exactly half of the total scrollable width
        if (currentScroll >= container.scrollWidth / 2) {
          currentScroll = 0;
        }
        
        container.scrollLeft = currentScroll;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, limit]);

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5">
      <div className="flex flex-col gap-10">
        <div className="mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-black/60 text-xs font-medium mb-4 uppercase tracking-widest">
            <Video size={14} /> AI Experiments
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-black tracking-tight mb-4">
            Generative Video
          </h2>
          <p className="text-base md:text-lg text-black/60 max-w-2xl leading-relaxed">
            Showcasing advanced generative AI works, focusing on photorealism and dynamic visual storytelling.
          </p>
        </div>
        
        <div 
          className="flex flex-col gap-12 min-w-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            ref={scrollContainerRef}
            className="flex flex-col md:flex-row gap-12 md:gap-6 md:overflow-x-auto pb-8 items-center md:items-start md:-mx-[calc(50vw-384px+48px)] md:px-[calc(50vw-384px+48px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {duplicatedVideos.map((video, i) => (
              <div 
                key={i} 
                className={`flex flex-col items-start group w-full md:w-auto shrink-0 ${!limit && i >= videos.length ? 'hidden md:flex' : ''}`}
              >
                <div className="relative rounded-3xl overflow-hidden bg-white mb-4 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex justify-center items-center w-full h-auto sm:w-auto sm:h-[320px]">
                  <video 
                    src={`${video.src}#t=1`} 
                    controls 
                    preload="metadata"
                    playsInline
                    onPlay={handlePlay}
                    className="w-full h-auto sm:w-auto sm:h-full"
                  />
                </div>
                <div className="w-full sm:max-w-xs">
                  <h3 className="text-xl font-semibold text-black tracking-tight mb-1">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {limit && videos.length > limit && (
          <div className="mt-4 flex justify-center">
            <Link href="/ai-videos" className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors">
              View More Videos
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
