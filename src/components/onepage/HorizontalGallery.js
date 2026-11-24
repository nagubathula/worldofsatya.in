"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export default function HorizontalGallery({ items = [], onOpen }) {
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = el.scrollLeft;
    setScrollProgress(maxScroll > 0 ? Math.min(1, Math.max(0, current / maxScroll)) : 0);
    setCanScrollLeft(current > 10);
    setCanScrollRight(current < maxScroll - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [items]);

  const scrollBy = (amount) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="relative w-full py-2">
      {/* Scroll Controls on Desktop */}
      <div className="mx-auto mb-6 flex w-full max-w-[620px] items-center justify-between px-5">
        <span className="text-[13px] font-medium text-[#999] tabular-nums">
          {items.length} works in archive
        </span>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-400)}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#181818] transition-all hover:bg-[#f5f5f5] disabled:opacity-30 disabled:pointer-events-none shadow-sm"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollBy(400)}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#181818] transition-all hover:bg-[#f5f5f5] disabled:opacity-30 disabled:pointer-events-none shadow-sm"
          >
            →
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Track */}
      <div
        ref={scrollRef}
        className="flex w-full gap-5 overflow-x-auto px-5 pb-8 pt-2 scrollbar-none select-none sm:gap-6 sm:px-10"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {items.map((item, index) => {
          const ratio = (item.width && item.height) ? item.width / item.height : 0.72;
          return (
            <div
              key={item.id || index}
              onClick={() => onOpen && onOpen(item)}
              style={{ scrollSnapAlign: "start" }}
              className="group relative flex h-[380px] shrink-0 cursor-pointer flex-col justify-between rounded-[18px] border border-black/[0.08] bg-white p-3.5 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-black/[0.16] hover:shadow-[0_20px_35px_-12px_rgba(0,0,0,0.12)] sm:h-[430px]"
            >
              {/* Media preview */}
              <div
                style={{ aspectRatio: ratio }}
                className="relative h-full overflow-hidden rounded-[12px] bg-[#f5f5f7]"
              >
                <Image
                  src={item.src}
                  alt={item.title || "Archive item"}
                  fill
                  sizes="360px"
                  className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  unoptimized={item.src?.endsWith(".gif") || item.src?.endsWith(".svg")}
                />
              </div>

              {/* Caption */}
              <div className="mt-3 flex items-baseline justify-between gap-2 px-1">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium text-[#181818]">
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="truncate text-[12px] text-[#777]">
                      {item.description}
                    </p>
                  )}
                </div>
                {item.category && (
                  <span className="shrink-0 rounded-full bg-[#f4f4f4] px-2.5 py-0.5 text-[11px] font-medium text-[#666]">
                    {item.category}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle Progress Bar */}
      <div className="mx-auto mt-2 w-full max-w-[620px] px-5">
        <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full bg-[#181818] transition-all duration-150 ease-out"
            style={{ width: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
