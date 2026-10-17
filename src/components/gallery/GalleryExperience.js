"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { galleryCategories, galleryWorks } from "@/data/galleryWorks";

const CanvasGallery = dynamic(() => import("@/components/gallery/CanvasGallery"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center text-sm text-[#86868b]">
      Opening the archive…
    </div>
  ),
});

const categories = galleryCategories(galleryWorks);

export default function GalleryExperience() {
  const [nav, setNav] = useState({
    type: "frame",
    category: "All",
    selectedId: null,
    controlsEnabled: true,
    token: 0,
  });
  const [fullSize, setFullSize] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const selected = useMemo(
    () => galleryWorks.find((work) => work.id === nav.selectedId) || null,
    [nav.selectedId],
  );

  const visibleCount = nav.category === "All"
    ? galleryWorks.length
    : galleryWorks.filter((work) => work.category === nav.category).length;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      if (fullSize) {
        setFullSize(false);
        setNav((current) => ({ ...current, controlsEnabled: true }));
        return;
      }
      if (!nav.selectedId) return;
      setNav((current) => ({
        ...current,
        type: "restore",
        selectedId: null,
        controlsEnabled: true,
        token: current.token + 1,
      }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullSize, nav.selectedId]);

  const selectCategory = (category) => {
    setFullSize(false);
    setNav((current) => ({
      type: "frame",
      category,
      selectedId: null,
      controlsEnabled: true,
      token: current.token + 1,
    }));
  };

  const selectWork = (id) => {
    setFullSize(false);
    setNav((current) => ({
      ...current,
      type: "focus",
      selectedId: id,
      controlsEnabled: true,
      token: current.token + 1,
    }));
  };

  const dismiss = () => {
    setFullSize(false);
    setNav((current) => {
      if (!current.selectedId) return current;
      return {
        ...current,
        type: "restore",
        selectedId: null,
        controlsEnabled: true,
        token: current.token + 1,
      };
    });
  };

  const userNavigate = () => {
    setFullSize(false);
    setNav((current) => {
      if (!current.selectedId) return current;
      return {
        ...current,
        type: "keep",
        selectedId: null,
        controlsEnabled: true,
        token: current.token + 1,
      };
    });
  };

  const openFullSize = () => {
    if (!selected?.src) return;
    setFullSize(true);
    setNav((current) => ({ ...current, controlsEnabled: false }));
  };

  return (
    <div
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
      className="fixed inset-0 z-0 overflow-hidden bg-[#f7f6f3] text-[#1d1d1f]"
    >
      <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
        <CanvasGallery
          nav={nav}
          reduceMotion={reduceMotion}
          onSelect={selectWork}
          onDismiss={dismiss}
          onUserNavigate={userNavigate}
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(28, 27, 24, 0.045) 100%)",
        }}
      />

      <motion.header
        initial={false}
        animate={{ opacity: selected ? 0 : 1, y: selected ? -10 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute left-0 top-0 z-20 max-w-[640px] px-5 pt-20 sm:px-10 sm:pt-24"
      >
        <div className="mb-3 flex items-center gap-2" style={{ textShadow: "0 0 12px #f7f6f3" }}>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#626267]">
            Visual Archive
          </span>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        </div>
        <h1 className="text-5xl font-semibold tracking-[-0.05em] text-[#1d1d1f] sm:text-7xl lg:text-8xl" style={{ textShadow: "0 0 18px #f7f6f3, 0 0 36px #f7f6f3" }}>
          Gallery<span className="text-[#8c9385]">.</span>
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#515154] sm:text-base" style={{ textShadow: "0 0 12px #f7f6f3, 0 0 24px #f7f6f3" }}>
          Posters, visual identities, design artifacts, motion studies, and 3D renders. Drag to move through the room. Scroll to come closer.
        </p>
        <div className={`mt-5 flex flex-wrap gap-2 ${selected ? "pointer-events-none" : "pointer-events-auto"}`}>
          {categories.map((category) => {
            const isActive = nav.category === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => selectCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#1d1d1f] text-white shadow-sm"
                    : "border border-black/[0.06] bg-white text-[#626267] shadow-sm hover:bg-[#f3f3f5] hover:text-[#1d1d1f]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </motion.header>

      <div className="pointer-events-none absolute bottom-5 right-5 z-20 hidden text-[11px] tracking-wide text-[#86868b] sm:block" style={{ textShadow: "0 0 8px #f7f6f3, 0 0 16px #f7f6f3" }}>
        {selected ? "Esc to return" : `${visibleCount} works · Drag · Scroll · Click`}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.aside
            key={selected.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-4 left-1/2 z-30 w-[min(92vw,440px)] -translate-x-1/2 rounded-3xl border border-black/[0.06] bg-white/80 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:bottom-6 sm:p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8c9385]">
                  {selected.category}
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                  {selected.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Back to the archive"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black/[0.04] text-[#1d1d1f] transition-colors hover:bg-black/[0.08]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#515154]">
              {selected.description}
            </p>
            <div className="mt-4 flex items-center gap-2">
              {selected.src ? (
                <button
                  type="button"
                  onClick={openFullSize}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1d1d1f] px-4 py-2 text-xs font-medium text-white transition-transform active:scale-[0.98]"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                  View full size
                </button>
              ) : null}
              <button
                type="button"
                onClick={dismiss}
                className="rounded-full px-3 py-2 text-xs font-medium text-[#626267] transition-colors hover:text-[#1d1d1f]"
              >
                Back
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fullSize && selected?.src && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-[#f7f6f3]/88 p-4 backdrop-blur-xl sm:p-10"
            onClick={() => {
              setFullSize(false);
              setNav((current) => ({ ...current, controlsEnabled: true }));
            }}
          >
            <motion.figure
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative flex max-h-full max-w-5xl flex-col items-center"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close full size"
                onClick={() => {
                  setFullSize(false);
                  setNav((current) => ({ ...current, controlsEnabled: true }));
                }}
                className="absolute -top-12 right-0 grid h-9 w-9 place-items-center rounded-full bg-white text-[#1d1d1f] shadow-sm"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={selected.src}
                alt={selected.title}
                className="max-h-[78vh] w-auto rounded-2xl border border-black/[0.06] object-contain shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
              />
              <figcaption className="mt-4 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#8c9385]">
                  {selected.category}
                </p>
                <p className="mt-1 text-sm font-medium text-[#1d1d1f]">{selected.title}</p>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="sr-only">
        Spatial gallery of {galleryWorks.length} works. Drag to pan, scroll or pinch to zoom, click a work to view it. Press Escape to return.
      </p>
    </div>
  );
}
