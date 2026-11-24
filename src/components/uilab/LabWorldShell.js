"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowUpRight, Search, Volume2, VolumeX } from "lucide-react";
import LabCommandModal from "./LabCommandModal";
import { isSoundEnabled, playTickSound, toggleSound } from "@/components/SoundEffects";
import { PIECE_META } from "@/data/uiLabMeta";
import { SPRING } from "@/lib/motion";

const NAV_LINKS = [
  { id: "specimens", label: "Specimens", href: "/ui" },
  { id: "notes", label: "Field Notes", href: "/ui/notes" },
  { id: "primitives", label: "Primitives", href: "/ui/primitives" },
];

function subscribeSound(callback) {
  window.addEventListener("portfolio-sound-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("portfolio-sound-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getActiveNav(pathname) {
  if (pathname === "/ui/notes" || pathname === "/notes") return "notes";
  if (pathname === "/ui/primitives" || pathname === "/primitives") return "primitives";
  return "specimens";
}

export default function LabWorldShell({ children }) {
  const pathname = usePathname();
  const [cmdOpen, setCmdOpen] = useState(false);
  const coordsRef = useRef(null);

  const soundOn = useSyncExternalStore(
    subscribeSound,
    () => isSoundEnabled(),
    () => true,
  );

  // Zero-re-render pointer coordinate readout in the top chassis bar.
  useEffect(() => {
    let rafId = 0;
    let x = 0;
    let y = 0;

    const flush = () => {
      rafId = 0;
      if (coordsRef.current) {
        coordsRef.current.textContent = `X ${String(Math.round(x)).padStart(4, "0")} · Y ${String(Math.round(y)).padStart(4, "0")}`;
      }
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!rafId) rafId = window.requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const activeNav = getActiveNav(pathname);

  return (
    <div
      data-ui-world="true"
      className="relative flex min-h-screen w-full flex-col text-ink antialiased"
    >
      {/* Autonomous World Top Bar */}
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-8">
          {/* Brand Mark */}
          <div className="flex items-center gap-4">
            <Link
              href="/ui"
              className="group flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
            >
              <span className="relative grid h-7 w-7 place-items-center rounded-lg border border-[#2ec4f0]/50 bg-white shadow-[0_2px_8px_rgba(46,196,240,0.16)]">
                <span className="h-2 w-2 rounded-full bg-[#2ec4f0]" />
              </span>
              <span className="font-labMono text-[11.5px] font-semibold tracking-[0.14em] text-ink">
                SATYA <span className="text-[#0879a0]">{"//"}</span> UI LABS
              </span>
            </Link>

            <span
              ref={coordsRef}
              aria-hidden="true"
              className="hidden border-l border-black/[0.08] pl-4 font-labMono text-[10.5px] tabular-nums text-ink-muted lg:inline-block"
            >
              X 0000 · Y 0000
            </span>
          </div>

          {/* Center Navigation */}
          <nav
            aria-label="UI Labs sections"
            className="hidden items-center gap-1 rounded-full border border-black/[0.06] bg-[#f5f5f7]/90 p-1 md:flex"
          >
            {NAV_LINKS.map((item) => {
              const active = activeNav === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="relative rounded-full px-3.5 py-1.5 font-labMono text-[11px] font-medium tracking-[0.04em] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
                >
                  {active && (
                    <motion.span
                      layoutId="lab-world-nav-pill"
                      transition={SPRING.pill}
                      className="absolute inset-0 rounded-full bg-white shadow-[0_1px_6px_rgba(0,0,0,0.08)]"
                    />
                  )}
                  <span className={`relative z-10 ${active ? "text-ink" : "text-ink-muted hover:text-ink"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls & Exit Portal */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playTickSound(1700, 0.04);
                setCmdOpen(true);
              }}
              aria-label="Search UI Labs (Command K)"
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 font-labMono text-[11px] text-ink-secondary shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[#f5f5f7] hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
            >
              <Search size={12.5} className="text-[#0879a0]" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="rounded border border-black/[0.08] bg-[#f5f5f7] px-1.5 py-0.5 text-[9.5px] text-ink-muted">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => toggleSound()}
              aria-label={soundOn ? "Mute sound effects" : "Unmute sound effects"}
              aria-pressed={soundOn}
              title="Toggle audio (M)"
              className="grid h-8 w-8 place-items-center rounded-full border border-black/[0.08] bg-white text-ink-secondary shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[#f5f5f7] hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
            >
              {soundOn ? <Volume2 size={14} className="text-[#0d8a38]" /> : <VolumeX size={14} className="text-ink-muted" />}
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 font-labMono text-[11px] font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[#f5f5f7] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
            >
              <span className="hidden sm:inline">worldofsatya.in</span>
              <span className="sm:hidden">Portfolio</span>
              <ArrowUpRight size={12.5} className="text-[#0879a0]" />
            </Link>
          </div>
        </div>

        {/* Mobile sub-nav strip */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-black/[0.05] px-4 py-2 md:hidden">
          {NAV_LINKS.map((item) => {
            const active = activeNav === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`shrink-0 rounded-full px-3 py-1 font-labMono text-[11px] ${
                  active ? "bg-ink text-white" : "text-ink-muted"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Page Body */}
      <div className="relative z-10 flex-1">{children}</div>

      {/* Autonomous World Footer */}
      <footer className="relative z-10 mt-20 border-t border-black/[0.08] bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="font-labMono text-[11.5px] font-semibold tracking-[0.14em] text-ink">
              SATYA <span className="text-[#0879a0]">{"//"}</span> UI LABS
            </p>
            <p className="mt-1.5 font-labMono text-[11px] text-ink-muted">
              {PIECE_META.length} live specimens · Autonomous design-engineering workbench by Satya Sai Nagubathula
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-labMono text-[11px] text-ink-muted">
            <Link href="/ui" className="hover:text-ink">
              Specimens
            </Link>
            <Link href="/ui/notes" className="hover:text-ink">
              Field Notes
            </Link>
            <Link href="/ui/primitives" className="hover:text-ink">
              Primitives
            </Link>
            <span aria-hidden="true" className="text-black/15">|</span>
            <Link href="/works" className="hover:text-[#0879a0]">
              Works ↗
            </Link>
            <Link href="/" className="hover:text-[#0879a0]">
              Main Portfolio ↗
            </Link>
          </div>
        </div>
      </footer>

      <LabCommandModal open={cmdOpen} onOpenChange={setCmdOpen} />
    </div>
  );
}
