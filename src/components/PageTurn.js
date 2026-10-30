import Link from "next/link";

// The end of a page points somewhere: back the way you came, and on to the next
// page. Each side is { href, title }; either can be left out.
export default function PageTurn({ prev, next }) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="More pages"
      className="mx-auto mt-24 grid w-full max-w-5xl grid-cols-2 gap-4 border-t border-black/[0.08] pt-10 sm:mt-32 sm:gap-8 sm:pt-14"
    >
      {prev ? <TurnLink {...prev} direction="prev" /> : <span />}
      {next ? <TurnLink {...next} direction="next" /> : <span />}
    </nav>
  );
}

function TurnLink({ href, title, direction }) {
  const isNext = direction === "next";

  return (
    <Link
      href={href}
      rel={direction}
      className={`group flex min-w-0 flex-col gap-1.5 rounded-2xl py-2 ${isNext ? "items-end text-right" : "items-start text-left"}`}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73]">
        {isNext ? "Next" : "Back to"}
      </span>
      <span className="flex max-w-full items-center gap-2 text-2xl font-semibold tracking-[-0.04em] text-[#1d1d1f] transition-colors group-hover:text-[#0879a0] sm:text-4xl">
        {!isNext && <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">←</span>}
        <span className="truncate">{title}</span>
        {isNext && <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
      </span>
    </Link>
  );
}
