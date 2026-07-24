"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export function CassettePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [playerHeight, setPlayerHeight] = useState(650);

  // Initialize scale and height
  useEffect(() => {
    if (playerRef.current) {
      setPlayerHeight(playerRef.current.offsetHeight);
    }
    
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Subtract 32px for some basic padding on mobile
        const availableWidth = entry.contentRect.width - 32;
        setScale(Math.max(0.1, Math.min(1, availableWidth / 700)));
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Initialize audio object
  useEffect(() => {
    // Replace with actual voice file path later
    audioRef.current = new Audio("/audio/satya.wav");
    
    const updateTime = () => {
      if (audioRef.current) {
        setTime(audioRef.current.currentTime);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setTime(0);
    };

    audioRef.current.addEventListener("timeupdate", updateTime);
    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateTime);
        audioRef.current.removeEventListener("ended", handleEnded);
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // In a real scenario, this might need user interaction first due to browser policies,
      // but since it's triggered by a button click, it's fine.
      audioRef.current.play().catch(e => console.log("Audio play failed, missing file:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const playAudio = () => {
    if (!audioRef.current) return;
    if (!isPlaying) {
      audioRef.current.play().catch(e => console.log("Audio play failed, missing file:", e));
      setIsPlaying(true);
    }
  };

  const stopPlay = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setTime(0);
  };

  const rewind = () => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, audioRef.current.currentTime - 10);
    audioRef.current.currentTime = newTime;
    setTime(newTime);
  };

  const fastForward = () => {
    if (!audioRef.current) return;
    const duration = audioRef.current.duration && !isNaN(audioRef.current.duration) ? audioRef.current.duration : audioRef.current.currentTime + 10;
    const newTime = Math.min(duration, audioRef.current.currentTime + 10);
    audioRef.current.currentTime = newTime;
    setTime(newTime);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
      className="flex justify-center items-center w-full py-8 overflow-hidden"
    >
      <div 
        className="relative transition-all duration-300"
        style={{ 
          width: 700 * scale,
          height: playerHeight * scale,
        }}
      >
        <div 
          ref={playerRef}
          className="absolute top-0 left-0 w-[700px] shrink-0 bg-[#e1dfda] rounded-[32px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.05)] p-8 pt-10 border border-[#d2d0cb] flex flex-col gap-8 z-50"
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top left' 
          }}
        >
      
      {/* Top vents */}
      <div className="flex justify-center gap-4 mb-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-10 h-2.5 rounded-full bg-[#9b9994] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_1px_rgba(255,255,255,0.6)]" />
        ))}
      </div>

      {/* Cassette Image Section */}
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden group">
        <Image 
          src="/images/QuOjsolNXDWvb627uFeMBpoQAqs.png"
          alt="Cassette Tape"
          fill
          className="object-cover"
          priority
        />
        {/* Semi-transparent overlay to simulate being inside a deck */}
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Digital Display Area */}
      <div className="bg-[#121411] rounded shadow-[inset_0_2px_5px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.4)] border border-[#2a2a2a] py-2 px-3 flex justify-between items-center relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div 
            className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-[#4ada5a] shadow-[0_0_8px_#4ada5a]' : 'bg-[#a3a19c]'}`} 
          />
          <div className="flex items-center">
            <span className="text-[10px] text-white/50 font-mono tracking-[0.2em] font-semibold">
              {isPlaying ? 'PLAYING \u2014 ' : 'READY \u2014 '}
            </span>
            <span className="text-[10px] text-[#e08a3a] font-mono tracking-[0.2em] font-semibold ml-2">
              MY STORY
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Animated Equalizer */}
           {isPlaying && (
             <div className="flex gap-0.5 items-end h-4">
               {[
                 ["20%", "60%", "30%", "100%", "40%", "80%", "20%"],
                 ["40%", "100%", "20%", "80%", "30%", "90%", "40%"],
                 ["10%", "80%", "40%", "90%", "20%", "70%", "10%"],
                 ["30%", "90%", "20%", "100%", "50%", "80%", "30%"],
                 ["50%", "20%", "80%", "30%", "100%", "40%", "50%"]
               ].map((heights, i) => (
                 <div
                   key={i}
                   className="w-[3px] bg-[#4ada5a] rounded-t-sm shadow-[0_0_4px_#4ada5a]"
                   style={{ height: heights[0] }}
                 />
               ))}
             </div>
           )}
          <div className="text-[10px] text-[#4ada5a] font-mono font-bold tracking-[0.1em] relative z-10 w-8 text-right">
            {formatTime(time)}
          </div>
        </div>
      </div>

      {/* Physical Buttons Area */}
      <div className="grid grid-cols-[auto_1fr_auto] items-end gap-4 mt-2">
        {/* Left speaker/vents */}
        <div className="flex flex-col gap-1.5 w-6 pb-2">
          {[1,2,3,4].map(i => <div key={i} className="h-1 bg-[#a3a19c] rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.5)] w-full" />)}
        </div>
        
        {/* Buttons */}
        <div className="flex justify-between gap-2">
          {/* STOP/EJECT */}
          <button onClick={stopPlay} className="flex flex-col items-center gap-1.5 flex-1 group">
            <span className="text-[8px] text-[#85837e] font-sans font-semibold tracking-tight uppercase">STOP</span>
            <div className="w-full h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,1)] border border-[#b8b7b2] group-active:shadow-inner group-active:translate-y-1 transition-all" />
          </button>
          {/* REC */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[8px] text-[#85837e] font-sans font-semibold tracking-tight uppercase">REC</span>
            <div className="w-full h-10 bg-gradient-to-b from-[#f26725] to-[#d45012] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,0.4)] border border-[#c24813]" />
          </div>
          {/* PLAY */}
          <button onClick={playAudio} className="flex flex-col items-center gap-1.5 flex-1 group">
            <span className="text-[8px] text-[#85837e] font-sans font-semibold tracking-tight uppercase">▶ PLAY</span>
            <div 
              className={`w-full h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,1)] border border-[#b8b7b2] ${isPlaying ? 'translate-y-1 shadow-inner' : ''}`} 
            />
          </button>
          {/* REV */}
          <button onClick={rewind} className="flex flex-col items-center gap-1.5 flex-1 group">
            <span className="text-[8px] text-[#85837e] font-sans font-semibold tracking-tight uppercase">◀◀ REV</span>
            <div className="w-full h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,1)] border border-[#b8b7b2]" />
          </button>
          {/* CUE */}
          <button onClick={fastForward} className="flex flex-col items-center gap-1.5 flex-1 group">
            <span className="text-[8px] text-[#85837e] font-sans font-semibold tracking-tight uppercase">CUE ▶▶</span>
            <div className="w-full h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,1)] border border-[#b8b7b2]" />
          </button>
          {/* PAUSE */}
          <button onClick={togglePlay} className="flex flex-col items-center gap-1.5 flex-1 group">
            <span className="text-[8px] text-[#85837e] font-sans font-semibold tracking-tight uppercase">PAUSE</span>
            <div 
              className={`w-full h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,1)] border border-[#b8b7b2] ${(!isPlaying && time > 0) ? 'translate-y-1 shadow-inner' : ''}`} 
            />
          </button>
        </div>

        {/* Right LEDs */}
        <div className="flex flex-col items-start justify-end pb-3 pl-2 gap-2">
          <div className="flex items-center gap-2">
             <span className="text-[7px] text-[#85837e] font-sans font-semibold uppercase">PLAY</span>
             <div 
               className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#4ada5a] shadow-[0_0_6px_#4ada5a]' : 'bg-gray-400 opacity-30'}`} 
             />
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[7px] text-[#85837e] font-sans font-semibold uppercase">BATT</span>
             <div className="w-1.5 h-1.5 rounded-full bg-[#4ada5a] shadow-[0_0_4px_#4ada5a]" />
          </div>
        </div>
      </div>
      
      </div>
      </div>
    </motion.div>
  );
}
