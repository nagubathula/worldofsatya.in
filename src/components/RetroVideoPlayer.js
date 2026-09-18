"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

export default function RetroVideoPlayer({ src, poster, onClose, title }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-play when opened
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked if unmuted
        setIsMuted(true);
        videoRef.current.play().catch(() => {});
      });
    }
  }, []);

  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 2500);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!mounted) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#3e3832]/80 backdrop-blur-sm p-4 sm:p-12"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl bg-[#fcf8f0] border-4 border-[#3e3832] p-2 shadow-[8px_8px_0px_rgba(30,25,20,0.6)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Retro Window Header */}
        <div className="flex justify-between items-center bg-[#3e3832] text-[#fcf8f0] px-3 py-1.5 mb-2 font-pixel tracking-wider text-xs sm:text-sm select-none">
          <div className="flex gap-2 items-center">
            <span className="inline-block w-3 h-3 border border-[#fcf8f0] bg-transparent"></span>
            <span>{title || "MEDIA_PLAYER.EXE"}</span>
          </div>
          <button 
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center border-2 border-[#fcf8f0] bg-transparent hover:bg-[#fcf8f0] hover:text-[#3e3832] transition-colors"
          >
            ×
          </button>
        </div>

        {/* Video Area */}
        <div 
          className="relative w-full bg-[#111] overflow-hidden cursor-pointer"
          style={{ aspectRatio: '16/9' }}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            className="w-full h-full object-contain"
          />
          
          {/* Subtle CRT Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10" />

          {/* Big Play Button Overlay (when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/30 pointer-events-none">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#fdfaf3] border-4 border-[#3e3832] flex items-center justify-center pl-2 shadow-[4px_4px_0px_rgba(62,56,50,1)]">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-[#3e3832] border-b-[12px] border-b-transparent" />
              </div>
            </div>
          )}
        </div>

        {/* Retro Controls */}
        <motion.div 
          className="mt-2 p-2 bg-[#e8e4d9] border-2 border-[#3e3832] flex flex-col gap-2"
          animate={{ opacity: showControls ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
        >
          {/* Progress Bar */}
          <div 
            className="w-full h-4 sm:h-6 bg-[#cfcbc0] border-2 border-b-white border-r-white border-t-[#3e3832] border-l-[#3e3832] cursor-pointer relative"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-[#3e3832]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center pt-1 font-pixel text-xs sm:text-sm text-[#3e3832]">
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={togglePlay}
                className="px-3 sm:px-4 py-1.5 bg-[#fdfaf3] border-2 border-b-[#3e3832] border-r-[#3e3832] border-t-white border-l-white active:border-t-[#3e3832] active:border-l-[#3e3832] active:border-b-white active:border-r-white active:bg-[#e8e4d9] hover:brightness-105"
              >
                {isPlaying ? "PAUSE" : "PLAY"}
              </button>
              <button 
                onClick={toggleMute}
                className="px-3 py-1.5 bg-[#fdfaf3] border-2 border-b-[#3e3832] border-r-[#3e3832] border-t-white border-l-white active:border-t-[#3e3832] active:border-l-[#3e3832] active:border-b-white active:border-r-white active:bg-[#e8e4d9] hover:brightness-105 min-w-[70px] text-center"
              >
                {isMuted ? "UNMUTE" : "MUTE"}
              </button>
            </div>
            
            <div className="px-2 font-mono font-medium tracking-tight bg-[#cfcbc0] border-2 border-b-white border-r-white border-t-[#3e3832] border-l-[#3e3832]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
