"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";

const galleryItems = [
  {
    id: 1,
    title: "Trip to the South — Afrobeats Poster",
    category: "Posters",
    src: "/gallery/trip-south.jpg",
    aspect: "portrait",
    width: 579,
    height: 719,
  },
  {
    id: 2,
    title: "UI/UX Design Systems Collage",
    category: "UI/UX",
    src: "/gallery/uiux-collage.jpg",
    aspect: "landscape",
    width: 800,
    height: 450,
  },
  {
    id: 3,
    title: "Michael Jackson World Tour Tribute",
    category: "Posters",
    src: "/gallery/mj-poster.jpg",
    aspect: "portrait",
    width: 558,
    height: 800,
  },
  {
    id: 4,
    title: "AI Copilot Interactive Motion",
    category: "AI & Motion",
    src: "/videos/5.gif",
    aspect: "square",
    width: 800,
    height: 800,
  },
  {
    id: 5,
    title: "Satya The Great 3D Coin Render",
    category: "3D & Visuals",
    src: "/gallery/satya-coin.jpg",
    aspect: "square",
    width: 791,
    height: 800,
  },
  {
    id: 6,
    title: "Hardware Hacking Workshop",
    category: "Posters",
    src: "/gallery/hardware-hacking.jpg",
    aspect: "portrait",
    width: 257,
    height: 366,
  },
  {
    id: 7,
    title: "CompatrIoT Hardware System",
    category: "UI/UX",
    src: "/gallery/compatriot-board.jpg",
    aspect: "landscape",
    width: 800,
    height: 520,
  },
  {
    id: 8,
    title: "Product Campaign Series",
    category: "Posters",
    src: "/gallery/product-ads.jpg",
    aspect: "landscape",
    width: 800,
    height: 450,
  },
  {
    id: 9,
    title: "Ugadi Cultural Celebrations",
    category: "Posters",
    src: "/gallery/ugadi.jpg",
    aspect: "portrait",
    width: 259,
    height: 367,
  },
  {
    id: 10,
    title: "Fintech Card Interactive Flow",
    category: "AI & Motion",
    src: "/videos/4.gif",
    aspect: "square",
    width: 800,
    height: 800,
  },
  {
    id: 11,
    title: "CompatrIoT Terminal Labs",
    category: "UI/UX",
    src: "/gallery/compatriot-labs.jpg",
    aspect: "landscape",
    width: 800,
    height: 480,
  },
  {
    id: 12,
    title: "Christmas Calendar Typographic Poster",
    category: "Posters",
    src: "/gallery/christmas-calendar.jpg",
    aspect: "portrait",
    width: 709,
    height: 800,
  },
  {
    id: 13,
    title: "Editorial YouTube Series",
    category: "UI/UX",
    src: "/gallery/thumbnails.jpg",
    aspect: "landscape",
    width: 800,
    height: 450,
  },
  {
    id: 14,
    title: "Biryani Combo Social Marketing",
    category: "Posters",
    src: "/gallery/combo-biryani.jpg",
    aspect: "square",
    width: 370,
    height: 370,
  },
  {
    id: 15,
    title: "HVAC Motion Interface",
    category: "AI & Motion",
    src: "/videos/1.webp",
    aspect: "square",
    width: 800,
    height: 800,
  },
  {
    id: 16,
    title: "NextGen Mobile Banking UI",
    category: "UI/UX",
    src: "/videos/6.webp",
    aspect: "square",
    width: 800,
    height: 800,
  },
];

const categories = ["All", "Posters", "UI/UX", "AI & Motion", "3D & Visuals"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-7xl px-4 sm:px-12">
      <main className="relative z-10 flex flex-col pt-28 sm:pt-36">
        {/* Header */}
        <header className="mx-auto mb-10 w-full max-w-5xl sm:mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#626267] font-mono">
              Visual Archive
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h1 className="mb-5 text-6xl font-semibold tracking-[-0.05em] text-[#1d1d1f] sm:text-8xl">
            Gallery<span className="text-[#8c9385]">.</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-[#515154] sm:text-lg">
            Posters, visual identities, design artifacts, motion studies, and 3D renders. A curated exhibition of graphic and interaction craftsmanship.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#1d1d1f] text-white shadow-sm"
                      : "bg-[#f5f5f7] text-[#626267] hover:text-[#1d1d1f] hover:bg-[#e8e8ed]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </header>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 pb-20"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-neutral-100 border border-black/[0.08] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative w-full overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-300">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-semibold tracking-tight mt-0.5">
                      {item.title}
                    </h3>
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-white/90">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>View full size</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 sm:p-8"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close lightbox"
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl max-h-[75vh]">
                <img
                  src={selectedItem.src}
                  alt={selectedItem.title}
                  className="max-h-[75vh] w-auto object-contain"
                />
              </div>

              <div className="mt-4 text-center">
                <span className="text-xs uppercase font-mono tracking-wider text-emerald-400">
                  {selectedItem.category}
                </span>
                <h2 className="text-lg font-semibold text-white tracking-tight mt-1">
                  {selectedItem.title}
                </h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
