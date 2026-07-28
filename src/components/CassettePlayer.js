"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export function CassettePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const audioRef = useRef(null);

  // Initialize audio object
  useEffect(() => {
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

    const autoPlayTimer = setTimeout(() => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.log("Auto-play blocked by browser or missing file:", e));
      }
    }, 2500);

    return () => {
      clearTimeout(autoPlayTimer);
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
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ type: "spring", duration: 0.4, bounce: 0 }}
      className="flex justify-center items-center w-full py-2 sm:py-8 overflow-hidden"
    >
      <div className="w-full max-w-[540px] bg-[#e1dfda] rounded-xl sm:rounded-[32px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.05)] p-3 sm:p-8 pt-4 sm:pt-10 border border-[#d2d0cb] flex flex-col gap-3 sm:gap-8 mx-auto min-w-0 overflow-hidden">
        {/* Top vents */}
        <div className="flex justify-center gap-1.5 sm:gap-4 mb-0.5 sm:mb-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-5 sm:w-10 h-1 sm:h-2.5 rounded-full bg-[#9b9994] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_1px_rgba(255,255,255,0.6)]" />
          ))}
        </div>

        {/* Cassette Image Section */}
        <div className="relative w-full aspect-[16/9] rounded-md sm:rounded-xl overflow-hidden group">
          <Image 
            src="/images/QuOjsolNXDWvb627uFeMBpoQAqs.png"
            alt="Cassette Tape"
            fill
            sizes="(max-width: 768px) 100vw, 540px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-foreground/10 mix-blend-multiply pointer-events-none" />
        </div>

        {/* Digital Display Area */}
        <div className="bg-[#121411] rounded shadow-[inset_0_2px_5px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.4)] border border-[#2a2a2a] py-1.5 sm:py-2 px-2.5 sm:px-3 flex justify-between items-center relative overflow-hidden w-full min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-3 relative z-10 min-w-0">
            <div className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 ${isPlaying ? 'bg-[#4ada5a] shadow-[0_0_8px_#4ada5a]' : 'bg-[#a3a19c]'}`} />
            <div className="flex items-center truncate">
              <span className="text-[8px] sm:text-[10px] text-background/50 font-mono tracking-[0.08em] sm:tracking-[0.2em] font-semibold">
                {isPlaying ? 'PLAYING \u2014 ' : 'READY \u2014 '}
              </span>
              <span className="text-[8px] sm:text-[10px] text-[#e08a3a] font-mono tracking-[0.08em] sm:tracking-[0.2em] font-semibold ml-1 sm:ml-2 truncate">
                MY STORY
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            {isPlaying && (
              <div className="flex gap-0.5 items-end h-3 sm:h-4">
                {[
                  ["20%", "60%", "30%", "100%", "40%", "80%", "20%"],
                  ["40%", "100%", "20%", "80%", "30%", "90%", "40%"],
                  ["10%", "80%", "40%", "90%", "20%", "70%", "10%"],
                  ["30%", "90%", "20%", "100%", "50%", "80%", "30%"],
                  ["50%", "20%", "80%", "30%", "100%", "40%", "50%"]
                ].map((heights, i) => (
                  <div
                    key={i}
                    className="w-[2px] sm:w-[3px] bg-[#4ada5a] rounded-t-sm shadow-[0_0_4px_#4ada5a]"
                    style={{ height: heights[0] }}
                  />
                ))}
              </div>
            )}
            <div suppressHydrationWarning className="text-[8px] sm:text-[10px] text-[#4ada5a] font-mono font-bold tracking-[0.05em] relative z-10 w-7 sm:w-8 text-right">
              {formatTime(time)}
            </div>
          </div>
        </div>

        {/* Physical Buttons Area */}
        <div className="flex items-end gap-1.5 sm:gap-4 mt-0.5 sm:mt-2 w-full min-w-0">
          {/* Left speaker/vents */}
          <div className="hidden sm:flex flex-col gap-1 w-3 sm:w-6 pb-2 shrink-0">
            {[1,2,3,4].map(i => <div key={i} className="h-0.5 sm:h-1 bg-[#a3a19c] rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.5)] w-full" />)}
          </div>
          
          {/* Buttons */}
          <div className="flex justify-between gap-1 sm:gap-2 flex-1 min-w-0">
            {/* STOP */}
            <button onClick={stopPlay} className="flex flex-col items-center gap-0.5 sm:gap-1 flex-1 min-w-0 group">
              <span className="text-[6px] sm:text-[8px] text-[#85837e] font-sans font-semibold tracking-tighter sm:tracking-tight uppercase truncate">STOP</span>
              <div className="w-full h-6 sm:h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-sm sm:rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,1)] border border-[#b8b7b2] group-active:shadow-inner group-active:translate-y-0.5 transition-all" />
            </button>
            {/* REC */}
            <div className="flex flex-col items-center gap-0.5 sm:gap-1 flex-1 min-w-0">
              <span className="text-[6px] sm:text-[8px] text-[#85837e] font-sans font-semibold tracking-tighter sm:tracking-tight uppercase truncate">REC</span>
              <div className="w-full h-6 sm:h-10 bg-gradient-to-b from-[#f26725] to-[#d45012] rounded-sm sm:rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-[#c24813]" />
            </div>
            {/* PLAY */}
            <button onClick={playAudio} className="flex flex-col items-center gap-0.5 sm:gap-1 flex-1 min-w-0 group">
              <span className="text-[6px] sm:text-[8px] text-[#85837e] font-sans font-semibold tracking-tighter sm:tracking-tight uppercase truncate">PLAY</span>
              <div className={`w-full h-6 sm:h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-sm sm:rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,1)] border border-[#b8b7b2] ${isPlaying ? 'translate-y-0.5 shadow-inner' : ''}`} />
            </button>
            {/* REV */}
            <button onClick={rewind} className="flex flex-col items-center gap-0.5 sm:gap-1 flex-1 min-w-0 group">
              <span className="text-[6px] sm:text-[8px] text-[#85837e] font-sans font-semibold tracking-tighter sm:tracking-tight uppercase truncate">REV</span>
              <div className="w-full h-6 sm:h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-sm sm:rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,1)] border border-[#b8b7b2]" />
            </button>
            {/* FWD */}
            <button onClick={fastForward} className="flex flex-col items-center gap-0.5 sm:gap-1 flex-1 min-w-0 group">
              <span className="text-[6px] sm:text-[8px] text-[#85837e] font-sans font-semibold tracking-tighter sm:tracking-tight uppercase truncate">FWD</span>
              <div className="w-full h-6 sm:h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-sm sm:rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,1)] border border-[#b8b7b2]" />
            </button>
            {/* PAUSE */}
            <button onClick={togglePlay} className="flex flex-col items-center gap-0.5 sm:gap-1 flex-1 min-w-0 group">
              <span className="text-[6px] sm:text-[8px] text-[#85837e] font-sans font-semibold tracking-tighter sm:tracking-tight uppercase truncate">PAUSE</span>
              <div className={`w-full h-6 sm:h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-sm sm:rounded-md shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,1)] border border-[#b8b7b2] ${(!isPlaying && time > 0) ? 'translate-y-0.5 shadow-inner' : ''}`} />
            </button>
          </div>

          {/* Right LEDs */}
          <div className="hidden sm:flex flex-col items-start justify-end pb-3 pl-2 gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[7px] text-[#85837e] font-sans font-semibold uppercase">PLAY</span>
              <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[#4ada5a] shadow-[0_0_6px_#4ada5a]' : 'bg-gray-400 opacity-30'}`} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[7px] text-[#85837e] font-sans font-semibold uppercase">BATT</span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ada5a] shadow-[0_0_4px_#4ada5a]" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
