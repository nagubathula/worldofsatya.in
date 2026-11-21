"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Code2, Copy, ExternalLink, FileCode2, Loader2, X } from "lucide-react";
import { playTickSound, playTingSound } from "./SoundEffects";
import { EASE_OUT, SPRING } from "@/lib/motion";

const TOKEN_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|`(?:\\[\s\S]|[^`])*`|"(?:\\.|[^"\n])*"|'(?:\\.|[^'\n])*'|\b(?:import|from|export|default|function|const|let|var|return|if|else|for|while|switch|case|break|continue|new|try|catch|async|await|true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b)/g;

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "function",
  "const",
  "let",
  "var",
  "return",
  "if",
  "else",
  "for",
  "while",
  "switch",
  "case",
  "break",
  "continue",
  "new",
  "try",
  "catch",
  "async",
  "await",
  "true",
  "false",
  "null",
  "undefined",
]);

function highlightLine(line) {
  if (!line) return "\u00a0";
  const parts = line.split(TOKEN_RE);
  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith("//") || part.startsWith("/*")) {
      return (
        <span key={idx} className="text-[#8e8e93] italic">
          {part}
        </span>
      );
    }
    if (part.startsWith('"') || part.startsWith("'") || part.startsWith("`")) {
      return (
        <span key={idx} className="text-[#0d8a38]">
          {part}
        </span>
      );
    }
    if (KEYWORDS.has(part)) {
      return (
        <span key={idx} className="font-medium text-[#5b4cf0]">
          {part}
        </span>
      );
    }
    if (/^\d+(?:\.\d+)?$/.test(part)) {
      return (
        <span key={idx} className="text-[#d97706]">
          {part}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export default function SourceDrawer({
  piece,
  pieceIndex = 0,
  files = [],
  gzipKb,
  sandboxBusy = false,
  onOpenSandbox,
  onClose,
}) {
  const [tabIdx, setTabIdx] = useState(0);
  const [copied, setCopied] = useState(false);

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

  const safeIdx = files.length ? Math.min(tabIdx, files.length - 1) : 0;
  const activeFile = files[safeIdx] || { name: "", path: "", code: "" };
  const lines = activeFile.code.split(/\r?\n/);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.code);
    } catch {}
    setCopied(true);
    playTingSound(2093, 0.045);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <AnimatePresence>
      {piece && (
        <motion.div
          key="source-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-3 backdrop-blur-md sm:p-6"
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="source-drawer-title"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={SPRING.enter}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-black/[0.08] bg-white shadow-[0_28px_80px_-20px_rgba(0,0,0,0.3)]"
          >
            {/* Header */}
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] bg-[#fafafa] px-4 py-3.5 sm:px-6">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#5b4cf0]/10 text-[#5b4cf0]">
                  <Code2 size={16} />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-muted">
                    {String(pieceIndex + 1).padStart(2, "0")} · Source Inspector
                  </p>
                  <h2 id="source-drawer-title" className="truncate text-[15px] font-semibold text-ink">
                    {piece.title}
                  </h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-ink transition-colors hover:bg-[#f5f5f7] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
                >
                  {copied ? <Check size={13} className="text-[#0d8a38]" /> : <Copy size={13} />}
                  {copied ? "Copied" : "Copy file"}
                </button>
                <button
                  type="button"
                  onClick={onOpenSandbox}
                  disabled={sandboxBusy}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
                >
                  {sandboxBusy ? <Loader2 size={13} className="animate-spin" /> : <ExternalLink size={13} />}
                  {sandboxBusy ? "Opening…" : "Open in CodeSandbox"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close source drawer"
                  className="grid h-8 w-8 place-items-center rounded-full border border-black/[0.06] bg-white text-ink-secondary transition-colors hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
                >
                  <X size={15} />
                </button>
              </div>
            </header>

            {/* File tabs when multiple source files back one demo */}
            {files.length > 1 && (
              <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-white px-4 py-2 sm:px-6" role="tablist">
                {files.map((file, idx) => {
                  const active = idx === safeIdx;
                  return (
                    <button
                      key={file.path}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => {
                        setTabIdx(idx);
                        setCopied(false);
                        playTickSound(1600, 0.035);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11.5px] transition-colors ${
                        active ? "bg-ink text-white" : "bg-[#f5f5f7] text-ink-secondary hover:text-ink"
                      }`}
                    >
                      <FileCode2 size={12} />
                      {file.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Code viewport */}
            <div data-lenis-prevent className="flex-1 overflow-auto bg-[#fbfbfd] p-4 font-mono text-[12px] leading-relaxed text-ink sm:p-5">
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-black/[0.025]">
                      <td className="w-10 select-none pr-4 text-right align-top text-[11px] text-ink-muted/65 tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="whitespace-pre align-top">{highlightLine(line)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.06] bg-[#fafafa] px-4 py-2.5 font-mono text-[11px] text-ink-muted sm:px-6">
              <span>src/{activeFile.path}</span>
              <span>
                worldofsatya.in/ui#{piece.id}
                {gzipKb ? ` · ${gzipKb} kB gzip` : ""}
              </span>
            </footer>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
