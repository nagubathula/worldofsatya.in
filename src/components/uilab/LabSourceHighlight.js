"use client";

import { useState } from "react";
import { Check, Copy, FileCode2 } from "lucide-react";
import { playTickSound, playTingSound } from "@/components/SoundEffects";

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
        <span key={idx} className="italic text-[#8e8e93]">
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

export default function LabSourceViewport({ files = [], maxHeightClass = "max-h-[60vh]", extraHeader = null }) {
  const [tabIdx, setTabIdx] = useState(0);
  const [copied, setCopied] = useState(false);

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
    <div className="flex flex-col overflow-hidden rounded-xl border border-black/[0.07] bg-[#fbfbfd] text-ink">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.06] bg-[#fafafa] px-3 py-2">
        <div className="flex flex-wrap items-center gap-1.5" role="tablist">
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
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-labMono text-[10.5px] transition-colors ${
                  active ? "bg-ink font-medium text-white" : "bg-[#f5f5f7] text-ink-secondary hover:text-ink"
                }`}
              >
                <FileCode2 size={11} />
                {file.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5">
          {extraHeader}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-2.5 py-1 font-labMono text-[10.5px] text-ink-secondary transition-colors hover:bg-[#f5f5f7] hover:text-ink"
          >
            {copied ? <Check size={11} className="text-[#0d8a38]" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Code table */}
      <div data-lenis-prevent className={`overflow-auto p-3 font-labMono text-[11.5px] leading-relaxed text-ink ${maxHeightClass}`}>
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-black/[0.025]">
                <td className="w-9 select-none pr-3 text-right align-top text-[10.5px] tabular-nums text-ink-muted/65">
                  {idx + 1}
                </td>
                <td className="whitespace-pre align-top">{highlightLine(line)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-black/[0.06] bg-[#fafafa] px-3 py-1.5 font-labMono text-[10px] text-ink-muted">
        <span>src/{activeFile.path}</span>
        <span>{lines.length} lines</span>
      </div>
    </div>
  );
}
