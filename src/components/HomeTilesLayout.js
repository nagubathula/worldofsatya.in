"use client";

import Link from "next/link";
import { User, MessageSquare } from "lucide-react";
import FlipCalendarNav from "./FlipCalendarNav";

export default function HomeTilesLayout() {
  return (
    <div
      data-lenis-prevent="true"
      className="relative w-full h-[100dvh] overflow-hidden bg-[#f4f4f4] text-[#1d1d1f] flex flex-col lg:flex-row items-center justify-between select-none"
    >
      {/* Left Column: Exactly matching reference layout */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:pl-24 xl:pl-32 h-full z-20">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-semibold tracking-tight text-[#111111] font-sans leading-[1.05]">
            Satya Sai Nagubathula
          </h1>
          
          <p className="text-2xl sm:text-3xl font-normal tracking-tight text-[#8f8f8f] mt-2 font-sans">
            Design Technologist
          </p>

          {/* Two prominent action buttons */}
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/about"
              aria-label="About Satya"
              title="About Satya"
              className="w-14 h-14 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#111111] hover:bg-[#fafafa] hover:scale-105 active:scale-95 transition-all group"
            >
              <User size={20} strokeWidth={1.75} className="group-hover:opacity-75 transition-opacity" />
            </Link>

            <a
              href="mailto:nagubathula.satyasai@gmail.com"
              aria-label="Send email"
              title="Contact"
              className="w-14 h-14 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#111111] hover:bg-[#fafafa] hover:scale-105 active:scale-95 transition-all group"
            >
              <MessageSquare size={20} strokeWidth={1.75} className="group-hover:opacity-75 transition-opacity" />
            </a>
          </div>
        </div>
      </div>

      {/* Right Column: 3D Split-Flap Mechanical Flip Calendar */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center px-4 sm:px-8 lg:pr-20 xl:pr-28 z-10">
        <FlipCalendarNav />
      </div>
    </div>
  );
}
