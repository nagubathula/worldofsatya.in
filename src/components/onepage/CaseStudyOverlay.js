"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowUpRight, X } from "lucide-react";
import CaseStudyBody from "@/components/CaseStudyBody";
import NoiseStage from "@/components/NoiseStage";

const EASE = [0.32, 0.72, 0, 1];

// A project's case study, read in a sheet over the one-pager. Esc, the close
// button, the backdrop or the browser's Back all close it.
export default function CaseStudyOverlay({ work, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const lenis = useLenis();
  const study = work.study;

  // Page scroll pauses underneath; the sheet scrolls on its own.
  useEffect(() => {
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const opener = document.activeElement;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = prev;
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, [lenis]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      // Keep Tab inside the sheet.
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const external = work.link && work.link.startsWith("http");

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1, transition: { duration: 0.35 } }}
    >
      <motion.button
        type="button"
        aria-label="Close case study"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#111]/30 backdrop-blur-[6px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.article
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`study-${work.slug}`}
        data-lenis-prevent="true"
        className="relative z-10 flex h-[94dvh] w-full max-w-[880px] flex-col overflow-hidden rounded-t-[28px] bg-[#fbfbfa] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] sm:h-[90dvh] sm:rounded-[28px]"
        initial={{ y: "100%", opacity: 0.6 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0.6 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {/* Sheet bar */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-black/[0.06] bg-[#fbfbfa]/90 px-5 py-3 backdrop-blur sm:px-7">
          <p className="truncate text-[13px] font-medium text-ink-muted">
            {work.title} <span className="text-ink-muted/60">· {work.tag}</span>
          </p>
          <div className="flex items-center gap-2">
            <a
              href={`/works/${work.slug}`}
              className="hidden items-center gap-1 rounded-full px-3 py-1.5 text-[12.5px] font-medium text-ink-muted transition-colors hover:text-ink sm:inline-flex"
            >
              Open full page
            </a>
            {work.link && (
              <a
                href={work.link}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                className="hidden items-center gap-1 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors hover:bg-black/[0.03] sm:inline-flex"
              >
                {work.actionText || "Visit"} <ArrowUpRight size={13} />
              </a>
            )}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.05] text-ink transition-colors hover:bg-black/[0.1] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <header className="mx-auto max-w-[680px] px-5 pt-10 sm:px-8 sm:pt-14">
            {study?.type && <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-ink-muted">{study.type}</p>}
            <h2 id={`study-${work.slug}`} className="mt-3 text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-[40px]">
              {study?.title || work.title}
            </h2>
            <p className="mt-4 text-[16px] leading-[1.6] text-ink-secondary sm:text-[17px]">{study?.heroDescription || work.description}</p>

            {study?.meta?.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-black/[0.08] py-5 sm:grid-cols-4">
                {study.meta.map((item) => (
                  <div key={item.label}>
                    <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted">{item.label}</dt>
                    <dd className="mt-1.5 text-[13.5px] leading-snug text-ink">{item.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {study?.highlights?.length > 0 && (
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {study.highlights.map((item) => (
                  <li key={item.label} className="rounded-2xl bg-[#f0f0ee] px-4 py-4">
                    <p className="text-[24px] font-semibold tabular-nums tracking-[-0.03em] text-ink">{item.value}</p>
                    <p className="mt-1 text-[12.5px] leading-snug text-ink-muted">{item.label}</p>
                  </li>
                ))}
              </ul>
            )}
          </header>

          {study?.image && (
            <div className="mx-auto mt-10 max-w-[820px] px-4 sm:px-8">
              <NoiseStage seed={work.slug} className="p-3 sm:p-8">
                <img src={study.image} alt={work.title} className="noise-stage-media h-auto w-full object-contain" />
              </NoiseStage>
            </div>
          )}

          <div className="mx-auto max-w-[680px] px-5 pb-24 sm:px-8">
            {study?.content?.map((section) => (
              <section key={section.section} className="mt-14">
                <h3 className="text-[20px] font-semibold tracking-[-0.025em] text-ink sm:text-[22px]">{section.section}</h3>
                <div className="mt-4 flex flex-col gap-5 text-[15.5px] leading-[1.7] text-ink-secondary">
                  <CaseStudyBody text={section.body} seed={work.slug} />
                </div>
              </section>
            ))}

            <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-black/[0.08] pt-8">
              {work.link && (
                <a
                  href={work.link}
                  {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#111] px-4 py-2 text-[14px] font-medium text-white"
                >
                  {work.actionText || "Visit"} <ArrowUpRight size={14} />
                </a>
              )}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center rounded-full border border-black/[0.1] px-4 py-2 text-[14px] font-medium text-ink transition-colors hover:bg-black/[0.03]"
              >
                Back to the page
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}
