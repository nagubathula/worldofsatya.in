"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ChibiAvatar from "./ChibiAvatar";
import { useBlackHoleTransition } from "./BlackHoleTransition";

export const navTiles = [
  {
    id: "about",
    title: "About",
    href: "/about",
    isAvatar: true,
  },
  {
    id: "works",
    title: "Works",
    href: "/works",
    image: "/openweave-app.png",
  },
  {
    id: "case-studies",
    title: "Case Studies",
    href: "/case-studies",
    image: "/notbad-editor.png",
  },
  {
    id: "ai-videos",
    title: "AI Videos",
    href: "/ai-videos",
    image: "/aivideos/posters/hyper_realistic_detail.jpg",
  },
  {
    id: "open-source",
    title: "Open Source",
    href: "/open-source",
    image: "/notbad-palette.png",
  },
  {
    id: "experience",
    title: "Experience",
    href: "/experience",
    image: "/gallery/compatriot-board.jpg",
  },
  {
    id: "internal-tools",
    title: "Internal Tools",
    href: "/internal-tools",
    image: "/redantio.webp",
  },
  {
    id: "achievements",
    title: "Achievements",
    href: "/achievements",
    image: "/gallery/hardware-hacking.jpg",
  },
];

export default function ScrollableTilesNav() {
  const router = useRouter();
  const { navigate: blackHoleNavigate } = useBlackHoleTransition();
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrollingRef = useRef(false);
  const containerRef = useRef(null);
  const touchStartY = useRef(0);

  const total = navTiles.length;

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Smooth wheel handling with cooldown
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (isScrollingRef.current) return;

      const threshold = 16;
      if (Math.abs(e.deltaY) > threshold) {
        isScrollingRef.current = true;
        if (e.deltaY > 0) {
          goToNext();
        } else {
          goToPrev();
        }
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 320);
      }
    },
    [goToNext, goToPrev]
  );

  // Attach non-passive wheel event
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  // Touch swipe handling
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "Enter") {
        blackHoleNavigate(navTiles[activeIndex].href);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev, activeIndex, router]);

  return (
    <div
      ref={containerRef}
      data-lenis-prevent="true"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* 3D Perspective Card Stack */}
      <div
        className="relative w-[min(440px,86vw)] h-[min(460px,58vh)] flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {navTiles.map((tile, index) => {
          let offset = index - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          // Only render visible center, immediately preceding (-1), and immediately following (+1) cards
          if (Math.abs(offset) > 1) return null;

          const isCenter = offset === 0;
          const isAbove = offset < 0;

          let translateY = "0%";
          let rotateX = 0;
          let scale = 1;
          let opacity = 1;
          let zIndex = 20;

          if (isCenter) {
            translateY = "0%";
            rotateX = 0;
            scale = 1;
            opacity = 1;
            zIndex = 30;
          } else if (offset === -1) {
            translateY = "-92%";
            rotateX = 46;
            scale = 0.82;
            opacity = 0.35;
            zIndex = 20;
          } else if (offset === 1) {
            translateY = "92%";
            rotateX = -46;
            scale = 0.82;
            opacity = 0.35;
            zIndex = 20;
          }

          const transformOrigin = isAbove
            ? "bottom center"
            : "top center";

          return (
            <motion.div
              key={tile.id}
              onClick={(e) => {
                if (isCenter) {
                  blackHoleNavigate(tile.href, { x: e.clientX, y: e.clientY });
                } else if (offset < 0) {
                  goToPrev();
                } else {
                  goToNext();
                }
              }}
              animate={{
                y: translateY,
                rotateX: rotateX,
                scale: scale,
                opacity: opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 28,
                mass: 0.8,
              }}
              style={{
                transformOrigin: isCenter ? "center center" : transformOrigin,
                zIndex,
                cursor: "pointer",
              }}
              className="absolute inset-0 w-full h-full rounded-[30px] overflow-hidden bg-white border border-black/[0.08] shadow-[0_20px_45px_rgba(0,0,0,0.08)] group will-change-transform flex flex-col justify-between"
            >
              {/* Card Content */}
              {tile.isAvatar ? (
                /* The SVG Chibi Avatar inside the clean white box */
                <div className="relative w-full h-full flex flex-col items-center justify-between p-7 bg-[#ffffff] overflow-hidden">
                  {/* Subtle soft studio radial aura */}
                  <div className="absolute w-[90%] h-[90%] -top-[10%] left-[5%] bg-radial from-amber-100/35 via-slate-100/40 to-transparent blur-2xl pointer-events-none" />

                  {/* Character Illustration */}
                  <div className="relative flex-1 w-full flex flex-col items-center justify-center z-10">
                    <div className="relative w-44 sm:w-52 aspect-[9/16] max-h-[38vh]">
                      <ChibiAvatar className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.06)]" />
                    </div>
                    {/* Ground shadow */}
                    <div className="w-36 h-2.5 rounded-full bg-black/[0.07] blur-[3px] mt-0.5" />
                  </div>

                  {/* Minimalist Bottom Title matching reference */}
                  <div className="w-full flex items-center justify-between z-10">
                    <span className="text-lg sm:text-xl font-medium tracking-tight text-[#111111] font-sans">
                      {tile.title}
                    </span>
                  </div>
                </div>
              ) : (
                /* Section Preview Card matching reference */
                <div className="relative w-full h-full flex flex-col justify-between p-7 bg-[#ffffff] overflow-hidden">
                  {/* Image Frame */}
                  <div className="relative flex-1 w-full rounded-2xl overflow-hidden bg-[#f2f2f5] border border-black/[0.04]">
                    <Image
                      src={tile.image}
                      alt={tile.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 440px"
                      className="object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                    />
                  </div>

                  {/* Minimalist Bottom Title matching reference */}
                  <div className="w-full pt-4 flex items-center justify-between z-10">
                    <span className="text-lg sm:text-xl font-medium tracking-tight text-[#111111] font-sans">
                      {tile.title}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
