"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AnimatedButton from "./AnimatedButton";
import { Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RetroVideoPlayer from "./RetroVideoPlayer";

function LazyVideo({ src, poster, onLoadedMetadata, isVertical }) {
  const videoRef = useRef(null);

  const handleEnter = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  };

  const handleLeave = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.muted = true;
  };

  const handleClick = () => {
    if (!window.matchMedia("(hover: none)").matches) return;
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = false;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      loop
      muted
      playsInline
      preload="metadata"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      onLoadedMetadata={onLoadedMetadata}
      className={`w-full h-full object-cover bg-neutral-900 ${isVertical ? "object-top" : ""}`}
    />
  );
}

export default function AIVideoShowcase({ limit }) {
  const videos = [
    {
      src: "/aivideos/AI_ADVERTISEMENT.mp4",
      title: "STEREO HEADPHONES",
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
      src: "/aivideos/hyper_realistic_detail.mp4",
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
  const [activeVideo, setActiveVideo] = useState(null);

  // Duplicate the video array for a seamless infinite scroll loop
  const duplicatedVideos = [...videos, ...videos];

  const handleLoadedMetadata = (index, e) => {
    const { videoWidth, videoHeight } = e.target;
    if (videoWidth && videoHeight) {
      const ratio = videoWidth / videoHeight;
      setAspectRatios(prev => ({ ...prev, [index]: ratio }));
    }
  };

  useEffect(() => {
    if (!limit) return;
    if (isHovered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let animationFrameId;
    let currentScroll = scrollContainerRef.current?.scrollLeft || 0;

    const scroll = () => {
      const container = scrollContainerRef.current;
      if (container) {
        currentScroll += 0.8;
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.35, ease: "easeOut" } 
    },
  };

  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="w-full py-16 sm:py-24"
    >
      <div className="px-4 sm:px-8 max-w-5xl mx-auto w-full flex flex-col min-w-0">
        <motion.div variants={itemAnim} className="flex flex-col justify-start gap-4 w-full min-w-0 mb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f5f7] text-[#86868b] text-xs font-sans mb-4 uppercase tracking-wider font-medium border border-black/[0.04]">
              <Video size={13} /> AI Experiments
            </div>
            <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.03em] mb-2 sm:mb-4">
              Generative Video
            </h2>
            <p className="text-base sm:text-lg text-[#86868b] max-w-2xl leading-relaxed font-sans break-words w-full">
              Showcasing advanced generative AI works, focusing on photorealism and dynamic visual storytelling.
            </p>
          </div>
        </motion.div>
      </div>
        
      {limit ? (
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)'
          }}
          className="flex flex-row items-start overflow-x-auto gap-4 sm:gap-6 pb-6 pt-2 px-4 sm:px-8 w-full mt-6 sm:mt-10 max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {duplicatedVideos.map((video, i) => {
            const rawIdx = i % videos.length;

            return (
              <motion.div
                variants={itemAnim}
                key={i}
                className="flex flex-col group shrink-0 w-[80vw] sm:w-auto cursor-pointer"
                onClick={() => setActiveVideo(video)}
              >
                <div className={`relative rounded-3xl overflow-hidden bg-neutral-900 mb-3 border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto h-[260px] sm:h-[320px] lg:h-[340px] ${video.isVertical ? "sm:aspect-[9/16]" : "sm:aspect-video"}`}>
                  <LazyVideo
                    src={video.src}
                    poster={`/aivideos/posters/${video.src.split("/").pop().replace(".mp4", ".jpg")}`}
                    onLoadedMetadata={(e) => handleLoadedMetadata(rawIdx, e)}
                    isVertical={video.isVertical}
                  />
                </div>
                <div className="w-full px-1 sm:max-w-xs">
                  <h3 className="text-base font-sans font-semibold text-[#1d1d1f] tracking-tight mb-0.5 truncate">{video.title}</h3>
                  <p className="text-xs sm:text-sm text-[#86868b] font-sans line-clamp-1">{video.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-8 w-full max-w-5xl mx-auto mt-6 sm:mt-10">
          {videos.map((video, i) => (
            <motion.div
              variants={itemAnim}
              key={i}
              className="flex flex-col group min-w-0 cursor-pointer"
              onClick={() => setActiveVideo(video)}
            >
              <div className="relative rounded-3xl overflow-hidden bg-neutral-900 mb-3 border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex justify-center items-center w-full h-[300px] sm:h-[360px]">
                <LazyVideo
                  src={video.src}
                  poster={`/aivideos/posters/${video.src.split("/").pop().replace(".mp4", ".jpg")}`}
                  onLoadedMetadata={(e) => handleLoadedMetadata(i, e)}
                  isVertical={video.isVertical}
                />
              </div>
              <div className="w-full px-1">
                <h3 className="text-base font-sans font-semibold text-[#1d1d1f] tracking-tight mb-0.5 truncate">{video.title}</h3>
                <p className="text-xs sm:text-sm text-[#86868b] font-sans line-clamp-1">{video.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
        
      <div className="px-4 sm:px-8 max-w-3xl mx-auto w-full flex justify-center">
        {limit && videos.length > limit && (
          <motion.div variants={itemAnim} className="mt-4 sm:mt-8 flex w-full justify-center">
            <AnimatedButton href="/ai-videos" isPrimary={true}>
              View More Videos
            </AnimatedButton>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {activeVideo && (
          <RetroVideoPlayer 
            src={activeVideo.src} 
            poster={`/aivideos/posters/${activeVideo.src.split("/").pop().replace(".mp4", ".jpg")}`}
            title={activeVideo.title}
            onClose={() => setActiveVideo(null)} 
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}
