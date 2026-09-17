"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Volume2, VolumeX, Tv } from "lucide-react";
import { isSoundEnabled, toggleSound, play8BitBlipSound } from "@/components/SoundEffects";

const navLinks = [
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/ai-videos", label: "AI Videos" },
  { href: "/open-source", label: "Open Source" },
];

export default function AppleNavbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [soundOn, setSoundOn] = useState(true);
  const [scanlinesOn, setScanlinesOn] = useState(true);

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent border-b border-transparent shadow-none pointer-events-none">
      <div className="w-full px-6 sm:px-10 lg:px-14 2xl:px-24 py-3 sm:py-3.5 2xl:py-5 flex items-center justify-between gap-4 pointer-events-auto">
        
        {/* Left Side: Brand & Context */}
        <div className="nav-left flex items-center gap-2 shrink-0 transition-transform duration-300">
          {!isHome && (
            <>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 2xl:px-4 2xl:py-1.5 rounded-sm text-xs 2xl:text-sm font-pixel tracking-wider text-[#3e3832] hover:bg-[#3e3832]/[0.08] transition-all border-2 border-[#3e3832]/30 shadow-[2px_2px_0px_rgba(62,56,50,0.15)] active:translate-x-[1px] active:translate-y-[1px]"
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
            className="text-[17px] sm:text-[19px] 2xl:text-2xl font-editorial font-semibold tracking-tight text-[#3e3832] hover:opacity-80 transition-opacity flex items-center gap-1.5"
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

        {/* Center: Navigation Links */}
        <nav className="nav-center flex items-center gap-1 sm:gap-1.5 2xl:gap-3 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden transition-transform duration-300">
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

        {/* Right Side: Retro Controls & CTA */}
        <div className="nav-right flex items-center gap-1.5 sm:gap-2 2xl:gap-3 shrink-0 transition-transform duration-300">
          {/* Sound Effects Toggle */}
          <button
            onClick={handleToggleSound}
            className={`inline-flex items-center justify-center w-8 h-8 2xl:w-11 2xl:h-11 rounded-sm border-2 transition-all active:translate-x-[1px] active:translate-y-[1px] ${
              soundOn
                ? "text-[#c2410c] bg-[#c2410c]/10 border-[#c2410c] shadow-[2px_2px_0px_rgba(194,65,12,0.25)] hover:bg-[#c2410c]/20"
                : "text-[#3e3832]/40 border-[#3e3832]/25 shadow-[2px_2px_0px_rgba(62,56,50,0.12)] hover:text-[#3e3832] hover:bg-[#3e3832]/[0.06]"
            }`}
            aria-label={soundOn ? "Mute 8-bit sound effects" : "Enable 8-bit sound effects"}
            title={soundOn ? "8-Bit Sound: Enabled" : "8-Bit Sound: Muted"}
          >
            {soundOn ? <Volume2 className="w-3.5 h-3.5 2xl:w-5 2xl:h-5" /> : <VolumeX className="w-3.5 h-3.5 2xl:w-5 2xl:h-5" />}
          </button>

          {/* CRT Scanlines / Curved Screen Toggle */}
          <button
            onClick={handleToggleScanlines}
            className={`relative inline-flex items-center justify-center w-8 h-8 2xl:w-11 2xl:h-11 rounded-sm border-2 transition-all active:translate-x-[1px] active:translate-y-[1px] ${
              scanlinesOn
                ? "text-[#0f766e] bg-[#0f766e]/10 border-[#0f766e] shadow-[2px_2px_0px_rgba(15,118,110,0.25)] hover:bg-[#0f766e]/20"
                : "text-[#3e3832]/40 border-[#3e3832]/25 shadow-[2px_2px_0px_rgba(62,56,50,0.12)] hover:text-[#3e3832] hover:bg-[#3e3832]/[0.06]"
            }`}
            aria-label={scanlinesOn ? "CRT Curved Screen: Enabled" : "CRT Curved Screen: Disabled"}
            title={scanlinesOn ? "CRT Curved Screen: ON (Click to toggle)" : "CRT Curved Screen: OFF (Click to toggle)"}
          >
            <Tv className="w-3.5 h-3.5 2xl:w-5 2xl:h-5" />
            {scanlinesOn && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_4px_#22c55e]" aria-hidden="true" />
            )}
          </button>

          {/* Let's Talk CTA */}
          <a
            href="mailto:nagubathula.satyasai@gmail.com"
            className="hidden sm:inline-flex items-center gap-1.5 2xl:gap-2 px-3.5 2xl:px-6 py-1.5 2xl:py-2.5 rounded-sm border-2 border-[#3e3832] bg-[#3e3832] text-[#f4ebd8] text-xs 2xl:text-sm font-pixel tracking-wider hover:opacity-95 transition-all shadow-[3px_3px_0px_rgba(62,56,50,0.3)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_rgba(62,56,50,0.3)]"
          >
            <span className="text-[13px] 2xl:text-base leading-none">☎</span> TALK <ArrowUpRight className="w-3 h-3 2xl:w-4 2xl:h-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
