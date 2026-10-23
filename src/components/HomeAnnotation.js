"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

const INK = "#2ec4f0";
// Set in the site's sans, like everything else; the drawn arrow keeps it a note.
const HAND = undefined;

// The arrow draws itself, then the words write in left to right, as if
// someone just scribbled the note next to the face.
function draw(delay) {
  return {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { pathLength: { duration: 0.55, ease: EASE_OUT, delay }, opacity: { duration: 0.01, delay } },
  };
}

// The clip leaves slack on every side: handwriting leans past its own box,
// and a tight clip would shave the ends of the letters off.
function write(delay) {
  return {
    initial: { clipPath: "inset(-20% 100% -20% -10%)" },
    animate: { clipPath: "inset(-20% -15% -20% -10%)" },
    transition: { duration: 0.7, ease: EASE_OUT, delay },
  };
}

const STILL = { initial: false, transition: { duration: 0 } };

// A hand-drawn arrow: a stroke from the face to the words, then its head.
function Arrow({ width, height, line, head, delay, reduceMotion }) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" className="shrink-0 overflow-visible">
      <motion.path d={line} stroke={INK} strokeWidth="2.5" strokeLinecap="round" {...(reduceMotion ? STILL : draw(delay))} />
      <motion.path
        d={head}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...(reduceMotion ? STILL : draw(delay + 0.45))}
      />
    </svg>
  );
}

// One handwritten note beside the home face, as in the sketch: an arrow from
// the face's shoulder to "AI + Design Engineer". One note reads as a
// signature; more start to read as labels.
export default function HomeAnnotation({ delay = 0, reduceMotion }) {
  const words = reduceMotion ? STILL : write(delay + 0.4);

  return (
    <motion.div
      aria-hidden="true"
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="pointer-events-none absolute inset-0 z-20 select-none"
    >
      {/* Wide screens: in the margin to the right of the face. */}
      <div className="absolute left-[calc(50%+46px)] top-[-30px] hidden -rotate-3 items-start lg:flex">
        <Arrow
          width={64}
          height={48}
          line="M4 44 C 10 28, 26 14, 52 14"
          head="M44 6 L 54 14 L 45 22"
          delay={delay}
          reduceMotion={reduceMotion}
        />
        <motion.span {...words} style={HAND} className="ml-1.5 whitespace-nowrap text-[22px] font-semibold leading-none tracking-[-0.02em] text-[#111111]">
          AI + Design Engineer
        </motion.span>
      </div>

      {/* Phones and tablets: no room beside the face, so it sits above, pointing down. */}
      <div className="absolute bottom-[calc(100%-4px)] left-[calc(50%+6px)] flex -rotate-2 flex-col items-start lg:hidden">
        <motion.span {...words} style={HAND} className="ml-6 text-[17px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#111111] sm:text-[18px]">
          AI + Design
          <br />
          Engineer
        </motion.span>
        <div className="mt-0.5">
          <Arrow width={44} height={36} line="M30 4 C 26 18, 16 26, 6 30" head="M14 24 L 6 30 L 15 33" delay={delay} reduceMotion={reduceMotion} />
        </div>
      </div>
    </motion.div>
  );
}
