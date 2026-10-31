"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import WorksFan from "./WorksFan";
import ButtonLab from "./ButtonLab";
import SensorLab from "./SensorLab";
import { calendarSections } from "./FlipCalendarNav";
import { useBlackHoleTransition } from "./BlackHoleTransition";

const worksPreview = calendarSections.find((section) => section.isWorks).previewItems;

// WebGL, so it loads in the browser only, after the page.
const LanyardWall = dynamic(() => import("./LanyardWall"), { ssr: false });

function WorksHandDemo({ reduceMotion }) {
  const { navigate } = useBlackHoleTransition();
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <div className="relative aspect-[100/124] w-[min(360px,84vw)] sm:aspect-[780/380] sm:w-[min(720px,88%)]">
        <WorksFan items={worksPreview} onNavigate={navigate} interactive reduceMotion={reduceMotion} />
      </div>
    </div>
  );
}

// Add a piece by appending to this list: the stage renders `Demo` live.
const PIECES = [
  {
    id: "id-badge",
    title: "Badges on lanyards",
    description:
      "A pass from every job, hung on printed straps in WebGL. The strap is a simulated rope and the card a rigid body pinned to its end, so a drag swings it and knocks its neighbours. Each tap turns a badge over the same way, winding another half-twist into the strap and hitching it up; the seventh in a row lets the strap go, and it unwinds like a torsion spring.",
    tags: ["Three.js", "Rope physics", "Rigid body", "Torsion", "Canvas textures"],
    hint: "Drag a badge, or tap it to turn it over. Keep tapping.",
    stage: "h-[560px] sm:h-[640px]",
    Demo: LanyardWall,
  },
  {
    id: "buttons",
    title: "Buttons that answer back",
    description:
      "Six buttons, each with one interaction worth pressing twice: a pill that leans toward the cursor, a switch that squashes under your thumb, a like that bursts, a delete you have to hold, a download that becomes its own progress ring, and a copy that rolls over to say it worked.",
    tags: ["Micro-interactions", "Springs", "Hold gesture", "Clipboard"],
    hint: "Hover, press, hold. Every one of them does something.",
    // The grid sets its own height; the padding leaves room for the hint.
    stage: "pb-10",
    Demo: ButtonLab,
  },
  {
    id: "sensors",
    title: "Tilt it, shake it",
    description:
      "Interfaces that answer to the phone itself, like the home card you can shake to turn. A foil card that leans as you tilt, dice that tumble when you shake, and a marble that rolls around a bowl like a spirit level. On a laptop, the mouse stands in for the sensors.",
    tags: ["Device orientation", "Accelerometer", "Shake detection", "Haptics"],
    hint: "Best on a phone. On desktop, move or whip the mouse over them.",
    stage: "pb-10",
    Demo: SensorLab,
  },
  {
    id: "works-hand",
    title: "Works hand",
    description:
      "Selected work dealt as a hand of cards. On desktop they fan out and step aside for the one you hover; on a phone they stack into a deck that shuffles itself and swipes left and right.",
    tags: ["Responsive", "Hover", "Swipe", "View transitions"],
    hint: "Hover a card on desktop, swipe the deck on a phone.",
    stage: "h-[560px] sm:h-[460px]",
    Demo: WorksHandDemo,
  },
];

export default function UIShowcase() {
  const prefersReducedMotion = useReducedMotion();
  // useReducedMotion() is null on the server. Match the HTML first, then switch.
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    setReduceMotion(prefersReducedMotion === true);
  }, [prefersReducedMotion]);

  return (
    <div className="flex flex-col gap-14 sm:gap-20">
      {PIECES.map(({ id, title, description, tags, hint, stage, Demo }, index) => (
        <article key={id} id={id} className="scroll-mt-24" aria-labelledby={`${id}-title`}>
          <div
            // Interactive demos own their gestures: the site's swipe and flip handlers skip them.
            data-prevent-flip="true"
            className={`relative w-full overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm ${stage}`}
          >
            <Demo reduceMotion={reduceMotion} />
            <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center font-mono text-[11px] tracking-[0.02em] text-[#6e6e73]">
              {hint}
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-[1fr_1.4fr] sm:gap-10">
            <div>
              <p className="font-mono text-[11px] text-[#6e6e73]">{String(index + 1).padStart(2, "0")}</p>
              <h2 id={`${id}-title`} className="mt-1 text-xl font-semibold tracking-[-0.03em] text-[#1d1d1f] sm:text-2xl">
                {title}
              </h2>
            </div>
            <div>
              <p className="text-[14px] leading-relaxed text-[#515154]">{description}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Techniques">
                {tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-black/[0.06] bg-white px-2.5 py-1 text-[11px] font-medium text-[#515154]">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
