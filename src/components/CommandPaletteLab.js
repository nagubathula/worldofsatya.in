"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Code2,
  Command,
  Copy,
  Eye,
  FilePlus2,
  Hash,
  Palette,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { playPopSound, playTickSound, playTingSound } from "./SoundEffects";
import { SPRING } from "@/lib/motion";

const ACCENTS = [
  { id: "violet", label: "Violet", hex: "#5b4cf0", keywords: "purple indigo primary" },
  { id: "cyan", label: "Cyan", hex: "#0879a0", keywords: "blue ocean teal" },
  { id: "emerald", label: "Emerald", hex: "#0d8a38", keywords: "green billjot mint" },
  { id: "amber", label: "Amber", hex: "#d97706", keywords: "orange warm gold" },
  { id: "crimson", label: "Crimson", hex: "#e11d48", keywords: "red rose pink" },
];

const APPEARANCES = [
  { id: "paper", label: "Warm Paper", bg: "bg-[#f7f6f3]", badge: "#F7F6F3", keywords: "cream ivory warm" },
  { id: "slate", label: "Soft Slate", bg: "bg-[#f2f4f7]", badge: "#F2F4F7", keywords: "cool gray grey" },
  { id: "white", label: "Pure White", bg: "bg-[#ffffff]", badge: "#FFFFFF", keywords: "clean bright minimal" },
];

const JUMP_TARGETS = [
  { id: "jump-badges", label: "01 Badges on lanyards", target: "id-badge", keywords: "webgl rope lanyard 3d" },
  { id: "jump-buttons", label: "02 Buttons that answer back", target: "buttons", keywords: "switch hold download copy" },
  { id: "jump-layout", label: "03 Things that move into place", target: "layout", keywords: "tabs reorder toast card" },
  { id: "jump-type", label: "04 Letters, numbers, light", target: "type", keywords: "scramble odometer gooey slider" },
  { id: "jump-sensors", label: "05 Tilt it, shake it", target: "sensors", keywords: "gyroscope accelerometer dice" },
];

function fuzzyMatch(query, label, keywords = "") {
  const q = query.trim().toLowerCase();
  if (!q) return { score: 0, indices: [] };

  const target = label.toLowerCase();
  let qi = 0;
  let score = 0;
  let lastMatch = -2;
  const indices = [];

  for (let ti = 0; ti < target.length && qi < q.length; ti++) {
    if (target[ti] === q[qi]) {
      indices.push(ti);
      if (ti === 0) score += 10;
      else if (/[\s\-_…›0-9]/.test(target[ti - 1])) score += 8;
      if (ti === lastMatch + 1) score += 6;
      else score += 1;
      lastMatch = ti;
      qi++;
    }
  }

  if (qi === q.length) {
    return { score: score + 20, indices };
  }

  // Fall back to keyword matching if label alone didn't consume the query.
  const combined = `${label} ${keywords}`.toLowerCase();
  let ci = 0;
  let kwScore = 0;
  for (let i = 0; i < combined.length && ci < q.length; i++) {
    if (combined[i] === q[ci]) {
      kwScore += 2;
      ci++;
    }
  }
  if (ci === q.length) {
    return { score: kwScore, indices: [] };
  }
  return null;
}

function HighlightedLabel({ text, indices, accentHex }) {
  if (!indices || indices.length === 0) return <>{text}</>;
  const set = new Set(indices);
  return (
    <>
      {text.split("").map((ch, idx) =>
        set.has(idx) ? (
          <span key={idx} style={{ color: accentHex }} className="font-semibold">
            {ch}
          </span>
        ) : (
          <span key={idx}>{ch}</span>
        ),
      )}
    </>
  );
}

export default function CommandPaletteLab({ reduceMotion = false }) {
  const uid = useId();
  const stageRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [menuStack, setMenuStack] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [accentId, setAccentId] = useState("violet");
  const [appearanceId, setAppearanceId] = useState("paper");
  const [focusMode, setFocusMode] = useState(false);
  const [status, setStatus] = useState("Type to filter, ↑↓ to move, ↵ to run");

  const accent = ACCENTS.find((a) => a.id === accentId) || ACCENTS[0];
  const appearance = APPEARANCES.find((a) => a.id === appearanceId) || APPEARANCES[0];

  const notify = useCallback((msg) => {
    setStatus(msg);
  }, []);

  const rootCommands = useMemo(() => {
    return [
      {
        id: "new-draft",
        label: "New Markdown draft",
        subtitle: "Opens a fresh untitled buffer",
        shortcut: "⌘N",
        keywords: "file document write create",
        icon: FilePlus2,
        run: () => {
          playPopSound(660, 0.08);
          notify("Created untitled.md draft");
        },
      },
      {
        id: "focus-mode",
        label: "Toggle focus mode",
        subtitle: focusMode ? "Active · chrome dimmed" : "Inactive",
        shortcut: "⌘⇧F",
        keywords: "zen typewriter quiet dim",
        icon: Eye,
        run: () => {
          setFocusMode((v) => {
            const next = !v;
            playTickSound(next ? 1800 : 1200, 0.05);
            notify(next ? "Focus mode enabled" : "Focus mode disabled");
            return next;
          });
        },
      },
      {
        id: "export-jsx",
        label: "Export selection as JSX",
        subtitle: "Tailwind utility classes ready",
        shortcut: "⌘⇧E",
        keywords: "code react component tailwind",
        icon: Code2,
        run: () => {
          playTingSound(1568, 0.05);
          notify("Copied <CommandPalette /> JSX snippet");
        },
      },
      {
        id: "copy-url",
        label: "Copy page URL",
        subtitle: "worldofsatya.in/ui#command-palette",
        shortcut: "⌘⇧C",
        keywords: "link share clipboard",
        icon: Copy,
        run: () => {
          try {
            navigator.clipboard?.writeText("https://worldofsatya.in/ui#command-palette");
          } catch {}
          playTingSound(2093, 0.045);
          notify("Copied link to clipboard");
        },
      },
      {
        id: "menu-accent",
        label: "Accent color…",
        subtitle: accent.label,
        swatch: accent.hex,
        keywords: "theme tint swatch highlight",
        icon: Palette,
        children: ACCENTS.map((item) => ({
          id: `accent-${item.id}`,
          label: item.label,
          parentLabel: "Accent color",
          swatch: item.hex,
          selected: item.id === accentId,
          keywords: item.keywords,
          run: () => {
            setAccentId(item.id);
            playPopSound(700, 0.08);
            notify(`Accent switched to ${item.label}`);
          },
        })),
      },
      {
        id: "menu-appearance",
        label: "Appearance…",
        subtitle: appearance.label,
        keywords: "surface paper canvas background",
        icon: Sun,
        children: APPEARANCES.map((item) => ({
          id: `appearance-${item.id}`,
          label: item.label,
          parentLabel: "Appearance",
          subtitle: item.badge,
          selected: item.id === appearanceId,
          keywords: item.keywords,
          run: () => {
            setAppearanceId(item.id);
            playPopSound(620, 0.08);
            notify(`Canvas set to ${item.label}`);
          },
        })),
      },
      {
        id: "menu-jump",
        label: "Jump to lab piece…",
        subtitle: `${JUMP_TARGETS.length} sections`,
        keywords: "scroll navigate goto",
        icon: Hash,
        children: JUMP_TARGETS.map((item) => ({
          id: item.id,
          label: item.label,
          parentLabel: "Jump",
          keywords: item.keywords,
          run: () => {
            playTickSound(1700, 0.05);
            const target = document.getElementById(item.target);
            if (target) {
              target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
            }
            notify(`Jumped to ${item.label}`);
          },
        })),
      },
    ];
  }, [accent.hex, accent.label, accentId, appearance.label, appearanceId, focusMode, notify, reduceMotion]);

  const currentMenu = menuStack[menuStack.length - 1] || null;

  // Build visible list: at root with a non-empty query, include nested leaves so search works from root.
  const visibleItems = useMemo(() => {
    const q = query.trim();
    if (currentMenu) {
      const parent = rootCommands.find((c) => c.id === currentMenu.id);
      const list = parent?.children || [];
      if (!q) return list.map((item) => ({ item, score: 0, indices: [] }));
      return list
        .map((item) => {
          const match = fuzzyMatch(q, item.label, item.keywords);
          return match ? { item, ...match } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score);
    }

    if (!q) {
      return rootCommands.map((item) => ({ item, score: 0, indices: [] }));
    }

    const pool = [];
    for (const cmd of rootCommands) {
      pool.push(cmd);
      if (cmd.children) {
        for (const child of cmd.children) {
          pool.push({
            ...child,
            label: `${child.parentLabel} › ${child.label}`,
          });
        }
      }
    }

    return pool
      .map((item) => {
        const match = fuzzyMatch(q, item.label, item.keywords);
        return match ? { item, ...match } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);
  }, [currentMenu, query, rootCommands]);

  const clampedIndex = visibleItems.length ? Math.min(activeIndex, visibleItems.length - 1) : 0;

  const executeItem = useCallback(
    (entry) => {
      if (!entry) return;
      const { item } = entry;
      if (item.children) {
        setMenuStack((prev) => [...prev, { id: item.id, label: item.label.replace(/…$/, "") }]);
        setQuery("");
        setActiveIndex(0);
        playTickSound(1600, 0.045);
        inputRef.current?.focus();
        return;
      }
      item.run?.();
    },
    [],
  );

  // Global ⌘K / Ctrl+K listener summons the palette and brings it into view.
  useEffect(() => {
    const onGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        if (document.querySelector("[aria-modal='true']")) return;
        e.preventDefault();
        setOpen(true);
        playPopSound(680, 0.07);
        stageRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        window.setTimeout(() => inputRef.current?.focus(), 60);
      }
    };
    window.addEventListener("keydown", onGlobalKey);
    return () => window.removeEventListener("keydown", onGlobalKey);
  }, [reduceMotion]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!visibleItems.length) return;
      setActiveIndex((i) => (i + 1) % visibleItems.length);
      playTickSound(1500, 0.03);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!visibleItems.length) return;
      setActiveIndex((i) => (i - 1 + visibleItems.length) % visibleItems.length);
      playTickSound(1400, 0.03);
    } else if (e.key === "Enter") {
      e.preventDefault();
      executeItem(visibleItems[clampedIndex]);
    } else if (e.key === "Backspace" && query === "" && menuStack.length > 0) {
      e.preventDefault();
      setMenuStack((prev) => prev.slice(0, -1));
      setActiveIndex(0);
      playTickSound(1200, 0.035);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      if (query) {
        setQuery("");
        setActiveIndex(0);
      } else if (menuStack.length > 0) {
        setMenuStack((prev) => prev.slice(0, -1));
        setActiveIndex(0);
      } else {
        setOpen(false);
      }
      playTickSound(1100, 0.035);
    }
  };

  return (
    <div
      ref={stageRef}
      className={`relative flex min-h-[430px] w-full flex-col items-center justify-center p-4 transition-colors duration-300 sm:p-8 ${appearance.bg}`}
    >
      {/* Subtle ambient grid inside the workspace preview */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {focusMode && (
        <div className="pointer-events-none absolute inset-0 bg-black/[0.04] backdrop-blur-[1px] transition-opacity" />
      )}

      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="palette"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 6 }}
            transition={SPRING.enter}
            role="region"
            aria-label="Command palette demo"
            className="relative z-10 w-full max-w-[490px] overflow-hidden rounded-2xl border border-black/[0.09] bg-white/95 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.18)] backdrop-blur-xl"
          >
            {/* Input row */}
            <div className="flex items-center gap-2.5 border-b border-black/[0.06] px-4 py-3">
              {menuStack.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setMenuStack((prev) => prev.slice(0, -1));
                    setQuery("");
                    setActiveIndex(0);
                    inputRef.current?.focus();
                  }}
                  aria-label="Back to root commands"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-black/[0.05] text-ink-secondary transition-colors hover:bg-black/[0.09] hover:text-ink"
                >
                  <ArrowLeft size={13} />
                </button>
              ) : (
                <Search size={15} className="shrink-0 text-ink-muted" />
              )}

              {currentMenu && (
                <span
                  className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium"
                  style={{ backgroundColor: `${accent.hex}18`, color: accent.hex }}
                >
                  {currentMenu.label}
                </span>
              )}

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={currentMenu ? `Filter ${currentMenu.label.toLowerCase()}…` : "Type a command or search nested settings…"}
                aria-label="Command search"
                className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink placeholder:text-ink-muted outline-none"
              />

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 rounded-md border border-black/[0.08] bg-[#f5f5f7] px-1.5 py-0.5 font-mono text-[10px] text-ink-muted transition-colors hover:text-ink"
              >
                ESC
              </button>
            </div>

            {/* Command list */}
            <ul
              ref={listRef}
              role="listbox"
              aria-label="Commands"
              className="max-h-[268px] overflow-y-auto p-1.5"
            >
              {visibleItems.length === 0 ? (
                <li className="py-10 text-center text-[13px] text-ink-muted">
                  No commands matching &ldquo;{query}&rdquo;
                </li>
              ) : (
                visibleItems.map((entry, idx) => {
                  const { item, indices } = entry;
                  const active = idx === clampedIndex;
                  const Icon = item.icon;
                  return (
                    <li key={item.id} role="option" aria-selected={active} className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => executeItem(entry)}
                        className="relative flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-[13px] outline-none"
                      >
                        {active && (
                          <motion.span
                            layoutId={`${uid}-highlight`}
                            transition={SPRING.pill}
                            className="absolute inset-0 rounded-xl bg-black/[0.05]"
                          />
                        )}
                        <span className="relative z-10 flex min-w-0 items-center gap-2.5">
                          {item.swatch ? (
                            <span
                              className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/15"
                              style={{ backgroundColor: item.swatch }}
                            />
                          ) : Icon ? (
                            <Icon size={14} style={active ? { color: accent.hex } : undefined} className={active ? "" : "text-ink-muted"} />
                          ) : (
                            <Sparkles size={14} className="text-ink-muted" />
                          )}
                          <span className="truncate font-medium text-ink">
                            <HighlightedLabel text={item.label} indices={indices} accentHex={accent.hex} />
                          </span>
                          {item.subtitle && (
                            <span className="hidden truncate text-[11.5px] text-ink-muted sm:inline">
                              {item.subtitle}
                            </span>
                          )}
                        </span>
                        <span className="relative z-10 flex shrink-0 items-center gap-1.5">
                          {item.selected && <Check size={13} style={{ color: accent.hex }} />}
                          {item.shortcut && (
                            <kbd className="rounded bg-black/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
                              {item.shortcut}
                            </kbd>
                          )}
                          {item.children && <ChevronRight size={13} className="text-ink-muted" />}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            {/* Footer status bar */}
            <div className="flex items-center justify-between border-t border-black/[0.06] bg-[#fafafa]/80 px-4 py-2 text-[11px] text-ink-muted">
              <span className="flex items-center gap-1.5 truncate">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent.hex }} />
                <span className="truncate">{status}</span>
              </span>
              <span className="hidden shrink-0 font-mono text-[10px] sm:inline">⌘K</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="launcher"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={SPRING.press}
            className="relative z-10 flex flex-col items-center gap-3"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                playPopSound(660, 0.08);
                window.setTimeout(() => inputRef.current?.focus(), 60);
              }}
              className="flex items-center gap-2.5 rounded-full border border-black/[0.09] bg-white px-5 py-2.5 text-[13.5px] font-medium text-ink shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              <Command size={14} style={{ color: accent.hex }} />
              <span>Summon command palette</span>
              <kbd className="rounded-md bg-[#f5f5f7] px-1.5 py-0.5 font-mono text-[11px] text-ink-muted">⌘K</kbd>
            </button>
            <p className="text-[12px] text-ink-muted">{status}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
