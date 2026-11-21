"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Box, Cpu, Search, Volume2, X } from "lucide-react";
import { PIECE_META } from "@/data/uiLabMeta";
import { UI_LAB_NOTES } from "@/data/uiLabNotes";
import { UI_LAB_PRIMITIVES } from "@/data/uiLabPrimitives";
import { playTickSound, toggleSound } from "@/components/SoundEffects";
import { smoothNavigate, SPRING, EASE_OUT } from "@/lib/motion";

function fuzzyScore(query, text) {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const target = text.toLowerCase();
  let qi = 0;
  let score = 0;
  let last = -2;
  for (let ti = 0; ti < target.length && qi < q.length; ti++) {
    if (target[ti] === q[qi]) {
      score += ti === 0 ? 10 : /[\s/\-_]/.test(target[ti - 1]) ? 8 : 1;
      if (ti === last + 1) score += 6;
      last = ti;
      qi++;
    }
  }
  return qi === q.length ? score : -1;
}

export default function LabCommandModal({ open, onOpenChange }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const openModal = useCallback(() => {
    setQuery("");
    setActiveIdx(0);
    onOpenChange(true);
    playTickSound(1700, 0.04);
  }, [onOpenChange]);

  const closeModal = useCallback(() => {
    onOpenChange(false);
    playTickSound(1300, 0.035);
  }, [onOpenChange]);

  useEffect(() => {
    const onGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        // Respect the Command Palette specimen demo when the user is actively interacting inside it.
        const active = document.activeElement;
        if (active instanceof Element && active.closest('[data-piece-id="command-palette"]')) {
          return;
        }
        e.preventDefault();
        if (open) closeModal();
        else openModal();
      }
    };
    window.addEventListener("keydown", onGlobalKey);
    return () => window.removeEventListener("keydown", onGlobalKey);
  }, [open, openModal, closeModal]);

  useEffect(() => {
    if (!open) return undefined;
    const id = window.setTimeout(() => inputRef.current?.focus(), 20);
    return () => window.clearTimeout(id);
  }, [open]);

  const allItems = useMemo(() => {
    const specimens = PIECE_META.map((p, i) => ({
      id: `spec-${p.id}`,
      group: "Specimens",
      title: p.title,
      meta: `${String(i + 1).padStart(2, "0")} · ${p.category}`,
      searchText: `${p.title} ${p.shortTitle} ${p.category} ${p.tags.join(" ")}`,
      icon: Cpu,
      href: `/ui/${p.id}`,
    }));

    const notes = UI_LAB_NOTES.map((n) => ({
      id: `note-${n.id}`,
      group: "Field Notes",
      title: n.title,
      meta: `Note ${n.num} · ${n.readTime}`,
      searchText: `${n.title} ${n.subtitle} ${n.tags.join(" ")}`,
      icon: BookOpen,
      href: `/ui/notes#${n.id}`,
    }));

    const primitives = UI_LAB_PRIMITIVES.map((pr) => ({
      id: `prim-${pr.id}`,
      group: "Primitives",
      title: pr.name,
      meta: `${pr.category} · ${pr.sizeLabel}`,
      searchText: `${pr.name} ${pr.category} ${pr.description}`,
      icon: Box,
      href: `/ui/primitives#${pr.id}`,
    }));

    const actions = [
      {
        id: "act-sound",
        group: "Lab Controls",
        title: "Toggle Synthesized Sound Effects",
        meta: "Shortcut M",
        searchText: "sound audio mute unmute volume",
        icon: Volume2,
        action: () => toggleSound(),
      },
      {
        id: "act-home",
        group: "Portal",
        title: "Return to Portfolio (worldofsatya.in)",
        meta: "Main Site",
        searchText: "home portfolio exit worldofsatya",
        icon: ArrowUpRight,
        href: "/",
      },
    ];

    return [...specimens, ...notes, ...primitives, ...actions];
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return allItems;
    return allItems
      .map((item) => ({ item, score: fuzzyScore(query, item.searchText) }))
      .filter((entry) => entry.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [allItems, query]);

  const safeActive = results.length ? Math.min(activeIdx, results.length - 1) : 0;

  const runItem = (item) => {
    if (!item) return;
    closeModal();
    if (item.action) {
      item.action();
    } else if (item.href) {
      smoothNavigate(router, item.href);
    }
  };

  const onInputKey = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      if (query) {
        setQuery("");
        setActiveIdx(0);
      } else {
        closeModal();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (results.length ? (i + 1) % results.length : 0));
      playTickSound(1400, 0.025);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
      playTickSound(1400, 0.025);
    } else if (e.key === "Enter" && results[safeActive]) {
      e.preventDefault();
      runItem(results[safeActive]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="lab-cmd-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/25 px-3 pt-16 backdrop-blur-md sm:pt-24"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="UI Labs Command Search"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={SPRING.enter}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-black/[0.08] bg-white text-ink shadow-[0_28px_80px_-20px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3.5">
              <Search size={16} className="shrink-0 text-[#0879a0]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Jump to a specimen, field note, or primitive…"
                className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-muted"
              />
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close command palette"
                className="grid h-6 w-6 place-items-center rounded-md border border-black/[0.08] bg-[#f5f5f7] text-ink-muted hover:text-ink"
              >
                <X size={13} />
              </button>
            </div>

            <div data-lenis-prevent className="max-h-[360px] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="py-10 text-center font-labMono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                  No specimens matching &ldquo;{query}&rdquo;
                </p>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {results.map((item, idx) => {
                    const active = idx === safeActive;
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveIdx(idx)}
                          onClick={() => runItem(item)}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                            active ? "bg-[#f5f5f7] text-ink" : "text-ink-secondary hover:bg-black/[0.025]"
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <Icon
                              size={15}
                              className={active ? "shrink-0 text-[#0879a0]" : "shrink-0 text-ink-muted"}
                            />
                            <div className="min-w-0">
                              <p className="truncate text-[13.5px] font-medium">{item.title}</p>
                              <p className="truncate font-labMono text-[10px] text-ink-muted">
                                {item.group} · {item.meta}
                              </p>
                            </div>
                          </div>
                          {active && (
                            <span className="shrink-0 font-labMono text-[10px] text-[#0879a0]">↵</span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-black/[0.06] bg-[#fafafa] px-4 py-2 font-labMono text-[10px] text-ink-muted">
              <span>↑↓ Navigate · ↵ Open · Esc Close</span>
              <span>{results.length} entries</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
