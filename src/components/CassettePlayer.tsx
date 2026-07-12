"use client";

import Image from "next/image";

export function CassettePlayer() {
  return (
    <div className="relative w-full max-w-[600px] bg-[#e1dfda] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.05)] p-6 pt-8 border border-[#d2d0cb] flex flex-col gap-5">
      
      {/* Top vents */}
      <div className="flex justify-center gap-4 mb-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-10 h-2.5 rounded-full bg-[#9b9994] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_1px_1px_rgba(255,255,255,0.6)]" />
        ))}
      </div>

      {/* Cassette Image Section */}
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.1)]">
        <Image 
          src="/images/QuOjsolNXDWvb627uFeMBpoQAqs.png"
          alt="Cassette Tape"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Digital Display Area */}
      <div className="bg-[#121411] rounded shadow-[inset_0_2px_5px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.4)] border border-[#2a2a2a] py-2 px-3 flex justify-between items-center relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4ada5a] shadow-[0_0_8px_#4ada5a]" />
          <div className="flex items-center">
            <span className="text-[10px] text-white/50 font-mono tracking-[0.2em] font-semibold">READY &mdash; </span>
            <span className="text-[10px] text-[#e08a3a] font-mono tracking-[0.2em] font-semibold ml-2">SELECT A TAPE</span>
          </div>
        </div>
        <div className="text-[10px] text-[#4ada5a] font-mono font-bold tracking-[0.1em] relative z-10">00:00</div>
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
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[8px] text-[#85837e] font-sans font-semibold tracking-tight uppercase">STOP/EJECT</span>
            <div className="w-full h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,1)] border border-[#b8b7b2]" />
          </div>
          {/* REC */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[8px] text-[#85837e] font-sans font-semibold tracking-tight uppercase">REC</span>
            <div className="w-full h-10 bg-gradient-to-b from-[#f26725] to-[#d45012] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,0.4)] border border-[#c24813]" />
          </div>
          {/* PLAY */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[8px] text-[#85837e] font-sans font-semibold tracking-tight uppercase">▶ PLAY</span>
            <div className="w-full h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,1)] border border-[#b8b7b2]" />
          </div>
          {/* REV */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[8px] text-[#85837e] font-sans font-semibold tracking-tight uppercase">◀◀ REV</span>
            <div className="w-full h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,1)] border border-[#b8b7b2]" />
          </div>
          {/* CUE */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[8px] text-[#85837e] font-sans font-semibold tracking-tight uppercase">CUE ▶▶</span>
            <div className="w-full h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,1)] border border-[#b8b7b2]" />
          </div>
          {/* PAUSE */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <span className="text-[8px] text-[#85837e] font-sans font-semibold tracking-tight uppercase">PAUSE</span>
            <div className="w-full h-10 bg-gradient-to-b from-[#fdfcf9] to-[#dcdbd7] rounded-md shadow-[0_4px_6px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,1)] border border-[#b8b7b2]" />
          </div>
        </div>

        {/* Right LEDs */}
        <div className="flex flex-col items-start justify-end pb-3 pl-2 gap-2">
          <div className="flex items-center gap-2">
             <span className="text-[7px] text-[#85837e] font-sans font-semibold uppercase">REC</span>
             <div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] opacity-60" />
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[7px] text-[#85837e] font-sans font-semibold uppercase">BATT</span>
             <div className="w-1.5 h-1.5 rounded-full bg-[#4ada5a] shadow-[0_0_4px_#4ada5a]" />
          </div>
        </div>
      </div>
      
    </div>
  );
}
