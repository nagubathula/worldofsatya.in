"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import { useLenis } from "lenis/react";
import { ChevronDown } from "lucide-react";
import ChibiAvatar, { faceIntroDelay, setFaceReading } from "@/components/ChibiAvatar";
import { playTingSound, playPopSound } from "@/components/SoundEffects";
import SocialBurst, { SLIDE, useBurstWidth, useCompact } from "@/components/SocialBurst";
import RiveAboutButton from "@/components/RiveAboutButton";
import GalleryButton from "@/components/GalleryButton";
import UILabButton from "@/components/UILabButton";
import WorksFan from "@/components/WorksFan";
import { calendarSections } from "@/components/FlipCalendarNav";
import { SPRING } from "@/lib/motion";
import CaseStudyOverlay from "./CaseStudyOverlay";
import DepthGallery from "./DepthGallery";
import PatchBoard from "./PatchBoard";

const EMAIL = "nagubathula.satyasai@gmail.com";
const FAN_ITEMS = calendarSections.find((s) => s.isWorks).previewItems;

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/satyasainagubathula" },
  { label: "GitHub", href: "https://github.com/nagubathula" },
  { label: "Instagram", href: "https://www.instagram.com/engineerudu" },
];

// The rest of the site, in the footer only: the page itself stays one page.
const MORE_PAGES = [
  { label: "About", href: "/about" },
  { label: "All work", href: "/works" },
  { label: "UI Labs", href: "/ui" },
  { label: "Gallery", href: "/gallery" },
];

const SERVICES = [
  {
    title: "Frontend engineering",
    body: "React, Next.js and TypeScript interfaces that are fast, accessible and pleasant to use, from the first component to production.",
  },
  {
    title: "AI engineering",
    body: "RAG and LLM pipelines, agents and generative video, built into products people use: 14 full-stack apps at NxtWave, including an AI video editor.",
  },
  {
    title: "Product and UI design",
    body: "Research, flows and interface design in Figma, shaped with the people who use the product and handed off as something a developer can build.",
  },
  {
    title: "Design systems",
    body: "Tokens, components and documentation that keep design and code speaking the same language, like Chaya UI and Tailus.",
  },
  {
    title: "Motion and interaction",
    body: "The feel of a product: springs, gestures, sound and the small details that make an interface answer back.",
  },
];

// One ease for everything that arrives: a soft ease-out, no snap.
const SMOOTH = { duration: 0.8, ease: [0.33, 1, 0.68, 1] };

// Text blurs in as it arrives, as on the old home page.
function Reveal({ children, className = "", delay = 0, as = "div" }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...SMOOTH, delay }}
    >
      {children}
    </Tag>
  );
}

// Section heading: a number, the name, and a hairline running to the edge, so
// the page reads as a sequence of chapters rather than one long column.
function Label({ n, children }) {
  return (
    <h2 className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.14em] text-[#999]">
      {n && <span className="tabular-nums text-[#181818]">{n}</span>}
      <span>{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-black/[0.08]" />
    </h2>
  );
}

const underline =
  "cursor-pointer text-[#181818] underline decoration-wavy decoration-[#2ec4f0] decoration-[1.5px] underline-offset-[5px] transition-colors hover:text-black";
const underlineOnBoard =
  "cursor-pointer text-white underline decoration-wavy decoration-[#2ec4f0] decoration-[1.5px] underline-offset-[5px] transition-colors hover:text-[#2ec4f0]";

// A real link to a project's own page. A plain click opens it over this page
// instead; Cmd/Ctrl-click, middle-click and search engines get the full page.
// data-transition="off" keeps the site-wide page transition from taking the click.
export const workHref = (work) => `/works/${work.slug}`;
function overlayClick(work, onOpen) {
  return (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onOpen(work);
  };
}

// A name in the copy that floats its picture above it on hover, and opens its
// case study on click.
function PreviewLink({ work, onOpen, children }) {
  const image = work?.image;
  const [shown, setShown] = useState(false);
  return (
    <span className="relative inline-block">
      <a
        href={work ? workHref(work) : undefined}
        data-transition="off"
        onClick={work ? overlayClick(work, onOpen) : undefined}
        onPointerEnter={(e) => e.pointerType !== "touch" && setShown(true)}
        onPointerLeave={() => setShown(false)}
        onFocus={() => setShown(true)}
        onBlur={() => setShown(false)}
        className={underline}
      >
        {children}
      </a>
      <AnimatePresence>
        {shown && image && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.96, x: "-50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
            exit={{ opacity: 0, y: 6, scale: 0.96, x: "-50%", transition: { duration: 0.2 } }}
            transition={{ ...SMOOTH, duration: 0.45 }}
            style={{ transformOrigin: "50% 100%" }}
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-3 block w-64 rounded-2xl border border-black/[0.08] bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.1)]"
          >
            <span className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#f5f5f5]">
              <Image src={image} alt="" fill sizes="256px" unoptimized={image.endsWith(".gif")} className="object-cover object-top" />
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// "How I work": three verbs, each backed by a fact from the work itself.
const STEPS = {
  find: { color: "#f5a623", proof: "Billjot: 168 restaurants surveyed before I drew the first screen." },
  design: { color: "#2ec4f0", proof: "Tailus: 65+ people interviewed, then a kit built on Tailwind's own tokens." },
  ship: { color: "#2fbf71", proof: "NxtWave: 14 full-stack apps designed and built, cutting production time by 90%." },
};

// A verb in the statement: underlined in its colour, tinted on hover or tap,
// with its proof floating above it.
function Step({ name, label, active, onActive }) {
  const step = STEPS[name];
  const lit = active === name;
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onPointerEnter={(e) => e.pointerType !== "touch" && onActive(name)}
        onPointerLeave={(e) => e.pointerType !== "touch" && onActive(null)}
        onFocus={() => onActive(name)}
        onBlur={() => onActive(null)}
        onClick={() => onActive(active === name ? null : name)}
        style={{ textDecorationColor: step.color, backgroundColor: lit ? `${step.color}26` : "transparent" }}
        className="rounded-[6px] px-[2px] text-[#181818] underline decoration-[2px] underline-offset-[5px] transition-colors duration-300"
      >
        {label}
      </button>
      <AnimatePresence>
        {lit && (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 6, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 4, x: "-50%", transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 block w-max max-w-[240px] rounded-xl bg-[#181818] px-3 py-2 text-left text-[12.5px] font-medium leading-[1.4] tracking-normal text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.4)]"
          >
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ backgroundColor: step.color }} />
            {step.proof}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

function HowIWork() {
  const [active, setActive] = useState(null);
  return (
    <section className="mt-32">
      <Reveal>
        <Label n="02">How I work</Label>
        <p className="mt-6 text-[22px] font-medium leading-[1.3] tracking-[-0.02em] text-[#666] sm:text-[24px]">
          Most people hand off at the Figma file. I don&apos;t.{" "}
          <span className="text-[#181818]">
            I <Step name="find" label="find the real problem" active={active} onActive={setActive} />,{" "}
            <Step name="design" label="design the answer" active={active} onActive={setActive} />, then{" "}
            <Step name="ship" label="build and ship it" active={active} onActive={setActive} /> myself.
          </span>
        </p>
        <p className="mt-5 text-[15px] font-medium leading-[1.45] text-[#666]">
          A designer who codes, and an engineer who designs. The title changes; the job doesn&apos;t.
        </p>
      </Reveal>
    </section>
  );
}

// A number that counts up the first time it scrolls into view.
function Count({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  useEffect(() => {
    const el = ref.current;
    const match = String(value).match(/^(\D*)([\d,]*\.?\d+)(.*)$/);
    if (!el || !match || !inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, before, digits, after] = match;
    const target = parseFloat(digits.replace(/,/g, ""));
    const decimals = (digits.split(".")[1] || "").length;
    const fmt = (n) => before + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + after;
    const controls = animate(0, target, { duration: 1.2, ease: [0.33, 1, 0.68, 1], onUpdate: (n) => (el.textContent = fmt(n)) });
    return () => {
      controls.stop();
      el.textContent = value;
    };
  }, [inView, value]);
  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}

// Outcome-first stories. Headlines are arrays: strings, and { n } for a number
// that counts up. Every figure comes from the case studies and experience list.
const STORIES = [
  {
    slug: "billjot",
    wide: true,
    headline: ["A POS I designed now runs on ", { n: "500+" }, " terminals across ", { n: "584" }, " restaurants."],
    body: "Researched in 168 restaurants, redesigned for phones after the first test, then taken from 0 to ₹20L in revenue as founder.",
  },
  {
    slug: "contentflow",
    headline: ["I cut content production time by ", { n: "90%" }, " by building the tools myself."],
    body: "14 full-stack apps at NxtWave with RAG and LLM pipelines, including an AI video editor.",
  },
  {
    slug: "gen-ai-production",
    headline: [{ n: "14" }, " channels, from 0 to ", { n: "100K+" }, " followers."],
    body: "1,000+ videos a month: ComfyUI workflows, Flux with custom LoRAs, and ElevenLabs voice-overs run by agents.",
  },
  {
    slug: "openweave",
    headline: [{ n: "4" }, " tools and ", { n: "3" }, " exports, folded into one design file."],
    body: "OpenWeave, my open-source editor for Figma files: motion, device prototypes, handoff and sharing sit beside the canvas you drew on.",
  },
  {
    slug: "tailus",
    headline: [{ n: "65+" }, " interviews before a single component."],
    body: "A Figma UI kit built on Tailwind's own tokens, so design and code share one language. 10% less development time.",
  },
];

function StoryCard({ story, work, onOpen }) {
  const inner = (
    <>
      <p className="text-[19px] font-medium leading-[1.25] tracking-[-0.015em] text-[#181818] sm:text-[21px]">
        {story.headline.map((part, i) => (typeof part === "string" ? <span key={i}>{part}</span> : <Count key={i} value={part.n} />))}
      </p>
      <p className="mt-3 text-[13px] leading-[1.5] text-[#666]">{story.body}</p>
      {work && (
        <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-[#181818]">
          Read the story <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      )}
    </>
  );
  const cls = `group block h-full rounded-[20px] bg-[#f3f3f3] p-6 text-left transition-colors duration-300 sm:p-7 ${work ? "hover:bg-[#ececec]" : ""}`;
  return work ? (
    <a href={workHref(work)} data-transition="off" onClick={overlayClick(work, onOpen)} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

function Stories({ find, onOpen }) {
  return (
    <section className="mt-32">
      <Reveal>
        <Label n="03">Impact</Label>
        <p className="mt-6 text-[22px] font-medium leading-[1.3] tracking-[-0.02em] text-[#181818] sm:text-[24px]">
          I don&apos;t stop at the mockup. <span className="text-[#666]">Every number below came from something I designed and then built.</span>
        </p>
      </Reveal>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {STORIES.map((story, i) => (
          <Reveal key={i} delay={(i % 2) * 0.06} className={story.wide ? "sm:col-span-2" : ""}>
            <StoryCard story={story} work={story.slug ? find(story.slug) : null} onOpen={onOpen} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Availability({ dark = false }) {
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-medium sm:text-[14px] ${dark ? "text-white/80" : "text-[#181818]"}`}>
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2fbf71] opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2fbf71]" />
      </span>
      Open to roles
    </span>
  );
}

// Three numbers above the fold, so the proof isn't buried under the story.
// Each one is a headline from the Impact cards further down.
const PROOF = [
  { n: "584", label: "restaurants run the POS I designed and built" },
  { n: "1,000+", label: "AI videos a month from pipelines I built" },
  { n: "90%", label: "less production time with my internal tools" },
];

function ProofStrip({ delay = 0 }) {
  return (
    <motion.dl
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SMOOTH, delay }}
      className="mt-14 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:gap-8"
    >
      {PROOF.map((item) => (
        <div key={item.n}>
          <dt className="sr-only">{item.label}</dt>
          <dd className="text-[26px] font-semibold leading-none tracking-[-0.04em] text-white sm:text-[34px]">
            <Count value={item.n} />
          </dd>
          <dd aria-hidden="true" className="mt-2 text-[12px] leading-[1.4] text-white/55 sm:text-[13px]">{item.label}</dd>
        </div>
      ))}
    </motion.dl>
  );
}

// The hero's board: a charcoal cutting mat. A fine grid with a heavier line
// every fifth square, ruler ticks along the top and left edges, and a soft light
// from the top left. Pure CSS; the patches are drawn on top in three.js.
const TICKS_X =
  "repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 1px, transparent 1px 8px), repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 40px)";
const TICKS_Y =
  "repeating-linear-gradient(180deg, rgba(255,255,255,0.35) 0 1px, transparent 1px 8px), repeating-linear-gradient(180deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 40px)";

function BoardSurface() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 70% 60% at 30% 20%, rgba(255,255,255,0.07), transparent 70%)",
            "linear-gradient(rgba(255,255,255,0.075) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,255,255,0.075) 1px, transparent 1px)",
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "100% 100%, 200px 200px, 200px 200px, 40px 40px, 40px 40px",
          backgroundPosition: "0 0, 20px 20px, 20px 20px, 20px 20px, 20px 20px",
        }}
      />
      <div className="absolute inset-x-5 top-0 h-[9px]" style={{ backgroundImage: TICKS_X, backgroundSize: "100% 5px, 100% 9px", backgroundRepeat: "no-repeat" }} />
      <div className="absolute inset-y-5 left-0 w-[9px]" style={{ backgroundImage: TICKS_Y, backgroundSize: "5px 100%, 9px 100%", backgroundRepeat: "no-repeat" }} />
      <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_0_80px_rgba(0,0,0,0.45)]" />
    </div>
  );
}

// Numbered rows that open in place, like a services list.
function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <ul className="mt-6 border-t border-black/[0.08]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <li key={item.title} className="border-b border-black/[0.08]">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-6 py-4 text-left"
            >
              <span className="w-5 text-[13px] tabular-nums text-[#666]">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 text-[15px] font-medium text-[#181818]">{item.title}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={SPRING.enter} className="text-[#999]" aria-hidden="true">
                <ChevronDown size={14} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 pl-11 pr-6 text-[13px] leading-[1.5] text-[#666]">{item.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

// An article as a slightly tilted card.
const TILTS = [-2.5, 2, -1.2];
const OFFSETS = ["sm:mt-0", "sm:mt-16", "sm:-mt-4"];
function ThoughtCard({ item, index, onOpen }) {
  return (
    <motion.a
      href={workHref(item)}
      data-transition="off"
      onClick={overlayClick(item, onOpen)}
      initial={{ opacity: 0, y: 24, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: TILTS[index % TILTS.length] }}
      whileHover={{ rotate: 0, y: -6, scale: 1.02 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 160, damping: 20 }}
      className={`relative block w-full max-w-[280px] overflow-hidden rounded-[20px] border border-black/[0.06] bg-white p-6 text-left shadow-[0_20px_50px_-24px_rgba(0,0,0,0.25)] ${OFFSETS[index % OFFSETS.length]}`}
    >
      <p className="text-[21px] font-medium leading-[1.15] tracking-[-0.01em] text-[#181818]">{item.title}</p>
      {item.date && <p className="mt-2 text-[12.8px] text-[#666]">{item.date}</p>}
      <p className="mt-4 line-clamp-5 text-[12.8px] leading-[1.6] text-[#181818]">{item.study?.heroDescription || item.description}</p>
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </motion.a>
  );
}

function Lightbox({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-5 sm:p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div className="absolute inset-0 bg-white/85 backdrop-blur-md" />
      <motion.figure
        className="relative z-10 flex max-h-full flex-col items-center"
        initial={{ scale: 0.94, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 8 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        <img src={item.src} alt={item.title} className="max-h-[78dvh] w-auto max-w-full rounded-[14px] object-contain shadow-[0_30px_80px_-30px_rgba(0,0,0,0.4)]" />
        <figcaption className="mt-4 max-w-[480px] text-center">
          <p className="text-[14px] font-medium text-[#181818]">{item.title}</p>
          {item.description && <p className="mt-1 text-[13px] leading-[1.5] text-[#666]">{item.description}</p>}
        </figcaption>
      </motion.figure>
    </motion.div>
  );
}

export default function OnePageHome({ projects, writing, extras = [], experiences, artifacts }) {
  const lenis = useLenis();
  // Everything that can open in the overlay.
  const all = [...projects, ...writing, ...extras];
  const [openWork, setOpenWork] = useState(null);
  const [artifact, setArtifact] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactRef = useRef(null);
  const boardRef = useRef(null);
  const burstWidth = useBurstWidth();
  const hideSideButtons = useCompact() && isContactOpen;
  const introDelay = faceIntroDelay();

  const bySlug = (slug) => all.find((w) => w.slug === slug);

  // Case studies keep a shareable address (?work=slug) without leaving the page.
  const open = useCallback((work) => {
    if (!work) return;
    setOpenWork(work);
    const url = new URL(window.location.href);
    url.searchParams.set("work", work.slug);
    window.history.pushState({ work: work.slug }, "", url);
  }, []);

  // Going back is async, so a second close (Esc twice, Esc plus a backdrop click)
  // would step back again, out of the site. One back per open.
  const backPending = useRef(false);
  const close = useCallback(() => {
    setOpenWork(null);
    if (backPending.current) return;
    if (new URL(window.location.href).searchParams.has("work")) {
      if (window.history.state?.work) {
        backPending.current = true;
        window.history.back();
      } else {
        const url = new URL(window.location.href);
        url.searchParams.delete("work");
        window.history.replaceState(null, "", url);
      }
    }
  }, []);

  useEffect(() => {
    const sync = () => {
      backPending.current = false;
      const slug = new URL(window.location.href).searchParams.get("work");
      setOpenWork(slug ? [...projects, ...writing, ...extras].find((w) => w.slug === slug) || null : null);
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, [projects, writing, extras]);

  // Reading a case study puts the face's glasses on.
  useEffect(() => {
    setFaceReading(Boolean(openWork));
  }, [openWork]);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      playTingSound();
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }, []);

  // Press E anywhere to copy the email.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "e" && e.key !== "E") return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || openWork || artifact) return;
      if (e.target instanceof Element && e.target.closest("input, textarea, select, [contenteditable='true'], [data-piece-id]")) return;
      copyEmail();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [copyEmail, openWork, artifact]);

  // The contact burst closes on Escape or a click outside, as before.
  useEffect(() => {
    if (!isContactOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsContactOpen(false);
    const onDown = (e) => {
      if (contactRef.current && !contactRef.current.contains(e.target)) {
        setIsContactOpen(false);
        try {
          playPopSound(440, 0.08);
        } catch {}
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [isContactOpen]);

  const goTo = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -40 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  // The fan's cards carry /works/<slug>; here they open the overlay instead.
  const onFan = (href) => open(bySlug(href.split("/").pop()));

  const p = (slug) => bySlug(slug);

  return (
    <div className="relative z-[1] min-h-screen w-full bg-white text-[#181818] selection:bg-[#181818] selection:text-white">
      {/* The hero sits on a cutting mat, with patches you can pick up. */}
      <section
        ref={boardRef}
        aria-label="Introduction"
        className="relative mx-2.5 mt-2.5 overflow-hidden rounded-[24px] bg-[#17181b] text-white sm:mx-3.5 sm:mt-3.5 sm:rounded-[28px]"
      >
        <BoardSurface />
        <PatchBoard boardRef={boardRef} />
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-20px)] w-full max-w-[620px] flex-col justify-center px-5 pb-[calc(var(--patch-tray,0px)+56px)] pt-14 sm:pt-20">
            {/* Top row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...SMOOTH, delay: introDelay }}
              className="flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <h1 className="text-[14px] font-medium leading-[1.35] text-white sm:text-[15px]">Satya Sai Nagubathula</h1>
                <p className="text-[14px] font-medium leading-[1.35] text-white/55 sm:text-[15px]">Product Designer, Frontend &amp; AI Engineer</p>
              </div>
              <div className="pt-1">
                <Availability dark />
              </div>
            </motion.div>

            {/* The face, at the size it had on the old home page, so its hover
                (mouth open, lift, grow), eye tracking and pop-in read clearly. */}
            <div className="mt-16 h-24 w-24 sm:mt-20 sm:h-28 sm:w-28">
              <ChibiAvatar className="h-full w-full" />
            </div>

            {/* Statement. Reading it puts the glasses on, as before. */}
            <Reveal
              delay={introDelay + 0.1}
              className="mt-8"
            >
              <p
                onPointerEnter={(e) => e.pointerType !== "touch" && setFaceReading(true)}
                onPointerLeave={() => !openWork && setFaceReading(false)}
                className="text-[24px] font-medium leading-[1.15] tracking-[-0.025em] text-white sm:text-[30px] lg:text-[34px]"
              >
                I design products, build their frontends and wire AI into them, from Figma to production. I also run{" "}
                <Link href="/ui" className={underlineOnBoard}>
                  UI Labs
                </Link>
                , a playground for motion, sound and physics.
              </p>
            </Reveal>

            {/* The old row: about, gallery, UI Lab and the contact burst, now pointing at sections. */}
            <motion.div
              ref={contactRef}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, x: isContactOpen ? -burstWidth / 2 + 120 : 0 }}
              transition={{
                ...SPRING.enter,
                x: { ...SLIDE, delay: isContactOpen ? 0 : 0.2 },
                opacity: { ...SMOOTH, delay: introDelay + 0.4 },
                y: { ...SMOOTH, delay: introDelay + 0.4 },
              }}
              className="mt-10 flex items-center gap-4"
            >
              <motion.div
                initial={false}
                animate={hideSideButtons ? { width: 0, opacity: 0, scale: 0.8, marginRight: -16 } : { width: "auto", opacity: 1, scale: 1, marginRight: 0 }}
                transition={SLIDE}
                aria-hidden={hideSideButtons || undefined}
                inert={hideSideButtons || undefined}
                className="flex shrink-0 items-center gap-4"
              >
                <RiveAboutButton href="#now" onClick={goTo("now")} />
                <GalleryButton href="#artifacts" onClick={goTo("artifacts")} />
                <UILabButton />
              </motion.div>
              <SocialBurst open={isContactOpen} onToggle={() => setIsContactOpen((o) => !o)} />
            </motion.div>

            <ProofStrip delay={introDelay + 0.55} />
        </div>
      </section>

      <main className="mx-auto w-full max-w-[620px] px-5 pb-10 pt-8">

        {/* Now */}
        <section id="now" className="mt-32 scroll-mt-10">
          <Reveal>
            <Label n="01">Now</Label>
            <p className="mt-6 text-[15px] font-medium leading-[1.4] text-[#181818]">
              These months I lead design and agentic AI engineering at{" "}
              <span className="inline-flex translate-y-[2px] items-center gap-1.5 align-baseline">
                <Image src="/images/nxtwave-logo.svg" alt="" width={16} height={16} className="h-4 w-4 object-contain" />
                <span className="text-[12.3px] tracking-[0.2em]">NXTWAVE</span>
              </span>
              , with a team of 3 engineers and 3 designers.
              <br />
              <span className="text-[#666]">Next, I&apos;m looking for a role in product design, frontend or AI engineering.</span>
            </p>
          </Reveal>
        </section>

        <HowIWork />

        <Stories find={(slug) => all.find((w) => w.slug === slug)} onOpen={open} />

        {/* Where I've worked */}
        <section className="mt-32">
          <Reveal>
            <Label n="04">Where I&apos;ve worked</Label>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
            {experiences.map((exp, i) => (
              <Reveal key={exp.company} delay={(i % 3) * 0.06}>
                <div className="group">
                  <div className="flex aspect-square items-center justify-center rounded-[14px] bg-[#f3f3f3] transition-colors duration-300 group-hover:bg-[#ececec]">
                    <Image
                      src={exp.logo}
                      alt={exp.company}
                      width={56}
                      height={56}
                      className="h-11 w-11 object-contain grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                    />
                  </div>
                  <p className="mt-3 text-[14px] font-medium text-[#181818]">
                    {exp.company}
                    {exp.isCurrent && <span className="ml-1.5 text-[#2fbf71]">●</span>}
                  </p>
                  <p className="text-[14px] font-medium leading-[1.4] text-[#666]">{exp.role}</p>
                  <p className="text-[13px] tabular-nums text-[#999]">{exp.period}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Own products */}
        <Reveal className="mt-32">
          <p className="text-[22px] font-medium leading-[1.18] tracking-[-0.02em] text-[#666] sm:text-[24px]">
            Alongside, I build my own products:
            <br />
            <span className="text-[#181818]">
              <PreviewLink work={p("openweave")} onOpen={open}>OpenWeave</PreviewLink>,{" "}
              <PreviewLink work={p("notbad")} onOpen={open}>NotBad</PreviewLink>,{" "}
              <PreviewLink work={p("toothpaste")} onOpen={open}>Toothpaste</PreviewLink> and{" "}
              <PreviewLink work={p("billjot")} onOpen={open}>Billjot</PreviewLink>.
            </span>
          </p>
        </Reveal>

        {/* Projects: the old fanned cards, then the list. */}
        <section id="projects" className="mt-32 scroll-mt-10">
          <Reveal>
            <Label n="05">Projects</Label>
          </Reveal>
        </section>
      </main>

      <Reveal className="mx-auto mt-8 flex w-full max-w-[860px] justify-center px-4">
        <div className="relative aspect-[100/124] w-[min(360px,84vw)] sm:aspect-[780/380] sm:w-[min(760px,92%)]">
          <WorksFan items={FAN_ITEMS} onNavigate={onFan} interactive showMore={false} />
        </div>
      </Reveal>

      <div className="mx-auto w-full max-w-[620px] px-5">
        <ul className="mt-10 border-t border-black/[0.08]">
          {projects.map((work, i) => (
            <li key={work.slug} className="border-b border-black/[0.08]">
              <a
                href={workHref(work)}
                data-transition="off"
                onClick={overlayClick(work, open)}
                onPointerEnter={(e) => e.pointerType !== "touch" && setFaceReading(true)}
                onPointerLeave={() => !openWork && setFaceReading(false)}
                className="group flex w-full items-center gap-6 py-4 text-left"
              >
                <span className="w-5 text-[13px] tabular-nums text-[#666]">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">
                  <span className="block text-[15px] font-medium text-[#181818]">{work.title}</span>
                  <span className="block text-[13px] text-[#666]">{work.tag}</span>
                </span>
                <span aria-hidden="true" className="text-[14px] text-[#999] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#181818]">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Services */}
        <section className="mt-32">
          <Reveal>
            <Label n="06">What I do</Label>
          </Reveal>
          <Accordion items={SERVICES} />
        </section>
      </div>

      {/* Thoughts */}
      <section className="mx-auto mt-32 w-full max-w-[620px] px-5">
        <Reveal>
          <Label n="07">Thoughts</Label>
        </Reveal>
      </section>
      <div className="mx-auto mt-10 flex w-full max-w-[860px] flex-col items-center gap-8 px-5 sm:flex-row sm:items-start sm:justify-center sm:gap-6">
        {writing.map((item, i) => (
          <ThoughtCard key={item.slug} item={item} index={i} onOpen={open} />
        ))}
      </div>

      {/* Artifacts */}
      <section id="artifacts" className="mx-auto mt-32 w-full max-w-[620px] scroll-mt-10 px-5">
        <Reveal>
          <Label n="08">Artifacts</Label>
          <p className="mt-6 text-[15px] font-medium leading-[1.4] text-[#666]">Posters, interfaces, 3D and AI work from along the way. Keep scrolling to fly through.</p>
        </Reveal>
      </section>
      <div className="mt-6">
        <DepthGallery items={artifacts} onOpen={setArtifact} />
      </div>

      {/* Contact */}
      <footer className="mx-auto mt-24 w-full max-w-[620px] px-5 pb-16">
        <Reveal>
          <Label n="09">Contact</Label>
          <div className="mt-8 rounded-[28px] bg-[#181818] p-7 text-white sm:p-10">
            <Availability dark />
            <p className="mt-6 text-[28px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[38px]">
              Hiring for design, frontend or AI?
              <br />
              <span className="text-white/50">Let&apos;s talk.</span>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[14px] font-medium text-[#181818] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Email me <span aria-hidden="true">→</span>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-[14px] font-medium text-white/80 transition-colors hover:border-white/50 hover:text-white"
              >
                {copied ? "Copied" : "Copy email"}
              </button>
            </div>
            <p className="mt-6 break-all text-[13px] text-white/45">{EMAIL}</p>
          </div>
        </Reveal>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.08] pt-6 text-[13px] font-medium text-[#666]">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {MORE_PAGES.map((page) => (
              <a key={page.href} href={page.href} className="transition-colors hover:text-[#181818]">
                {page.label}
              </a>
            ))}
            <span aria-hidden="true" className="text-black/15">·</span>
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#181818]">
                {s.label}
              </a>
            ))}
          </div>
          <button type="button" onClick={copyEmail} className="hidden items-center gap-1.5 transition-colors hover:text-[#181818] sm:inline-flex">
            press <kbd className="rounded-[5px] border border-black/[0.12] px-1.5 text-[11px] text-[#181818]">E</kbd>
          </button>
        </div>
      </footer>

      {/* "Copied" toast */}
      <AnimatePresence>
        {copied && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 12, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 8, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-[90] rounded-full bg-[#181818] px-4 py-2 text-[13px] font-medium text-white shadow-lg"
          >
            Email copied
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{artifact && <Lightbox key={artifact.id} item={artifact} onClose={() => setArtifact(null)} />}</AnimatePresence>
      <AnimatePresence>{openWork && <CaseStudyOverlay key={openWork.slug} work={openWork} onClose={close} />}</AnimatePresence>
    </div>
  );
}
