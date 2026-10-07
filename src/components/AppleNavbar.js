"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronDown,
  X,
  FolderGit2,
  Video,
  User,
  Briefcase,
  Award,
  Image as ImageIcon,
  Mail,
  Sparkles,
  Gamepad2,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { playPopSound } from "./SoundEffects";

const primaryNav = [
  {
    key: "works",
    label: "Works",
    href: "/works",
    match: (path) =>
      path.startsWith("/works") ||
      path.startsWith("/case-studies") ||
      path.startsWith("/ai-videos"),
    subItems: [
      {
        label: "All Works",
        description: "Projects, case studies & design systems",
        href: "/works",
        icon: FolderGit2,
      },
      {
        label: "AI Videos",
        description: "Generative video direction & pipelines",
        href: "/works#ai-videos",
        icon: Video,
      },
    ],
  },
  {
    key: "about",
    label: "About",
    href: "/about",
    match: (path) =>
      path === "/about" || path === "/experience" || path === "/achievements",
    subItems: [
      {
        label: "About Me",
        description: "Bio, philosophy & design perspective",
        href: "/about",
        icon: User,
      },
      {
        label: "Two Truths & A Lie",
        description: "Interactive icebreaker trivia before the bio",
        href: "/about#two-truths",
        icon: Gamepad2,
      },
      {
        label: "Experience",
        description: "Career chronology & engineering impact",
        href: "/about#experience",
        icon: Briefcase,
      },
      {
        label: "Achievements",
        description: "Honors, hackathons & recognitions",
        href: "/about#achievements",
        icon: Award,
      },
    ],
  },
  {
    key: "gallery",
    label: "Gallery",
    href: "/gallery",
    match: (path) => path.startsWith("/gallery"),
    subItems: [
      {
        label: "Visual Archive",
        description: "Posters, branding, UI collages & 3D renders",
        href: "/gallery",
        icon: ImageIcon,
      },
    ],
  },
];

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/satyasainagubathula",
  },
  {
    name: "Medium",
    href: "https://hippogriff.medium.com",
  },
  {
    name: "GitHub",
    href: "https://github.com/nagubathula",
  },
];

export default function AppleNavbar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredNavKey, setHoveredNavKey] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Close expanded island on route change
  useEffect(() => {
    setIsExpanded(false);
    setHoveredNavKey(null);
  }, [pathname]);

  // Track window scroll for subtle island condensation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    if (!isExpanded && !hoveredNavKey) return;
    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsExpanded(false);
        setHoveredNavKey(null);
        try {
          playPopSound(440, 0.05);
        } catch {}
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isExpanded, hoveredNavKey]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
        setHoveredNavKey(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll on small screens when expanded
  useEffect(() => {
    if (isExpanded && window.innerWidth < 640) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    setHoveredNavKey(null);
    try {
      playPopSound(isExpanded ? 460 : 580, 0.05);
    } catch {}
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch {}
    }
  };

  const handleMouseEnterNav = (key) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredNavKey(key);
  };

  const handleMouseLeaveNav = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredNavKey(null);
    }, 220);
  };

  // Hide the navbar completely on the home page as requested
  const isHome = pathname === "/";
  if (isHome) {
    return null;
  }

  // Active label for compact mobile indicator
  const activeNavItem = primaryNav.find((item) => item.match(pathname));
  const activeLabel = activeNavItem?.label || "Explore";

  // Submenu for current desktop hover
  const activeHoverMenu = primaryNav.find(
    (item) => item.key === hoveredNavKey && item.subItems.length > 1
  );

  return (
    <div
      ref={containerRef}
      id="site-navbar"
      data-site-navbar="true"
      className="fixed top-3.5 sm:top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none"
      onMouseLeave={handleMouseLeaveNav}
    >
      <LayoutGroup id="apple-dynamic-island">
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 32,
            mass: 0.8,
          }}
          className={`relative bg-black/90 backdrop-blur-2xl text-white border border-white/[0.14] shadow-[0_16px_48px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-all ${
            isExpanded
              ? "w-[92vw] max-w-[440px] rounded-[32px] p-5 sm:p-6"
              : scrolled
              ? "rounded-full px-2.5 sm:px-3 py-1.5"
              : "rounded-full px-3 sm:px-3.5 py-1.5 sm:py-2"
          }`}
        >
          {/* ============================================================
              COMPACT ISLAND MODE (Desktop & Mobile Pill)
             ============================================================ */}
          {!isExpanded && (
            <motion.div
              layout="position"
              className="flex items-center gap-2 sm:gap-3"
            >
              {/* Left Island Accessory: Mini Avatar */}
              <Link
                href="/"
                data-nav-cluster="brand"
                className="group flex items-center gap-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40"
                aria-label="Satya Home"
              >
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-neutral-900 border border-white/20 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95">
                  <Image
                    src="/images/hero/SVG/vector-avatar.png"
                    alt="Satya Avatar"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover object-top"
                    priority
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-1 ring-black" />
                  </span>
                </div>

                <span className="text-sm font-semibold tracking-tight text-white group-hover:text-white/90">
                  satya
                </span>
              </Link>

              {/* Center Island Accessory: Works, About, Gallery */}
              <nav
                aria-label="Global"
                data-nav-cluster="nav"
                className="hidden md:flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08]"
              >
                {primaryNav.map((item) => {
                  const isActive = item.match(pathname);
                  const isHovered = hoveredNavKey === item.key;
                  return (
                    <div
                      key={item.key}
                      className="relative"
                      onMouseEnter={() => handleMouseEnterNav(item.key)}
                    >
                      <Link
                        href={item.href}
                        className={`relative px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-150 inline-flex items-center gap-1 ${
                          isActive
                            ? "text-white"
                            : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="island-active-pill"
                            transition={{
                              type: "spring",
                              stiffness: 450,
                              damping: 35,
                            }}
                            className="absolute inset-0 rounded-full bg-white/20 border border-white/20 shadow-sm"
                          />
                        )}
                        <span className="relative z-10">{item.label}</span>
                      </Link>
                    </div>
                  );
                })}
              </nav>

              {/* Mobile Active Page Capsule Indicator */}
              <div
                data-nav-cluster="mobile-pill"
                onClick={toggleExpand}
                className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-neutral-200 cursor-pointer active:scale-95 transition-transform"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{activeLabel}</span>
              </div>

              {/* Right Island Accessory: CTA & Dynamic Expand Trigger */}
              <div
                data-nav-cluster="cta"
                className="flex items-center gap-1.5 sm:gap-2 shrink-0"
              >
                {/* Desktop Let's Talk CTA */}
                <a
                  href="mailto:nagubathula.satyasai@gmail.com"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 active:scale-95 transition-all shadow-sm"
                >
                  <span>Let&apos;s Talk</span>
                  <ArrowUpRight className="w-3 h-3 opacity-80" aria-hidden="true" />
                </a>

                {/* Island Morph Toggle Button */}
                <button
                  type="button"
                  onClick={toggleExpand}
                  aria-expanded={isExpanded}
                  aria-label="Expand Dynamic Island navigation"
                  className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition-all active:scale-90"
                >
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ============================================================
              EXPANDED DYNAMIC ISLAND MODE (Fluid Morph Card)
             ============================================================ */}
          {isExpanded && (
            <motion.div
              layout="position"
              data-nav-cluster="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 w-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-neutral-900 border border-white/20 shrink-0">
                    <Image
                      src="/images/hero/SVG/vector-avatar.png"
                      alt="Satya Avatar"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white tracking-tight">
                      Satya Sai Nagubathula
                    </h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="text-[11px] text-emerald-400 font-medium">
                        Available for AI + Design Roles
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contract Button */}
                <button
                  type="button"
                  onClick={toggleExpand}
                  aria-label="Collapse Dynamic Island"
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grouped Navigation */}
              <div className="flex flex-col gap-3.5">
                {/* 1. Works Group */}
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 px-1 mb-1.5">
                    Works & AI Videos
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {primaryNav[0].subItems.map((sub) => {
                      const Icon = sub.icon;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setIsExpanded(false)}
                          className="group flex items-start gap-2.5 p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-all"
                        >
                          <div className="p-1.5 rounded-xl bg-white/10 text-white shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-white">
                                {sub.label}
                              </span>
                              <ArrowUpRight className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                            </div>
                            <p className="text-[11px] text-neutral-400 line-clamp-1">
                              {sub.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 2. About Group (About, Experience, Achievements) */}
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 px-1 mb-1.5">
                    About Satya
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {primaryNav[1].subItems.map((sub) => {
                      const Icon = sub.icon;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setIsExpanded(false)}
                          className="group flex flex-col gap-1.5 p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-all"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="p-1.5 rounded-xl bg-white/10 text-white group-hover:bg-white group-hover:text-black transition-colors">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <ArrowUpRight className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                          </div>
                          <span className="text-xs font-semibold text-white mt-1">
                            {sub.label}
                          </span>
                          <p className="text-[10px] text-neutral-400 line-clamp-1">
                            {sub.description}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Gallery Group */}
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 px-1 mb-1.5">
                    Visual Archive
                  </div>
                  <Link
                    href="/gallery"
                    onClick={() => setIsExpanded(false)}
                    className="group flex items-center justify-between p-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white/10 text-white group-hover:bg-white group-hover:text-black transition-colors">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white">
                          Gallery
                        </span>
                        <p className="text-[11px] text-neutral-400">
                          Posters, branding, UI/UX artifacts & 3D renders
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  </Link>
                </div>
              </div>

              {/* Actions & Socials */}
              <div className="pt-2 flex flex-col gap-2.5">
                <a
                  href="mailto:nagubathula.satyasai@gmail.com"
                  className="w-full py-2.5 px-4 rounded-2xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.98] transition-all shadow-md"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Let&apos;s Talk — nagubathula.satyasai@gmail.com</span>
                </a>

                {/* Social Capsules */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-neutral-400">
                  <span className="text-[11px] tracking-wider uppercase font-mono text-neutral-500">
                    Connect
                  </span>
                  <div className="flex items-center gap-2">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-[11px] text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
                      >
                        <span>{social.name}</span>
                        <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ============================================================
            DESKTOP HOVER DROPDOWN FOR WORKS & ABOUT
           ============================================================ */}
        <AnimatePresence>
          {!isExpanded && activeHoverMenu && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-black/95 backdrop-blur-2xl border border-white/15 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.5)] z-50 flex flex-col gap-1"
              onMouseEnter={() => handleMouseEnterNav(hoveredNavKey)}
              onMouseLeave={handleMouseLeaveNav}
            >
              {activeHoverMenu.subItems.map((sub) => {
                const Icon = sub.icon;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={() => setHoveredNavKey(null)}
                    className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-white/10 text-white shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">
                          {sub.label}
                        </span>
                        <ArrowUpRight className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                      </div>
                      <p className="text-[11px] text-neutral-400 line-clamp-1">
                        {sub.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}
