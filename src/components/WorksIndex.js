"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { EASE_OUT, SPRING, workMediaStyle } from "@/lib/motion";

const PREVIEW_W = 200;
const PREVIEW_H = 128;
const GAP = 22;

const listReveal = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

// Each name rises out of its own line, like type being set.
const nameReveal = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 0.7, ease: EASE_OUT } },
};

const ruleReveal = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.8, ease: EASE_OUT } },
};

const fadeReveal = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE_OUT, delay: 0.2 } },
};

// A typographic index of selected work. Names carry the page; a screenshot
// follows the pointer and tilts with its speed, and morphs into the project
// page on click (see workMediaStyle).
export default function WorksIndex({ items, onNavigate, interactive, reduceMotion }) {
  const rootRef = useRef(null);
  const placed = useRef(false);
  const [active, setActive] = useState(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Follow springs stay local: they track the pointer, they don't express an event.
  const followX = useSpring(x, { stiffness: 360, damping: 34, mass: 0.6 });
  const followY = useSpring(y, { stiffness: 360, damping: 34, mass: 0.6 });
  const speedX = useVelocity(followX);
  const lean = useTransform(speedX, [-1400, 0, 1400], [-9, 0, 9], { clamp: true });
  const tilt = useSpring(lean, { stiffness: 260, damping: 26 });

  const place = (nextX, nextY) => {
    const root = rootRef.current;
    if (!root) return;
    const maxX = root.clientWidth - PREVIEW_W;
    const maxY = root.clientHeight - PREVIEW_H;
    const px = Math.max(0, Math.min(nextX, maxX));
    const py = Math.max(0, Math.min(nextY, maxY));
    if (!placed.current || reduceMotion) {
      x.jump(px);
      y.jump(py);
      followX.jump(px);
      followY.jump(py);
      placed.current = true;
    } else {
      x.set(px);
      y.set(py);
    }
  };

  const placeAtPointer = (event) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    // Sit beside the pointer, flipping sides near the right edge.
    const besideX = localX + GAP + PREVIEW_W > rect.width ? localX - GAP - PREVIEW_W : localX + GAP;
    place(besideX, localY - PREVIEW_H / 2);
  };

  const placeAtRow = (row) => {
    const root = rootRef.current;
    if (!root || !row) return;
    place(root.clientWidth - PREVIEW_W, row.offsetTop + row.offsetHeight / 2 - PREVIEW_H / 2);
  };

  const clear = () => {
    setActive(null);
    placed.current = false;
  };

  const activeItem = items.find((item) => item.id === active);

  return (
    <motion.div
      ref={rootRef}
      className="relative w-full h-full flex flex-col justify-center"
      variants={reduceMotion ? undefined : listReveal}
      initial={reduceMotion ? false : "hidden"}
      animate="show"
      onPointerMove={(event) => {
        if (event.pointerType === "mouse" && active) placeAtPointer(event);
      }}
      onPointerLeave={clear}
    >
      <motion.div
        variants={reduceMotion ? undefined : fadeReveal}
        className="flex items-baseline justify-between pb-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#8e8e93]"
      >
        <span>Selected work</span>
        <span>({String(items.length).padStart(2, "0")})</span>
      </motion.div>

      <ul className="relative">
        {items.map((item, index) => {
          const dimmed = active && active !== item.id;
          return (
            <li key={item.id} className="relative">
              <motion.span
                aria-hidden="true"
                variants={reduceMotion ? undefined : ruleReveal}
                className="absolute inset-x-0 top-0 h-px origin-left bg-black/[0.08]"
              />
              <button
                type="button"
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse") return;
                  placeAtPointer(event);
                  setActive(item.id);
                }}
                onFocus={(event) => {
                  // Keyboard focus only; a click would yank the preview away from the pointer.
                  if (!event.currentTarget.matches(":focus-visible")) return;
                  placeAtRow(event.currentTarget);
                  setActive(item.id);
                }}
                onBlur={clear}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!interactive || !onNavigate) return;
                  onNavigate(item.href, { x: event.clientX, y: event.clientY });
                }}
                className="group/row relative flex w-full items-center gap-3 sm:gap-4 py-2.5 sm:py-3 text-left cursor-pointer outline-none"
              >
                <motion.span
                  variants={reduceMotion ? undefined : fadeReveal}
                  className="w-5 shrink-0 font-mono text-[10px] sm:text-[11px] tabular-nums text-[#8e8e93]"
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.span>

                {/* Reveal and hover live on separate layers: an element with its own
                    animate prop stops following the list's stagger. */}
                <span className="relative overflow-hidden min-w-0">
                  <motion.span className="block" variants={reduceMotion ? undefined : nameReveal}>
                    <motion.span
                      animate={{ opacity: dimmed ? 0.22 : 1, x: active === item.id && !reduceMotion ? 8 : 0 }}
                      transition={SPRING.enter}
                      className="block truncate text-[26px] sm:text-[32px] lg:text-[34px] font-semibold leading-[1.1] tracking-[-0.035em] text-[#111111]"
                    >
                      {item.title}
                    </motion.span>
                  </motion.span>
                </span>

                <motion.span
                  variants={reduceMotion ? undefined : fadeReveal}
                  className="ml-auto hidden sm:flex shrink-0 [@media(hover:none)]:hidden"
                >
                  <motion.span
                    animate={{ opacity: dimmed ? 0.22 : 1 }}
                    transition={SPRING.enter}
                    className="flex items-center gap-1.5 text-[12px] text-[#86868b]"
                  >
                    {item.blurb}
                    <ArrowUpRight
                      size={13}
                      className="text-[#111111] opacity-0 -translate-x-1 translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/row:opacity-100 group-hover/row:translate-x-0 group-hover/row:translate-y-0 group-focus-visible/row:opacity-100"
                    />
                  </motion.span>
                </motion.span>

                {/* Touch screens can't hover, so each row shows its own thumbnail. */}
                <span
                  className="ml-auto hidden [@media(hover:none)]:block relative h-9 w-14 shrink-0 overflow-hidden rounded-lg bg-[#f4f4f6]"
                  style={workMediaStyle(item.slug)}
                >
                  <Image src={item.image} alt="" fill sizes="56px" className="object-cover object-top" />
                </span>
              </button>
            </li>
          );
        })}
        <motion.span
          aria-hidden="true"
          variants={reduceMotion ? undefined : ruleReveal}
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-black/[0.08]"
        />
      </ul>

      <motion.div
        variants={reduceMotion ? undefined : fadeReveal}
        className="flex justify-end pt-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#8e8e93] group-hover:text-[#111111] transition-colors"
      >
        <span className="inline-flex items-center gap-1">
          All works
          <ArrowUpRight size={12} />
        </span>
      </motion.div>

      {/* Floating preview. All images stay mounted so switching rows is instant. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 overflow-hidden rounded-xl bg-[#f4f4f6] shadow-[0_18px_48px_rgba(0,0,0,0.16)] [@media(hover:none)]:hidden"
        style={{
          width: PREVIEW_W,
          height: PREVIEW_H,
          x: followX,
          y: followY,
          rotate: reduceMotion ? 0 : tilt,
          ...workMediaStyle(activeItem?.slug),
        }}
        initial={false}
        animate={activeItem ? { opacity: 1, scale: 1 } : { opacity: 0, scale: reduceMotion ? 1 : 0.7 }}
        transition={SPRING.press}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            className="absolute inset-0"
            initial={false}
            animate={
              item.id === active
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: reduceMotion ? 1 : 1.12 }
            }
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <Image
              src={item.image}
              alt=""
              fill
              loading="eager"
              sizes={`${PREVIEW_W}px`}
              className="object-cover object-top"
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
