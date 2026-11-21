"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, ExternalLink, Loader2, X } from "lucide-react";
import LabSourceViewport from "./LabSourceHighlight";
import { EASE_OUT, SPRING } from "@/lib/motion";

export default function DarkSourceModal({
  piece,
  pieceIndex = 0,
  files = [],
  gzipKb,
  sandboxBusy = false,
  onOpenSandbox,
  onClose,
}) {
  useEffect(() => {
    if (!piece) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [piece, onClose]);

  return (
    <AnimatePresence>
      {piece && (
        <motion.div
          key="lab-source-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3 backdrop-blur-md sm:p-6"
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="lab-source-title"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={SPRING.enter}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-[22px] border border-black/[0.08] bg-white text-ink shadow-[0_28px_80px_-20px_rgba(0,0,0,0.28)]"
          >
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] bg-[#fafafa] px-4 py-3.5 sm:px-6">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#5b4cf0]/10 text-[#5b4cf0]">
                  <Code2 size={16} />
                </span>
                <div className="min-w-0">
                  <p className="font-labMono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    {String(pieceIndex + 1).padStart(2, "0")} {"//"} Source Inspector
                    {gzipKb ? ` · ${gzipKb} kB gz` : ""}
                  </p>
                  <h2 id="lab-source-title" className="truncate text-[15px] font-semibold text-ink">
                    {piece.title}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenSandbox}
                  disabled={sandboxBusy}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 font-labMono text-[11px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
                >
                  {sandboxBusy ? <Loader2 size={12.5} className="animate-spin" /> : <ExternalLink size={12.5} />}
                  {sandboxBusy ? "Opening…" : "CodeSandbox"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close source modal"
                  className="grid h-8 w-8 place-items-center rounded-full border border-black/[0.07] bg-white text-ink-secondary transition-colors hover:bg-[#f5f5f7] hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
                >
                  <X size={15} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-hidden p-3 sm:p-4">
              <LabSourceViewport key={piece.id} files={files} maxHeightClass="max-h-[64vh]" />
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
