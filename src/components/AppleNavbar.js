"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Volume2, VolumeX, Tv } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { isSoundEnabled, toggleSound, play8BitBlipSound } from "@/components/SoundEffects";
import RetroRainbowRibbon from "@/components/RetroRainbowRibbon";

const navLinks = [
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/ai-videos", label: "AI Videos" },
  { href: "/open-source", label: "Open Source" },
];

const secondaryLinks = [
  { href: "/experience", label: "Experience" },
  { href: "/internal-tools", label: "Internal Tools" },
  { href: "/achievements", label: "Achievements" },
];

export default function AppleNavbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [soundOn, setSoundOn] = useState(true);
  const [scanlinesOn, setScanlinesOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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

  useEffect(() => {
    setSoundOn(isSoundEnabled());

    try {
      const storedScanlines = localStorage.getItem("portfolio-crt-v2");
      if (storedScanlines === "false") {
        setScanlinesOn(false);
      }
    } catch {}

    const handleSoundChange = (e) => {
      setSoundOn(e.detail);
    };

    window.addEventListener("portfolio-sound-change", handleSoundChange);
    return () => window.removeEventListener("portfolio-sound-change", handleSoundChange);
  }, []);

  const handleToggleSound = () => {
    const next = toggleSound();
    setSoundOn(next);
  };

  const handleToggleScanlines = () => {
    const next = !scanlinesOn;
    setScanlinesOn(next);
    try {
      localStorage.setItem("portfolio-crt-v2", next ? "true" : "false");
    } catch {}
    window.dispatchEvent(new CustomEvent("toggle-scanlines", { detail: next }));
    play8BitBlipSound(440);
  };

  const handleToggleMenu = () => {
    const next = !mobileMenuOpen;
    setMobileMenuOpen(next);
    play8BitBlipSound(next ? 520 : 380);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full pt-2.5 sm:pt-3 2xl:pt-4 transition-colors duration-200 ${
          mobileMenuOpen
            ? "bg-[#f4ebd8] border-b border-[#3e3832]/20 shadow-none pointer-events-auto"
            : isHome
            ? "nav-home bg-transparent border-b border-transparent shadow-none pointer-events-none"
            : "nav-solid bg-[#f4ebd8] border-b-2 border-[#3e3832]/20 shadow-[0_2px_8px_rgba(62,56,50,0.08)] pointer-events-auto"
        }`}
      >
        <div className={`w-full px-3 sm:px-10 lg:px-14 2xl:px-24 py-2.5 sm:py-3.5 2xl:py-5 flex items-center justify-between gap-2 sm:gap-4 ${isHome || mobileMenuOpen ? "pointer-events-auto" : ""}`}>
          
          {/* Left Side: Brand & Context */}
          <div className="nav-left flex items-center gap-1.5 sm:gap-2 shrink-0 transition-transform duration-300">
            {!isHome && (
              <>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 2xl:px-4 2xl:py-1.5 rounded-sm text-xs 2xl:text-sm font-pixel tracking-wider text-[#3e3832] hover:bg-[#3e3832]/[0.08] transition-all border-2 border-[#3e3832]/30 shadow-[2px_2px_0px_rgba(62,56,50,0.15)] active:translate-x-[1px] active:translate-y-[1px]"
                  title="Return to Home"
                >
                  <ArrowLeft size={13} aria-hidden="true" />
                  <span className="hidden xs:inline">HOME</span>
                </Link>
                <div className="w-[1px] h-3.5 2xl:h-5 bg-[#3e3832]/20" aria-hidden="true" />
              </>
            )}

            {/* Wordmark with Apple 6-stripe Rainbow Badge */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[16px] sm:text-[19px] 2xl:text-2xl font-editorial font-semibold tracking-tight text-[#3e3832] hover:opacity-80 transition-opacity flex items-center gap-1.5"
            >
              <div className="flex flex-col w-3.5 h-3.5 2xl:w-4 2xl:h-4 rounded-[2px] overflow-hidden border border-[#3e3832]/30 shadow-[1px_1px_0px_rgba(62,56,50,0.15)] shrink-0" aria-hidden="true">
                <span className="w-full flex-1 bg-[#4aa3df]" />
                <span className="w-full flex-1 bg-[#5cb88f]" />
                <span className="w-full flex-1 bg-[#f2c14e]" />
                <span className="w-full flex-1 bg-[#f28e2b]" />
                <span className="w-full flex-1 bg-[#e54b4b]" />
                <span className="w-full flex-1 bg-[#8e5ba5]" />
              </div>
              <span>satya<span className="text-[#c2410c] font-pixel text-xl 2xl:text-2xl font-bold">.</span></span>
            </Link>

            <span className="hidden md:inline font-pixel text-xs 2xl:text-sm text-[#3e3832]/50 tracking-wider ml-1 pl-2.5 2xl:pl-3.5 border-l border-[#3e3832]/20">
              DESIGN TECHNOLOGIST
            </span>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="nav-center hidden lg:flex items-center gap-1 sm:gap-1.5 2xl:gap-3 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-transform duration-300">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 2xl:px-5 py-1 2xl:py-2 rounded-sm text-xs sm:text-[13px] 2xl:text-base whitespace-nowrap font-pixel tracking-wider transition-all duration-100 ${
                    isActive
                      ? "bg-[#3e3832] text-[#f4ebd8] border-2 border-[#3e3832] shadow-[2px_2px_0px_rgba(62,56,50,0.3)]"
                      : "text-[#3e3832]/75 hover:text-[#3e3832] hover:bg-[#3e3832]/[0.08] border-2 border-transparent hover:border-[#3e3832]/20"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side: Retro Controls & Mobile Toggle */}
          <div className="nav-right flex items-center gap-1.5 sm:gap-2 2xl:gap-3 shrink-0 transition-transform duration-300">
            {/* Sound Effects Toggle */}
            <button
              onClick={handleToggleSound}
              className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 2xl:w-11 2xl:h-11 rounded-sm border-2 transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                soundOn
                  ? "text-[#c2410c] bg-[#c2410c]/10 border-[#c2410c] shadow-[2px_2px_0px_rgba(194,65,12,0.25)] hover:bg-[#c2410c]/20"
                  : "text-[#3e3832]/40 border-[#3e3832]/25 shadow-[2px_2px_0px_rgba(62,56,50,0.12)] hover:text-[#3e3832] hover:bg-[#3e3832]/[0.06]"
              }`}
              aria-label={soundOn ? "Mute 8-bit sound effects" : "Enable 8-bit sound effects"}
              title={soundOn ? "8-Bit Sound: Enabled" : "8-Bit Sound: Muted"}
            >
              {soundOn ? <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 2xl:w-5 2xl:h-5" /> : <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 2xl:w-5 2xl:h-5" />}
            </button>

            {/* CRT Noise / Curved Screen Toggle */}
            <button
              onClick={handleToggleScanlines}
              className={`relative inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 2xl:w-11 2xl:h-11 rounded-sm border-2 transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                scanlinesOn
                  ? "text-[#0f766e] bg-[#0f766e]/10 border-[#0f766e] shadow-[2px_2px_0px_rgba(15,118,110,0.25)] hover:bg-[#0f766e]/20"
                  : "text-[#3e3832]/40 border-[#3e3832]/25 shadow-[2px_2px_0px_rgba(62,56,50,0.12)] hover:text-[#3e3832] hover:bg-[#3e3832]/[0.06]"
              }`}
              aria-label={scanlinesOn ? "CRT Curved Screen: Enabled" : "CRT Curved Screen: Disabled"}
              title={scanlinesOn ? "CRT Curved Screen: ON (Click to toggle)" : "CRT Curved Screen: OFF (Click to toggle)"}
            >
              <Tv className="w-3 h-3 sm:w-3.5 sm:h-3.5 2xl:w-5 2xl:h-5" />
              {scanlinesOn && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_4px_#22c55e]" aria-hidden="true" />
              )}
            </button>

            {/* Desktop Let's Talk CTA */}
            <a
              href="mailto:nagubathula.satyasai@gmail.com"
              className="hidden sm:inline-flex items-center gap-1.5 2xl:gap-2 px-3 sm:px-3.5 2xl:px-6 py-1 sm:py-1.5 2xl:py-2.5 rounded-sm border-2 border-[#3e3832] bg-[#3e3832] text-[#f4ebd8] text-xs 2xl:text-sm font-pixel tracking-wider hover:opacity-95 transition-all shadow-[3px_3px_0px_rgba(62,56,50,0.3)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(62,56,50,0.3)]"
            >
              <span className="text-[13px] 2xl:text-base leading-none">☎</span> TALK <ArrowUpRight className="w-3 h-3 2xl:w-4 2xl:h-4" aria-hidden="true" />
            </a>

            {/* Retro Mobile Menu Toggle Button */}
            <button
              onClick={handleToggleMenu}
              className={`lg:hidden inline-flex items-center gap-1 px-2.5 py-1 rounded-sm border-2 font-pixel text-xs tracking-wider transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                mobileMenuOpen
                  ? "bg-[#3e3832] text-[#f4ebd8] border-[#3e3832] shadow-[2px_2px_0px_rgba(62,56,50,0.3)]"
                  : "bg-[#3e3832]/5 text-[#3e3832] border-[#3e3832]/30 shadow-[2px_2px_0px_rgba(62,56,50,0.15)] hover:bg-[#3e3832]/10"
              }`}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? "✕" : "☰ MENU"}
            </button>
          </div>
        </div>
      </header>

      {/* Retro Full-Screen Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-40 lg:hidden w-full h-[100dvh] bg-[#f4ebd8] flex flex-col pointer-events-auto pt-[62px] sm:pt-[72px] overflow-hidden"
          >
            <div className="flex-1 w-full flex flex-col justify-between px-4 sm:px-8 py-3 pb-8 overflow-y-auto overscroll-contain">
              {/* Directory Status Header */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#3e3832]/15 text-[11px] font-pixel text-[#3e3832]/60 tracking-wider">
                  <span>// SYSTEM DIRECTORY</span>
                  <span className="flex items-center gap-1.5 text-[#0f766e]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                    <span>ONLINE</span>
                  </span>
                </div>

                {/* Primary Nav Links */}
                <div className="flex flex-col gap-2">
                  {navLinks.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          play8BitBlipSound(480);
                        }}
                        className={`flex items-center justify-between px-4 py-3 rounded-sm text-sm sm:text-base font-pixel tracking-wider border-2 transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                          isActive
                            ? "bg-[#3e3832] text-[#f4ebd8] border-[#3e3832] shadow-[2px_2px_0px_rgba(62,56,50,0.3)]"
                            : "bg-[#fcf8f0] text-[#3e3832] border-[#3e3832]/25 shadow-[2px_2px_0px_rgba(62,56,50,0.12)] hover:bg-[#3e3832]/[0.06]"
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive ? (
                          <span className="text-[10px] text-[#f2c14e] font-bold">● ACTIVE</span>
                        ) : (
                          <ArrowUpRight size={15} className="opacity-45" />
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* Secondary Explore Links */}
                <div className="pt-2 border-t border-[#3e3832]/15 mt-0.5">
                  <div className="text-[10px] font-pixel text-[#3e3832]/50 tracking-wider uppercase mb-1.5">
                    More Sections
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {secondaryLinks.map((sec) => {
                      const isActive = pathname === sec.href;
                      return (
                        <Link
                          key={sec.href}
                          href={sec.href}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            play8BitBlipSound(480);
                          }}
                          className={`text-center py-2 px-1 rounded-sm text-[11px] font-pixel tracking-wider border transition-all active:translate-x-[1px] active:translate-y-[1px] ${
                            isActive
                              ? "bg-[#3e3832] text-[#f4ebd8] border-[#3e3832]"
                              : "bg-[#fcf8f0] text-[#3e3832]/80 border-[#3e3832]/20 hover:border-[#3e3832]/40"
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
                    onClick={() => play8BitBlipSound(580)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm border-2 border-[#3e3832] bg-[#3e3832] text-[#f4ebd8] text-sm font-pixel tracking-wider shadow-[3px_3px_0px_rgba(62,56,50,0.3)] active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    <span>☎ LET&apos;S TALK</span>
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>

              {/* Bottom Footer Section */}
              <div className="mt-6 pt-3 flex flex-col gap-3">
                {/* 6-Stripe Apple / Polaroid Retro Rainbow Ribbon */}
                <RetroRainbowRibbon className="w-full rounded-[2px]" />

                {/* Social Links */}
                <div className="flex items-center justify-center gap-6 text-xs font-pixel text-[#3e3832]/75 px-0.5">
                  <a
                    href="https://www.linkedin.com/in/satyasainagubathula"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#3e3832] flex items-center gap-1"
                  >
                    LinkedIn <ArrowUpRight size={11} className="opacity-50" />
                  </a>
                  <span className="text-[#3e3832]/30" aria-hidden="true">•</span>
                  <a
                    href="https://hippogriff.medium.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#3e3832] flex items-center gap-1"
                  >
                    Medium <ArrowUpRight size={11} className="opacity-50" />
                  </a>
                </div>

                <div className="text-[10px] font-pixel text-[#3e3832]/45 text-center tracking-wider">
                  DESIGN TECHNOLOGIST &amp; AI ENGINEER
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
