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
      className="fixed inset-0 w-full h-[100dvh] overflow-hidden overscroll-none touch-none bg-[#f4f4f4] text-[#1d1d1f] flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-5 sm:gap-8 lg:gap-0 px-4 sm:px-8 lg:px-0 select-none"
    >
      {/* Top / Left Column: Author Identity & Action Buttons */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 lg:pl-24 xl:pl-32 shrink-0 z-20 lg:h-full">
        <div>
          <h1 className="text-2xl sm:text-4xl lg:text-[52px] font-semibold tracking-tight text-[#111111] font-sans leading-tight">
            Satya Sai Nagubathula
          </h1>
          
          <p className="text-base sm:text-2xl lg:text-3xl font-normal tracking-tight text-[#8f8f8f] mt-1 sm:mt-2 font-sans">
            Design Technologist
          </p>

          {/* Two prominent action buttons */}
          <div className="mt-4 sm:mt-6 lg:mt-8 flex items-center gap-3 sm:gap-4">
            <Link
              href="/about"
              aria-label="About Satya"
              title="About Satya"
              className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#111111] hover:bg-[#fafafa] hover:scale-105 active:scale-95 transition-all group"
            >
              <User size={19} strokeWidth={1.75} className="group-hover:opacity-75 transition-opacity" />
            </Link>

            <a
              href="mailto:nagubathula.satyasai@gmail.com"
              aria-label="Send email"
              title="Contact"
              className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-2xl bg-white border border-black/[0.06] shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex items-center justify-center text-[#111111] hover:bg-[#fafafa] hover:scale-105 active:scale-95 transition-all group"
            >
              <MessageSquare size={19} strokeWidth={1.75} className="group-hover:opacity-75 transition-opacity" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom / Right Column: 3D Split-Flap Mechanical Flip Calendar */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-2 sm:px-6 lg:pr-20 xl:pr-28 z-10 lg:h-full shrink-0">
        <FlipCalendarNav />
      </div>
    </div>
  );
}
