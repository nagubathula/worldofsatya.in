"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, X } from "lucide-react";

export default function RetroVideoPlayer({ src, poster, title, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const videoRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setCurrentTime(current);
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modern Header */}
        <div className="flex justify-between items-center bg-neutral-900 text-white px-5 py-3.5 border-b border-neutral-800 font-sans text-xs sm:text-sm select-none">
          <span className="font-medium text-neutral-200 truncate">{title || "Video Player"}</span>
          <button 
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>

        {/* Video Area */}
        <div 
          className="relative w-full bg-black overflow-hidden cursor-pointer"
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

          {/* Play Button Overlay (when paused) */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 pointer-events-none">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center pl-1 shadow-2xl backdrop-blur-sm">
                <Play size={28} className="fill-neutral-900" />
              </div>
            </div>
          )}
        </div>

        {/* Modern Controls */}
        <div className="p-4 bg-neutral-900 flex flex-col gap-3">
          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-neutral-800 rounded-full cursor-pointer relative overflow-hidden group"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-orange-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center font-sans text-xs sm:text-sm text-neutral-400">
            <div className="flex items-center gap-3">
              <button 
                onClick={togglePlay}
                className="p-2 rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <button 
                onClick={toggleMute}
                className="p-2 rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            </div>
            
            <div className="font-mono text-xs text-neutral-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
