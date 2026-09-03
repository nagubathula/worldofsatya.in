"use client";

import { motion } from "framer-motion";

const topRow = [
  { id: 1, src: "/videos/1.webp", alt: "HVAC website", w: 800, h: 800 },
  { id: 2, src: "/gallery/uiux-collage.jpg", alt: "UI/UX design collage", w: 800, h: 450 },
  { id: 3, src: "/gallery/ugadi.jpg", alt: "Ugadi celebrations poster", w: 259, h: 367 },
  { id: 4, src: "/videos/2.webp", alt: "Car service website", w: 800, h: 800 },
  { id: 5, src: "/gallery/thumbnails.jpg", alt: "YouTube thumbnail designs", w: 800, h: 450 },
  { id: 6, src: "/gallery/mj-poster.jpg", alt: "Michael Jackson world tour poster", w: 558, h: 800 },
  { id: 7, src: "/videos/3.webp", alt: "Fashion website", w: 800, h: 800 },
  { id: 8, src: "/gallery/product-ads.jpg", alt: "Product advertisement posters", w: 800, h: 450 },
  { id: 9, src: "/videos/4.gif", alt: "Credit card design", w: 800, h: 800 },
];

const bottomRow = [
  { id: 10, src: "/videos/5.gif", alt: "AI product website", w: 800, h: 800 },
  { id: 11, src: "/gallery/satya-coin.jpg", alt: "Satya The Great coin render", w: 791, h: 800 },
  { id: 12, src: "/gallery/trip-south.jpg", alt: "Afrobeats festival poster", w: 579, h: 719 },
  { id: 13, src: "/videos/6.webp", alt: "Banking app", w: 800, h: 800 },
  { id: 14, src: "/gallery/combo-biryani.jpg", alt: "Biryani combo social post", w: 370, h: 370 },
  { id: 15, src: "/gallery/christmas-calendar.jpg", alt: "Christmas calendar design", w: 709, h: 800 },
  { id: 16, src: "/videos/7.webp", alt: "Creative agency website", w: 800, h: 800 },
  { id: 17, src: "/gallery/hardware-hacking.jpg", alt: "Hardware hacking workshop poster", w: 257, h: 366 },
  { id: 18, src: "/videos/8.webp", alt: "Mobile wallet app", w: 800, h: 800 },
];

const edgeFade = {
  maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
};

function GalleryRow({ items, direction = "left", duration = 45 }) {
  // Four copies + a one-copy-width (-25%) CSS loop = seamless infinite scroll with
  // enough track to cover wide viewports (2 copies run out past ~1300px).
  // CSS animation (vs framer) lets hover pause the row via .marquee-row.
  const doubled = [...items, ...items, ...items, ...items];

  return (
    <div className="marquee-row relative w-full flex overflow-hidden" style={edgeFade}>
      <div
        className={`flex items-center gap-4 sm:gap-6 shrink-0 pr-4 sm:pr-6 ${direction === "left" ? "marquee-left" : "marquee-right"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="relative h-44 sm:h-52 rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 border border-foreground/[0.04] bg-foreground/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(0,0,0,0.14)] hover:z-10"
          >
            <img
              src={item.src}
              alt={item.alt}
              width={item.w}
              height={item.h}
              loading="lazy"
              className="h-full w-auto object-cover"
              style={{ aspectRatio: `${item.w} / ${item.h}` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemAnim = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25, mass: 0.8 },
  },
};

export default function ScrollGallery() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full py-12 sm:py-20"
    >
      <motion.div variants={itemAnim} className="flex flex-col gap-4 sm:gap-6">
        <GalleryRow items={topRow} direction="left" duration={45} />
        <GalleryRow items={bottomRow} direction="right" duration={55} />
      </motion.div>
    </motion.section>
  );
}
