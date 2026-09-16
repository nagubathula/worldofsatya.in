"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const navLinks = [
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/ai-videos", label: "AI Videos" },
  { href: "/open-source", label: "Open Source" },
];

export default function AppleNavbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-4 z-40 w-full flex items-center justify-center px-4 py-2 pointer-events-none">
      <div className="pointer-events-auto inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-background/80 backdrop-blur-2xl border border-foreground/[0.08] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.06)] transition-all duration-200">
        
        {/* If inner page, show sleek back button */}
        {!isHome && (
          <>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/[0.06] transition-colors"
              title="Return to Home"
            >
              <ArrowLeft size={13} aria-hidden="true" />
              <span className="hidden xs:inline">Home</span>
            </Link>
            <div className="w-[1px] h-3.5 bg-foreground/10 mx-0.5" aria-hidden="true" />
          </>
        )}

        {/* Wordmark */}
        <Link
          href="/"
          className="text-[15px] sm:text-[16px] font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity px-1 sm:px-2 flex items-center"
        >
          satya<span className="text-blue-500">.</span>
        </Link>

        <div className="w-[1px] h-3.5 bg-foreground/10 mx-0.5" aria-hidden="true" />

        {/* Navigation Links */}
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-[13px] font-medium transition-all duration-180 ${
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "text-foreground/60 hover:text-foreground hover:bg-foreground/[0.05]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="w-[1px] h-3.5 bg-foreground/10 mx-0.5" aria-hidden="true" />

        <button
          onClick={toggleTheme}
          className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-foreground/60 hover:text-foreground hover:bg-foreground/[0.06] transition-all"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {/* Let's Talk CTA */}
        <a
          href="mailto:nagubathula.satyasai@gmail.com"
          className="hidden sm:inline-flex items-center gap-1.5 ml-1 px-3 py-1 rounded-full bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
        >
          Let’s talk <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
