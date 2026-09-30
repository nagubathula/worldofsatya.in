"use client";

import { useEffect } from "react";
import Link from "next/link";
import { User, MessageSquare } from "lucide-react";
import FlipCalendarNav from "./FlipCalendarNav";

export default function HomeTilesLayout() {
  // Lock body/html scroll on home so mobile browsers never scroll/rubber-band the viewport
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.touchAction = prevTouchAction;
    };
  }, []);

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 w-full h-[100dvh] overflow-hidden overscroll-none touch-none bg-[#f4f4f4] text-[#1d1d1f] flex flex-col lg:flex-row items-center justify-between select-none"
    >
      {/* Top / Left Column: Author Identity & Action Buttons */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-5 sm:px-12 lg:pl-24 xl:pl-32 shrink-0 pt-4 sm:pt-8 lg:pt-0 lg:h-full z-20">
        <div>
          <h1 className="text-xl sm:text-3xl lg:text-[52px] font-semibold tracking-tight text-[#111111] font-sans leading-tight">
            Satya Sai Nagubathula
          </h1>
          
          <p className="text-sm sm:text-xl lg:text-3xl font-normal tracking-tight text-[#8f8f8f] mt-0.5 sm:mt-1 font-sans">
            Design Technologist
          </p>

          {/* Two prominent action buttons */}
          <div className="mt-2.5 sm:mt-4 lg:mt-8 flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/about"
              aria-label="About Satya"
              title="About Satya"
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#111111] hover:bg-[#fafafa] hover:scale-105 active:scale-95 transition-all group"
            >
              <User size={17} strokeWidth={1.75} className="sm:scale-110 group-hover:opacity-75 transition-opacity" />
            </Link>

            <a
              href="mailto:nagubathula.satyasai@gmail.com"
              aria-label="Send email"
              title="Contact"
              className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl sm:rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#111111] hover:bg-[#fafafa] hover:scale-105 active:scale-95 transition-all group"
            >
              <MessageSquare size={17} strokeWidth={1.75} className="sm:scale-110 group-hover:opacity-75 transition-opacity" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom / Right Column: 3D Split-Flap Mechanical Flip Calendar */}
      <div className="w-full lg:w-1/2 flex-1 lg:h-full flex items-center justify-center px-3 sm:px-8 lg:pr-20 xl:pr-28 pb-3 sm:pb-6 lg:pb-0 z-10 min-h-0">
        <FlipCalendarNav />
      </div>
    </div>
  );
}
