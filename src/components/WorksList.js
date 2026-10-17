"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Code,
  Briefcase,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Play,
  Wrench,
  Lock,
  X,
  Search,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

import { allWorks } from "@/data/works";
import { playPopSound, play8BitTapSound } from "./SoundEffects";
import RetroVideoPlayer from "./RetroVideoPlayer";

const CATEGORY_TABS = [
  { key: "All", label: "All", category: null },
  { key: "Project", label: "Projects", category: "Project" },
  { key: "Case Study", label: "Case Studies", category: "Case Study" },
  { key: "Open Source", label: "Open Source", category: "Open Source" },
  { key: "AI Videos", label: "AI Videos", category: "AI Videos" },
  { key: "Internal Tools", label: "Internal Tools", category: "Internal Tools" },
];

const CATEGORY_PRIORITY = {
  "AI Videos": 0,
  "Case Study": 1,
  "Open Source": 2,
  "Project": 3,
  "Internal Tools": 4,
};
const ITEMS_PER_PAGE = 12;

function VideoCardPreview({ work }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div 
      className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-950 border border-black/[0.06] group/video"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={work.videoSrc}
        poster={work.poster || work.image}
        loop
        muted
        playsInline
        preload="metadata"
        className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${work.isVertical ? "object-top" : ""}`}
      />

      {/* Frosted Play Glass Badge */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl transition-all duration-300 ${isPlaying ? "opacity-35 scale-90" : "opacity-100 group-hover/video:scale-110 group-hover/video:bg-black/65"}`}>
          <Play size={18} className="fill-white translate-x-0.5 sm:w-5 sm:h-5" />
        </div>
      </div>

      {/* Format badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-sans font-medium border border-white/15">
          {work.isVertical ? "9:16 Vertical" : "16:9 Widescreen"}
        </span>
      </div>
    </div>
  );
}

function CardPlaceholder({ category, tag }) {
  const getGradient = () => {
    switch (category) {
      case "Project":
        return "from-[#eef4ff] via-[#f5f8ff] to-[#e6effe]";
      case "Case Study":
        return "from-[#fef6ee] via-[#fffaf5] to-[#fdeddc]";
      case "Open Source":
        return "from-[#edfcf2] via-[#f6fdf9] to-[#e1f9ea]";
      case "Internal Tools":
        return "from-[#fff7ed] via-[#fffaf5] to-[#ffedd5]";
      default:
        return "from-[#f5f5f7] to-[#ececed]";
    }
  };

  const getIcon = () => {
    switch (category) {
      case "Case Study": return <BookOpen size={48} className="text-amber-500/15" />;
      case "Project": return <Briefcase size={48} className="text-blue-500/15" />;
      case "Open Source": return <Code size={48} className="text-emerald-500/15" />;
      case "Internal Tools": return <Wrench size={48} className="text-orange-500/15" />;
      default: return <Sparkles size={48} className="text-neutral-500/15" />;
    }
  };

  return (
    <div className={`relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br ${getGradient()} border border-black/[0.04] p-5 flex flex-col justify-between`}>
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}
      />
      <div className="relative z-10">
        <span className="text-[10px] font-sans font-semibold tracking-widest text-[#86868b] uppercase">
          {tag || category}
        </span>
      </div>
      <div className="absolute right-4 bottom-4 pointer-events-none">
        {getIcon()}
      </div>
    </div>
  );
}

const PREVIEW_W = 280;
const PREVIEW_H = 178;

function clampPreview(clientX, clientY) {
  const pad = 12;
  const vw = typeof window === "undefined" ? 1280 : window.innerWidth;
  const vh = typeof window === "undefined" ? 800 : window.innerHeight;
  let x = clientX + 26;
  let y = clientY - PREVIEW_H * 0.42;
  if (x + PREVIEW_W > vw - pad) x = clientX - PREVIEW_W - 26;
  x = Math.max(pad, Math.min(x, vw - PREVIEW_W - pad));
  y = Math.max(pad, Math.min(y, vh - PREVIEW_H - pad));
  return { x, y };
}

function AnimatedWorkRow({
  index,
  stagger,
  reduceMotion,
  direction,
  className,
  children,
  ...rest
}) {
  const delay = reduceMotion ? 0 : Math.min(index, 10) * stagger;
  return (
    <motion.div
      {...rest}
      className={className}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 16 * direction, filter: "blur(7px)" }
      }
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{
        opacity: 0,
        y: -8 * direction,
        filter: "blur(0px)",
        transition: { duration: 0.14, ease: [0.4, 0, 1, 1] },
      }}
      transition={
        reduceMotion
          ? { duration: 0.16 }
          : {
              y: { type: "spring", stiffness: 520, damping: 36, mass: 0.55, delay },
              opacity: { duration: 0.38, ease: [0.22, 1, 0.36, 1], delay },
              filter: { duration: 0.42, ease: [0.22, 1, 0.36, 1], delay },
            }
      }
    >
      {children}
    </motion.div>
  );
}

export default function WorksList() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [listDirection, setListDirection] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const previewPlaced = useRef(false);

  const [activeVideo, setActiveVideo] = useState(null);
  const [lockedTool, setLockedTool] = useState(null);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [isDesktop, setIsDesktop] = useState(null);

  // Hover preview state
  const [hoveredWork, setHoveredWork] = useState(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 460, damping: 34, mass: 0.45 });
  const springY = useSpring(mouseY, { stiffness: 460, damping: 34, mass: 0.45 });

  // One list in the tree once we know the viewport, so hidden rows are not announced twice.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsDesktop(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  // Shortcut key listener (press / or Cmd+K to focus search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync filter with URL hash (e.g. #ai-videos, #projects, #internal-tools, etc.)
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.toLowerCase();
      if (hash === "#ai-videos" || hash === "#aivideos" || hash === "#video" || hash === "#videos") {
        setFilter("AI Videos");
        setCurrentPage(1);
      } else if (hash === "#case-studies" || hash === "#casestudy") {
        setFilter("Case Study");
        setCurrentPage(1);
      } else if (hash === "#projects" || hash === "#project") {
        setFilter("Project");
        setCurrentPage(1);
      } else if (hash === "#open-source" || hash === "#opensource") {
        setFilter("Open Source");
        setCurrentPage(1);
      } else if (hash === "#internal-tools" || hash === "#internaltools" || hash === "#tools") {
        setFilter("Internal Tools");
        setCurrentPage(1);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Compute category counts
  const counts = {
    All: allWorks.length,
    Project: allWorks.filter((w) => w.category === "Project").length,
    "Case Study": allWorks.filter((w) => w.category === "Case Study").length,
    "Open Source": allWorks.filter((w) => w.category === "Open Source").length,
    "AI Videos": allWorks.filter((w) => w.category === "AI Videos").length,
    "Internal Tools": allWorks.filter((w) => w.category === "Internal Tools").length,
  };

  const sortedWorks = [...allWorks].sort(
    (a, b) => (CATEGORY_PRIORITY[a.category] ?? 99) - (CATEGORY_PRIORITY[b.category] ?? 99)
  );

  const filteredWorks = sortedWorks.filter((work) => {
    const matchesCategory = filter === "All" || work.category === filter;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const titleMatch = work.title?.toLowerCase().includes(q);
    const descMatch = work.description?.toLowerCase().includes(q);
    const tagMatch = work.tag?.toLowerCase().includes(q);
    const categoryMatch = work.category?.toLowerCase().includes(q);
    const tagsArrayMatch =
      Array.isArray(work.tags) && work.tags.some((t) => t.toLowerCase().includes(q));

    return titleMatch || descMatch || tagMatch || categoryMatch || tagsArrayMatch;
  });

  const totalPages = Math.ceil(filteredWorks.length / ITEMS_PER_PAGE);
  const validCurrentPage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredWorks.length);
  const paginatedWorks = filteredWorks.slice(startIndex, endIndex);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "AI Videos":
        return <Sparkles size={12} className="text-purple-600" />;
      case "Case Study":
        return <BookOpen size={12} className="text-amber-600" />;
      case "Project":
        return <Briefcase size={12} className="text-blue-600" />;
      case "Open Source":
        return <Code size={12} className="text-emerald-600" />;
      case "Internal Tools":
        return <Wrench size={12} className="text-orange-600" />;
      default:
        return null;
    }
  };

  const handleFilterClick = (tabKey) => {
    if (filter !== tabKey) {
      try {
        playPopSound(520, 0.08);
      } catch {}
      setListDirection(1);
      setHoveredWork(null);
      previewPlaced.current = false;
      setFilter(tabKey);
      setCurrentPage(1);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== validCurrentPage) {
      try {
        playPopSound(480, 0.08);
      } catch {}
      setListDirection(newPage > validCurrentPage ? 1 : -1);
      setHoveredWork(null);
      previewPlaced.current = false;
      setCurrentPage(newPage);
      const element = document.getElementById("collection");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPin(val);
    if (pinError) setPinError(false);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin.length === 6) {
      setPinError(true);
      setTimeout(() => setPin(""), 600);
    }
  };

  const openWork = (work) => {
    const isAIVideo = work.category === "AI Videos" || Boolean(work.videoSrc);
    const isInternal = work.category === "Internal Tools" || work.isInternal;
    const destinationHref = work.link?.startsWith("/works/case-studies/")
      ? work.link
      : isAIVideo
      ? `/works/${work.id}`
      : work.link?.startsWith("http")
      ? work.link
      : `/works/${work.id}`;

    if (isAIVideo) {
      try { playPopSound(600, 0.08); } catch {}
      setActiveVideo({
        src: work.videoSrc,
        poster: work.poster || work.image,
        title: work.title,
      });
      return;
    }
    if (isInternal) {
      try { playPopSound(500, 0.08); } catch {}
      setLockedTool(work);
      return;
    }
    try { playPopSound(520, 0.06); } catch {}
    if (destinationHref.startsWith("http")) {
      window.location.href = destinationHref;
    } else {
      router.push(destinationHref);
    }
  };

  const placePreview = (clientX, clientY) => {
    const point = clampPreview(clientX, clientY);
    if (!previewPlaced.current) {
      mouseX.jump(point.x);
      mouseY.jump(point.y);
      springX.jump(point.x);
      springY.jump(point.y);
      previewPlaced.current = true;
    } else {
      mouseX.set(point.x);
      mouseY.set(point.y);
    }
  };

  const stagger = searchQuery.trim() ? 0.018 : 0.046;

  return (
    <div id="ai-videos" className="w-full max-w-5xl mx-auto flex flex-col gap-6 sm:gap-8 pb-20 scroll-mt-28">
      {/* Category Segmented Control & Inline Search */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-[#f5f5f7] border border-black/[0.04] max-w-fit mx-auto mb-4 sm:mb-6 shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)]">
        {CATEGORY_TABS.map((tab) => {
          const isActive = filter === tab.key;
          const count = counts[tab.key] || 0;
          return (
            <motion.button
              key={tab.key}
              onClick={() => handleFilterClick(tab.key)}
              onMouseEnter={() => {
                try {
                  play8BitTapSound();
                } catch {}
              }}
              whileHover={{ scale: 1.03, y: -0.5 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 450, damping: 22 }}
              aria-pressed={isActive}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-sans font-medium transition-colors select-none ${
                isActive ? "text-[#1d1d1f]" : "text-[#86868b] hover:text-[#1d1d1f]"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterPill"
                  className="absolute inset-0 rounded-full bg-white shadow-sm border border-black/[0.04]"
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              <span
                className={`relative z-10 text-[10px] font-sans px-1.5 py-0.2 rounded-full transition-colors ${
                  isActive
                    ? "bg-black/[0.07] text-[#1d1d1f] font-semibold"
                    : "bg-black/[0.03] text-[#86868b]"
                }`}
              >
                {count}
              </span>
            </motion.button>
          );
        })}

        {/* Subtle Vertical Divider */}
        <div className="hidden sm:block h-5 w-[1px] bg-black/[0.08] mx-0.5" />

        {/* Inline Search Bar */}
        <div className="relative flex items-center rounded-full bg-white/70 focus-within:bg-white border border-black/[0.06] focus-within:border-black/[0.25] shadow-sm transition-all duration-300 w-36 sm:w-44 md:w-52 focus-within:sm:w-56 md:focus-within:w-64 h-8 px-2.5">
          <Search size={13} className="text-[#86868b] shrink-0 mr-1.5" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search..."
            className="w-full text-xs font-sans placeholder-[#86868b] text-[#1d1d1f] bg-transparent outline-none pr-4"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
                searchInputRef.current?.focus();
              }}
              className="absolute right-2 p-0.5 rounded-full text-[#86868b] hover:text-[#1d1d1f] transition-colors"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          ) : (
            <div className="absolute right-2 pointer-events-none hidden sm:flex items-center text-[10px] font-mono text-[#86868b] bg-[#f5f5f7] rounded px-1 py-0.2 border border-black/[0.04]">
              <span>/</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Result Feedback Indicator */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-between px-2 text-xs text-[#86868b] font-sans -mt-2 mb-1">
          <span>
            Found <strong className="text-[#1d1d1f] font-medium">{filteredWorks.length}</strong>{" "}
            {filteredWorks.length === 1 ? "result" : "results"} for &ldquo;{searchQuery}&rdquo;
            {filter !== "All" ? ` in ${filter}` : ""}
          </span>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setCurrentPage(1);
            }}
            className="text-[#0071e3] hover:underline font-medium"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Grid of Works or Empty State */}
      {filteredWorks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-[#f5f5f7]/60 border border-black/[0.04] my-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#86868b] mb-4 shadow-sm border border-black/[0.04]">
            <Search size={20} />
          </div>
          <h3 className="text-lg font-sans font-semibold text-[#1d1d1f] mb-1">
            No matching works found
          </h3>
          <p className="text-sm text-[#86868b] max-w-sm font-sans mb-5 leading-relaxed">
            We couldn&apos;t find anything matching &ldquo;{searchQuery}&rdquo;
            {filter !== "All" ? ` in ${filter}` : ""}. Try adjusting your keywords or clearing the category filter.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-[#1d1d1f] text-white rounded-full text-xs font-sans font-medium hover:bg-[#333336] transition-all shadow-sm"
              >
                Clear Search
              </button>
            )}
            {filter !== "All" && (
              <button
                type="button"
                onClick={() => {
                  setListDirection(1);
                  setFilter("All");
                }}
                className="px-4 py-2 bg-white text-[#1d1d1f] border border-black/[0.08] rounded-full text-xs font-sans font-medium hover:bg-[#f5f5f7] transition-all shadow-sm"
              >
                View All Works
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* ── Desktop list. Div rows, because table rows cannot transform. ── */}
          {(isDesktop === null || isDesktop) && <div
            className="hidden md:block rounded-2xl border border-black/[0.08] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden w-full"
            onMouseMove={(e) => placePreview(e.clientX, e.clientY)}
            onMouseLeave={() => {
              previewPlaced.current = false;
              setHoveredWork(null);
            }}
          >
            <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,0.8fr)_minmax(0,1.45fr)_auto] border-b border-black/[0.06] bg-[#fafafa]">
              {["Work", "Type", "Description", "Category"].map((label) => (
                <div
                  key={label}
                  className={`py-3.5 px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8e8e93] ${label === "Category" ? "text-right" : ""}`}
                >
                  {label}
                </div>
              ))}
            </div>
            <AnimatePresence mode="popLayout" initial>
              {paginatedWorks.map((work, index) => {
                const isAIVideo = work.category === "AI Videos" || Boolean(work.videoSrc);
                const isInternal = work.category === "Internal Tools" || work.isInternal;
                return (
                  <AnimatedWorkRow
                    key={work.id}
                    index={index}
                    stagger={stagger}
                    reduceMotion={!!reduceMotion}
                    direction={listDirection}
                    role="link"
                    tabIndex={0}
                    aria-label={work.title}
                    onMouseEnter={(e) => {
                      placePreview(e.clientX, e.clientY);
                      setHoveredWork(work);
                    }}
                    onClick={() => openWork(work)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openWork(work);
                      }
                    }}
                    className="group grid grid-cols-[minmax(0,1.35fr)_minmax(0,0.8fr)_minmax(0,1.45fr)_auto] border-b border-black/[0.05] last:border-b-0 cursor-pointer hover:bg-[#f5f5f7]/70"
                  >
                    <div className="py-4 px-6 min-w-0 flex items-center gap-2.5">
                      {isAIVideo && <Play size={11} className="text-purple-500 fill-purple-500 shrink-0" />}
                      {isInternal && <Lock size={11} className="text-orange-500 shrink-0" />}
                      <span className="font-semibold text-[13px] text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors line-clamp-1">
                        {work.title}
                      </span>
                    </div>
                    <div className="py-4 px-6 min-w-0 flex items-center">
                      <span className="text-[11px] font-mono text-[#6e6e73] truncate">
                        {work.tag || "—"}
                      </span>
                    </div>
                    <div className="py-4 px-6 min-w-0 flex items-center">
                      <span className="text-[13px] text-[#515154] line-clamp-1 font-sans">
                        {work.description}
                      </span>
                    </div>
                    <div className="py-4 px-6 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-[#515154] whitespace-nowrap">
                        {getCategoryIcon(work.category)}
                        {work.category}
                      </span>
                    </div>
                  </AnimatedWorkRow>
                );
              })}
            </AnimatePresence>
          </div>}

          {/* ── Mobile Stacked List ───────────────────────────────────── */}
          {(isDesktop === null || !isDesktop) && <div className="md:hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
            <AnimatePresence mode="popLayout" initial>
              {paginatedWorks.map((work, index) => {
                const isAIVideo = work.category === "AI Videos" || Boolean(work.videoSrc);
                const isInternal = work.category === "Internal Tools" || work.isInternal;
                return (
                  <AnimatedWorkRow
                    key={work.id}
                    index={index}
                    stagger={stagger}
                    reduceMotion={!!reduceMotion}
                    direction={listDirection}
                    role="link"
                    tabIndex={0}
                    aria-label={work.title}
                    className="flex items-start gap-3 px-4 py-3.5 cursor-pointer active:bg-[#f5f5f7] border-b border-black/[0.05] last:border-b-0"
                    onClick={() => openWork(work)}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#f5f5f7] border border-black/[0.05] shrink-0">
                      {work.image ? (
                        <Image src={work.image} alt="" fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getCategoryIcon(work.category) || <Sparkles size={18} className="text-neutral-400" />}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-semibold text-[13px] text-[#1d1d1f] truncate">{work.title}</span>
                        {isInternal && <Lock size={10} className="text-orange-500 shrink-0" />}
                        {isAIVideo && <Play size={10} className="text-purple-500 fill-purple-500 shrink-0" />}
                      </div>
                      <p className="text-[12px] text-[#86868b] truncate">{work.description}</p>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f5f5f7] border border-black/[0.04] text-[#515154]">
                      {getCategoryIcon(work.category)}
                      {work.category}
                    </span>
                  </AnimatedWorkRow>
                );
              })}
            </AnimatePresence>
          </div>}

          {/* ── Floating Hover Preview (desktop only) ─────────────────── */}
          <AnimatePresence>
            {hoveredWork && (
              <motion.div
                key="work-preview"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 540, damping: 36, mass: 0.55 }}
                className="fixed left-0 top-0 z-[60] pointer-events-none rounded-2xl overflow-hidden shadow-[0_20px_56px_rgba(0,0,0,0.18)] border border-black/[0.08] bg-[#f5f5f7] hidden md:block"
                style={{
                  width: PREVIEW_W,
                  height: PREVIEW_H,
                  x: springX,
                  y: springY,
                }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={hoveredWork.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {hoveredWork.videoSrc ? (
                      <video
                        src={hoveredWork.videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : hoveredWork.image ? (
                      <Image
                        src={hoveredWork.image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="280px"
                      />
                    ) : (
                      <CardPlaceholder category={hoveredWork.category} tag={hoveredWork.tag} />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 py-2.5">
                      <p className="text-white text-xs font-semibold truncate">{hoveredWork.title}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center gap-3 sm:mt-10 sm:gap-4">
          <p className="text-xs text-[#86868b] font-sans">
            Showing <span className="font-medium text-[#1d1d1f]">{startIndex + 1}</span>–
            <span className="font-medium text-[#1d1d1f]">{endIndex}</span> of{" "}
            <span className="font-medium text-[#1d1d1f]">{filteredWorks.length}</span> productions
          </p>

          <nav
            aria-label="Works pagination"
            className="inline-flex items-center gap-1 p-1 rounded-full bg-[#f5f5f7] border border-black/[0.04] shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)]"
          >
            {/* Previous Page */}
            <motion.button
              type="button"
              onClick={() => handlePageChange(validCurrentPage - 1)}
              disabled={validCurrentPage <= 1}
              aria-label="Previous page"
              onMouseEnter={() => {
                if (validCurrentPage > 1) {
                  try {
                    play8BitTapSound();
                  } catch {}
                }
              }}
              whileHover={validCurrentPage > 1 ? { scale: 1.06, y: -0.5 } : {}}
              whileTap={validCurrentPage > 1 ? { scale: 0.94 } : {}}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs transition-colors select-none ${
                validCurrentPage <= 1
                  ? "opacity-30 cursor-not-allowed text-[#86868b]"
                  : "text-[#1d1d1f] hover:bg-white hover:shadow-sm"
              }`}
            >
              <ChevronLeft size={16} />
            </motion.button>

            {/* Page Number Pills */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = pageNum === validCurrentPage;
              return (
                <motion.button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  onMouseEnter={() => {
                    try {
                      play8BitTapSound();
                    } catch {}
                  }}
                  whileHover={{ scale: 1.06, y: -0.5 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 450, damping: 20 }}
                  aria-label={`Page ${pageNum}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex h-8 min-w-8 sm:h-9 sm:min-w-9 items-center justify-center px-3 rounded-full text-xs sm:text-[13px] font-sans font-medium transition-colors select-none ${
                    isActive ? "text-[#1d1d1f]" : "text-[#86868b] hover:text-[#1d1d1f]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePagePill"
                      className="absolute inset-0 rounded-full bg-white shadow-sm border border-black/[0.04]"
                      transition={{ type: "spring", stiffness: 500, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{pageNum}</span>
                </motion.button>
              );
            })}

            {/* Next Page */}
            <motion.button
              type="button"
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage >= totalPages}
              aria-label="Next page"
              onMouseEnter={() => {
                if (validCurrentPage < totalPages) {
                  try {
                    play8BitTapSound();
                  } catch {}
                }
              }}
              whileHover={validCurrentPage < totalPages ? { scale: 1.06, y: -0.5 } : {}}
              whileTap={validCurrentPage < totalPages ? { scale: 0.94 } : {}}
              transition={{ type: "spring", stiffness: 450, damping: 20 }}
              className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs transition-colors select-none ${
                validCurrentPage >= totalPages
                  ? "opacity-30 cursor-not-allowed text-[#86868b]"
                  : "text-[#1d1d1f] hover:bg-white hover:shadow-sm"
              }`}
            >
              <ChevronRight size={16} />
            </motion.button>
          </nav>
        </div>
      )}

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <RetroVideoPlayer
            src={activeVideo.src}
            poster={activeVideo.poster}
            title={activeVideo.title}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>

      {/* Internal Tool PIN Modal */}
      <AnimatePresence>
        {lockedTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setLockedTool(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-black/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.12)] rounded-3xl p-6 sm:p-8 max-w-md w-[92vw] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLockedTool(null)}
                className="absolute top-5 right-5 text-[#86868b] hover:text-[#1d1d1f] transition-colors p-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] mb-4">
                  <Lock size={20} />
                </div>
                <h3 className="text-xl sm:text-2xl font-sans font-semibold text-[#1d1d1f] mb-1.5">
                  Restricted Access
                </h3>
                <p className="text-sm text-[#86868b] font-sans mb-6">
                  Enter the 6-digit access code to unlock{" "}
                  <span className="font-semibold text-[#1d1d1f]">{lockedTool.title}</span>.
                </p>

                <form onSubmit={handlePinSubmit} className="w-full flex flex-col items-center">
                  <div className="relative mb-6 w-full flex justify-center">
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      value={pin}
                      onChange={handlePinChange}
                      autoFocus
                      placeholder="••••••"
                      className={`w-48 text-center tracking-[0.5em] text-2xl font-mono py-2.5 bg-[#f5f5f7] rounded-xl border outline-none transition-all ${
                        pinError
                          ? "border-red-500 bg-red-50/50 animate-shake"
                          : "border-black/[0.08] focus:border-black/[0.3] focus:bg-white"
                      }`}
                    />
                  </div>

                  {pinError && (
                    <p className="text-xs text-red-500 font-sans mb-4">
                      Incorrect PIN. Access denied.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={pin.length !== 6}
                    className="w-full py-3 bg-[#1d1d1f] text-white rounded-full text-sm font-sans font-medium hover:bg-[#333336] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    Unlock Tool
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
