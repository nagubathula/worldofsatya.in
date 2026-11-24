"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { playTickSound, playPopSound } from "@/components/SoundEffects";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { id: "now", label: "about" },
  { id: "projects", label: "works" },
  { id: "showcase", label: "showcase" },
  { id: "artifacts", label: "artifacts" },
  { id: "contact", label: "contact" },
];

export default function FloatingNavPill() {
  const lenis = useLenis();
  const pillRef = useRef(null);
  const [activeSection, setActiveSection] = useState("now");
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const pill = pillRef.current;
    if (!pill) return;

    // Entrance animation once user scrolls past hero
    const showAnim = gsap.fromTo(
      pill,
      { y: 50, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "power2.out",
        paused: true,
      }
    );

    ScrollTrigger.create({
      start: "220px top",
      onEnter: () => showAnim.play(),
      onLeaveBack: () => showAnim.reverse(),
    });

    // ScrollSpy for sections
    const triggers = NAV_LINKS.map((link) => {
      const el = document.getElementById(link.id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) setActiveSection(link.id);
        },
      });
    }).filter(Boolean);

    return () => {
      showAnim.kill();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    try {
      if (soundEnabled) playTickSound();
    } catch {}
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -60 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) {
        try {
          playPopSound(540, 0.1);
        } catch {}
      }
      return next;
    });
  };

  return (
    <nav
      ref={pillRef}
      aria-label="Floating Navigation Bar"
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 select-none opacity-0 will-change-transform sm:bottom-7"
    >
      <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#121314]/90 px-3.5 py-2 text-white shadow-[0_20px_45px_-10px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl sm:gap-2.5 sm:px-4 sm:py-2">
        {NAV_LINKS.map((link) => {
          const isActive = activeSection === link.id;
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={scrollTo(link.id)}
              className={`relative rounded-full px-3 py-1 text-[13px] font-medium tracking-tight transition-all duration-200 sm:text-[13.5px] ${
                isActive
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/55 hover:text-white/90 hover:bg-white/5"
              }`}
            >
              {link.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0.5 left-1/2 h-[3px] w-3 -translate-x-1/2 rounded-full bg-[#2ec4f0]"
                />
              )}
            </a>
          );
        })}

        {/* Vertical divider */}
        <span aria-hidden="true" className="mx-1 h-3.5 w-px bg-white/15" />

        {/* Sound toggle pill */}
        <button
          type="button"
          onClick={toggleSound}
          title={soundEnabled ? "Mute audio cues" : "Enable audio cues"}
          aria-label={soundEnabled ? "Mute audio cues" : "Enable audio cues"}
          aria-pressed={soundEnabled}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          {soundEnabled ? (
            <span className="flex items-end gap-[2px] h-3">
              <span className="w-[2px] h-full bg-[#2ec4f0] rounded-full animate-pulse" />
              <span className="w-[2px] h-2 bg-[#2ec4f0] rounded-full animate-pulse delay-75" />
              <span className="w-[2px] h-2.5 bg-[#2ec4f0] rounded-full animate-pulse delay-150" />
            </span>
          ) : (
            <span className="text-[12px] text-white/35">✕</span>
          )}
        </button>
      </div>
    </nav>
  );
}
