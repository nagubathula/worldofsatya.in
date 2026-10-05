"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
];

const secondaryLinks = [
  { href: "/experience", label: "Experience" },
  { href: "/achievements", label: "Achievements" },
];

export default function AppleNavbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Track window scroll for blur background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [mobileMenuOpen]);

  // Auto-close when resized to desktop viewport
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide the global top navbar completely on the home page (called after all hooks to respect Rules of Hooks)
  if (isHome) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-200 ${
          mobileMenuOpen
            ? "bg-[#fbfbfd]/90 backdrop-blur-2xl border-b border-black/[0.06] shadow-none pointer-events-auto"
            : isHome && !scrolled
            ? "bg-transparent border-b border-transparent shadow-none pointer-events-none"
            : "bg-[#fbfbfd]/80 backdrop-blur-2xl border-b border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.02)] pointer-events-auto"
        }`}
      >
        <div className={`w-full max-w-6xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4 ${isHome && !scrolled && !mobileMenuOpen ? "pointer-events-auto" : ""}`}>
          
          {/* Left Side: Brand & Context */}
          <div data-nav-cluster="brand" className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!isHome && (
              <>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e8e8ed] transition-all active:scale-95"
                  title="Return to Home"
                >
                  <ArrowLeft size={13} aria-hidden="true" />
                  <span className="hidden xs:inline">Home</span>
                </Link>
                <div className="w-[1px] h-3.5 bg-black/[0.08]" aria-hidden="true" />
              </>
            )}

            {/* Modern Wordmark */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base sm:text-lg font-sans font-semibold tracking-tight text-[#1d1d1f] hover:opacity-75 transition-opacity flex items-center"
            >
              <span>satya</span>
            </Link>

            <span className="hidden md:inline font-sans text-[11px] font-medium text-[#86868b] tracking-wider ml-1 pl-3 border-l border-black/[0.08] uppercase">
              Design Technologist
            </span>
          </div>

          {/* Center: Desktop Navigation Links (macOS style segmented pill) */}
          <nav data-nav-cluster="pill" className="hidden lg:flex items-center gap-0.5 p-1 rounded-full bg-[#f5f5f7]/90 border border-black/[0.05] shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)] backdrop-blur-md">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? "bg-white text-[#1d1d1f] shadow-sm"
                      : "text-[#86868b] hover:text-[#1d1d1f] hover:bg-white/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side: Talk CTA & Mobile Toggle */}
          <div data-nav-cluster="cta" className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Let's Talk CTA */}
            <a
              href="mailto:nagubathula.satyasai@gmail.com"
              className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#1d1d1f] text-white text-xs font-sans font-medium hover:bg-[#333336] transition-all shadow-sm active:scale-95"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="w-3 h-3 opacity-70" aria-hidden="true" />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-full border border-black/[0.08] bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all active:scale-95"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* Modern Full-Screen Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 lg:hidden w-full h-[100dvh] bg-[#fbfbfd]/95 backdrop-blur-2xl flex flex-col pointer-events-auto pt-16 overflow-hidden"
          >
            <div className="flex-1 w-full flex flex-col justify-between px-6 py-6 overflow-y-auto">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] text-xs font-sans text-[#86868b] uppercase tracking-wider">
                  <span>Navigation</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Available</span>
                  </span>
                </div>

                {/* Primary Nav Links */}
                <div className="flex flex-col gap-1.5">
                  {navLinks.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-sans font-medium transition-all ${
                          isActive
                            ? "bg-[#1d1d1f] text-white shadow-sm"
                            : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]"
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive ? (
                          <span className="text-xs text-neutral-300 font-normal">Active</span>
                        ) : (
                          <ArrowUpRight size={16} className="opacity-40" />
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Secondary Explore Links */}
                <div className="pt-3 border-t border-black/[0.06]">
                  <div className="text-xs font-sans text-[#86868b] uppercase tracking-wider mb-2">
                    More
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {secondaryLinks.map((sec) => {
                      const isActive = pathname === sec.href;
                      return (
                        <Link
                          key={sec.href}
                          href={sec.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`text-center py-2.5 px-2 rounded-xl text-xs font-sans font-medium transition-all ${
                            isActive
                              ? "bg-[#1d1d1f] text-white"
                              : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] border border-black/[0.04]"
                          }`}
                        >
                          {sec.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Let's Talk CTA */}
                <div className="pt-2">
                  <a
                    href="mailto:nagubathula.satyasai@gmail.com"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-[#1d1d1f] text-white text-sm font-sans font-medium shadow-sm active:scale-[0.99]"
                  >
                    <span>Let&apos;s Talk</span>
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>

              {/* Bottom Footer Section */}
              <div className="pt-6 border-t border-neutral-100 flex flex-col gap-3">
                <div className="flex items-center justify-center gap-6 text-xs font-sans text-neutral-500">
                  <a
                    href="https://www.linkedin.com/in/satyasainagubathula"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-900 transition-colors flex items-center gap-1"
                  >
                    LinkedIn <ArrowUpRight size={12} className="opacity-60" />
                  </a>
                  <span>•</span>
                  <a
                    href="https://hippogriff.medium.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-900 transition-colors flex items-center gap-1"
                  >
                    Medium <ArrowUpRight size={12} className="opacity-60" />
                  </a>
                </div>

                <div className="text-[11px] font-sans text-neutral-400 text-center tracking-wider uppercase">
                  Design Technologist &amp; AI Engineer
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
