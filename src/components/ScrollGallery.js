"use client";

import { motion, useReducedMotion } from "framer-motion";

const topRow = [
  { id: 1, src: "/videos/1.webp", alt: "HVAC website" },
  { id: 2, src: "/videos/2.webp", alt: "Car service website" },
  { id: 3, src: "/videos/3.webp", alt: "Fashion website" },
  { id: 4, src: "/videos/4.gif", alt: "Credit card design" },
];

const bottomRow = [
  { id: 5, src: "/videos/5.gif", alt: "AI product website" },
  { id: 6, src: "/videos/6.webp", alt: "Banking app" },
  { id: 7, src: "/videos/7.webp", alt: "Creative agency website" },
  { id: 8, src: "/videos/8.webp", alt: "Mobile wallet app" },
];

const edgeFade = {
  maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
};

function GalleryRow({ items, direction = "left", duration = 45 }) {
  const shouldReduceMotion = useReducedMotion();
  // Two copies + a -50% translate loop = seamless infinite scroll
  const doubled = [...items, ...items];
  const range = direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];

  return (
    <div className="relative w-full flex overflow-hidden" style={edgeFade}>
      <motion.div
        animate={shouldReduceMotion ? undefined : { x: range }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
        className="flex items-center gap-4 sm:gap-6 shrink-0 pr-4 sm:pr-6"
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.id}-${i}`}
            className="relative w-64 h-44 sm:w-80 sm:h-52 rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 border border-foreground/[0.04] bg-foreground/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>
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
      className="w-full border-t border-foreground/5 py-12 sm:py-20"
    >
      <motion.div variants={itemAnim} className="flex flex-col gap-4 sm:gap-6">
        <GalleryRow items={topRow} direction="left" duration={45} />
        <GalleryRow items={bottomRow} direction="right" duration={55} />
      </motion.div>
    </motion.section>
  );
}
