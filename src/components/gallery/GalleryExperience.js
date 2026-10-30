"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { galleryCategories, galleryWorks } from "@/data/galleryWorks";
import { useBlackHoleTransition } from "../BlackHoleTransition";

const CanvasGallery = dynamic(() => import("@/components/gallery/CanvasGallery"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center text-sm text-[#6e6e73]">
      Opening the archive…
    </div>
  ),
});

const categories = galleryCategories(galleryWorks);

export default function GalleryExperience() {
  const { navigate } = useBlackHoleTransition();
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
      // Nothing open: Esc leaves the gallery for home.
      if (!nav.selectedId) {
        if (!event.defaultPrevented) navigate("/");
        return;
      }
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
  }, [fullSize, nav.selectedId, navigate]);

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
      className="fixed inset-0 z-0 overflow-hidden bg-white text-[#1d1d1f]"
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
          background: "radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.03) 100%)",
        }}
      />

      <motion.header
        initial={false}
        animate={{ opacity: selected ? 0 : 1, y: selected ? -10 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute left-0 top-0 z-20 max-w-[640px] px-5 pt-24 sm:px-10 sm:pt-28"
      >
        {/* Set like the landing bio: a big tight name over small grey print. */}
        <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.045em] text-[#111111] sm:text-[44px] lg:text-[48px]" style={{ textShadow: "0 0 18px #fff, 0 0 36px #fff" }}>
          Gallery
        </h1>
        <p className="mt-4 max-w-md text-[13px] leading-[1.6] tracking-[-0.01em] text-[#6e6e73]" style={{ textShadow: "0 0 12px #fff, 0 0 24px #fff" }}>
          Posters, visual identities, design artifacts, motion studies, and 3D renders. Drag to move through the room.{" "}
          <span className="[@media(hover:none)]:hidden">Scroll to come closer.</span>
          <span className="hidden [@media(hover:none)]:inline">Pinch to come closer.</span>
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
                className={`rounded-full border px-4 py-2 text-xs font-medium tracking-[-0.01em] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors ${
                  isActive
                    ? "border-[#2ec4f0]/40 bg-[#2ec4f0]/10 text-[#0879a0]"
                    : "border-black/[0.08] bg-white text-[#6e6e73] hover:text-[#111111]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </motion.header>

      <div className="pointer-events-none absolute bottom-5 right-5 z-20 hidden text-[11px] tracking-wide text-[#6e6e73] sm:block" style={{ textShadow: "0 0 8px #fff, 0 0 16px #fff" }}>
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
            // Centred through motion's x: its transform would overwrite a translate class.
            style={{ x: "-50%" }}
            className="absolute bottom-4 left-1/2 z-30 w-[min(92vw,440px)] rounded-3xl border border-black/[0.06] bg-white/80 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:bottom-6 sm:p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium tracking-[-0.01em] text-[#0879a0]">
                  {selected.category}
                </p>
                <h2 className="mt-0.5 text-lg font-semibold tracking-[-0.03em] text-[#111111]">
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
            <p className="mt-2 text-[13px] leading-[1.6] tracking-[-0.01em] text-[#6e6e73]">
              {selected.description}
            </p>
            <div className="mt-4 flex items-center gap-2">
              {selected.src ? (
                <button
                  type="button"
                  onClick={openFullSize}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0879a0] px-4 py-2 text-xs font-medium text-white transition-[transform,background-color] hover:bg-[#065f7e] active:scale-[0.98]"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                  View full size
                </button>
              ) : null}
              <button
                type="button"
                onClick={dismiss}
                className="rounded-full px-3 py-2 text-xs font-medium text-[#6e6e73] transition-colors hover:text-[#111111]"
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
            className="absolute inset-0 z-40 flex items-center justify-center bg-white/90 p-4 backdrop-blur-xl sm:p-10"
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
                <p className="text-[11px] font-medium tracking-[-0.01em] text-[#0879a0]">
                  {selected.category}
                </p>
                <p className="mt-0.5 text-sm font-medium text-[#111111]">{selected.title}</p>
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
