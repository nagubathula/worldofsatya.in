"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { EASE_OUT, SPRING, workMediaStyle } from "@/lib/motion";
import { playWhooshSound } from "./SoundEffects";
import { stageStyle } from "./NoiseStage";

// Each card takes this share of the row and the rest is split into equal steps,
// so the fan always spans the row edge to edge with the cards overlapping.
const CARD_W = 32;

// Lifting and stepping aside: slower than a tap and with no overshoot, so the
// hand glides between cards instead of bouncing.
const SHUFFLE = { type: "spring", duration: 0.6, bounce: 0 };

// A deckled paper edge: a rounded card outline roughed up by noise. It's used as
// a mask, so only the edge frays and the screenshot inside stays crisp.
function deckleMask(seed) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 270" preserveAspectRatio="none">` +
    `<filter id="d" x="-5%" y="-5%" width="110%" height="110%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="${seed}"/>` +
    `<feDisplacementMap in="SourceGraphic" scale="7" xChannelSelector="R" yChannelSelector="G"/>` +
    `</filter><rect x="5" y="5" width="240" height="260" rx="20" filter="url(#d)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const DECKLES = Array.from({ length: 8 }, (_, i) => deckleMask(i + 3));

// On a phone a row of four leaves each card thumbnail-sized, so the hand becomes
// one stacked deck there. Matches Tailwind's sm breakpoint, which sizes the shell.
const COMPACT_QUERY = "(max-width: 639px)";
// Deck card width as % of the hand; each card behind peeks out a step to the right.
const DECK_W = 62;
const DECK_LEFT = 10;
// How long the top card rests, and how long it spends lifted before tucking under.
const DECK_REST = 2600;
const DECK_LIFT = 420;
// A swipe past this distance (px) or speed (px/s) changes the top card.
const DECK_SWIPE = 50;
const DECK_FLICK = 400;

function useCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(COMPACT_QUERY);
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return compact;
}

function CardFace({ item, mask, label = true }) {
  return (
    <span
      // The deckle mask sets the outline, so the stage drops its own rounding.
      className="noise-stage relative block h-full w-full !rounded-none"
      style={{
        ...stageStyle(item.slug),
        maskImage: mask,
        WebkitMaskImage: mask,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
      }}
    >
      {/* The app's own icon sits over the top of the screenshot, like it does in a dock. */}
      {item.logo && (
        <span className="absolute left-[9%] top-[7%] z-[2] block w-[24%] drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]">
          <Image src={item.logo} alt="" width={256} height={256} sizes="96px" className="h-auto w-full" />
        </span>
      )}
      {/* The screenshot floats on the stage, as it does on the project page it morphs into. */}
      <span
        className={`noise-stage-media absolute inset-x-[9%] bottom-0 z-[1] !rounded-b-none ${item.logo ? "top-[24%]" : "top-[11%]"}`}
        style={workMediaStyle(item.slug)}
      >
        <Image
          src={item.image}
          alt=""
          fill
          // Landscape shots cover a portrait card, so they draw ~1.6x wider than it.
          sizes="(min-width: 840px) 400px, 50vw"
          className="object-cover object-top"
        />
      </span>
      {/* Touch screens can't hover, so the names show there all the time. */}
      {label && (
        <span className="absolute bottom-[6%] left-[6%] z-[2] rounded-full bg-white/90 px-2.5 py-1 text-[12px] sm:px-2 sm:py-0.5 sm:text-[11px] font-medium tracking-[-0.01em] text-[#111111] opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 group-focus-visible/card:opacity-100 [@media(hover:none)]:opacity-100">
          {item.title}
        </span>
      )}
    </span>
  );
}

// Phones: the work as a squared-up deck. Every few seconds the top card lifts,
// swings up and tucks under the pile, so each project gets its turn on top.
// Pressing the deck holds the shuffle so a tap lands on the card you see; swiping
// the top card left tucks it under, swiping right pulls the bottom card back up.
function WorksDeck({ items, go, reduceMotion }) {
  const count = items.length;
  const [front, setFront] = useState(0);
  const [lifting, setLifting] = useState(false);
  const [held, setHeld] = useState(false);
  // The card under the finger follows it; it keeps the offset after letting go so
  // it springs home (or into the pile) from where it was dropped.
  const [draggedId, setDraggedId] = useState(null);
  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-200, 0, 200], [-14, 0, 14]);
  const gesture = useRef(null);
  // A drag ends in a click too; this swallows it so a swipe never opens the card.
  const dragged = useRef(false);

  const startDrag = (event) => {
    setHeld(true);
    if (count < 2) return;
    dragged.current = false;
    gesture.current = { id: event.pointerId, x: event.clientX, lastX: event.clientX, lastT: event.timeStamp, v: 0 };
    animate(dragX, 0, { duration: 0 });
    setDraggedId(items[front].id);
  };

  const moveDrag = (event) => {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    const dx = event.clientX - g.x;
    if (!dragged.current && Math.abs(dx) > 6) {
      dragged.current = true;
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {}
    }
    if (!dragged.current) return;
    const dt = event.timeStamp - g.lastT;
    if (dt > 0) g.v = ((event.clientX - g.lastX) / dt) * 1000;
    g.lastX = event.clientX;
    g.lastT = event.timeStamp;
    dragX.set(dx);
  };

  const endDrag = (event) => {
    setHeld(false);
    const g = gesture.current;
    gesture.current = null;
    if (!g || g.id !== event.pointerId || !dragged.current) return;
    const dx = event.clientX - g.x;
    const next = dx < -DECK_SWIPE || g.v < -DECK_FLICK;
    const prev = dx > DECK_SWIPE || g.v > DECK_FLICK;
    if (next || prev) {
      playWhooshSound({ pitch: next ? 1.2 : 0.95, volume: 0.12, duration: 0.32 });
      setLifting(false);
      setFront((current) => (current + (next ? 1 : count - 1)) % count);
    }
    animate(dragX, 0, SPRING.enter);
  };

  useEffect(() => {
    if (reduceMotion || held || count < 2) return;
    let liftTimer;
    const restTimer = setTimeout(() => {
      setLifting(true);
      liftTimer = setTimeout(() => {
        setFront((current) => (current + 1) % count);
        setLifting(false);
      }, DECK_LIFT);
    }, DECK_REST);
    return () => {
      clearTimeout(restTimer);
      clearTimeout(liftTimer);
    };
  }, [front, held, count, reduceMotion]);

  return (
    <div
      // The calendar's own swipes would flip away from the works; they skip this.
      data-prevent-flip="true"
      className="relative w-full flex-1 touch-pan-y"
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {items.map((item, index) => {
        const pos = (index - front + count) % count;
        const top = pos === 0;
        const up = top && lifting;
        const mask = DECKLES[index % DECKLES.length];

        return (
          <motion.div
            key={item.id}
            className="absolute aspect-[4/5]"
            style={{ top: "6%", left: `${DECK_LEFT}%`, width: `${DECK_W}%`, zIndex: count - pos, transformOrigin: "30% 90%" }}
            initial={reduceMotion ? false : { y: "16%", rotate: 0, opacity: 0 }}
            animate={
              up
                ? { x: "4%", y: "-24%", rotate: -9, scale: 1.04, opacity: 1 }
                : { x: `${pos * 11}%`, y: `${pos * 1.5}%`, rotate: -3 + pos * 6, scale: 1 - pos * 0.05, opacity: 1 }
            }
            transition={up ? { type: "spring", duration: DECK_LIFT / 1000, bounce: 0 } : SPRING.enter}
          >
            <motion.button
              type="button"
              tabIndex={top ? 0 : -1}
              aria-hidden={top ? undefined : true}
              aria-label={`${item.title}: ${item.blurb}`}
              onClick={(event) => {
                event.stopPropagation();
                if (top && !dragged.current) go(event, item.href);
              }}
              className="group/card relative block h-full w-full cursor-pointer rounded-[20px] outline-none focus-visible:ring-2 focus-visible:ring-[#0b9fd0] focus-visible:ring-offset-4"
              style={{
                x: item.id === draggedId ? dragX : 0,
                rotate: item.id === draggedId ? dragRotate : 0,
                filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.16)) drop-shadow(0 2px 5px rgba(0,0,0,0.07))",
              }}
            >
              <CardFace item={item} mask={mask} label={top} />
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
}

// Selected work as a hand of cards. Hover lifts a card out of the fan; a click
// morphs its screenshot into the project page (see workMediaStyle). The card group
// is named: the flip card around the fan is a `group` too.
export default function WorksFan({ items, onNavigate, interactive, reduceMotion }) {
  const [active, setActive] = useState(null);
  const compact = useCompact();
  const count = items.length;
  const activeIndex = items.findIndex((item) => item.id === active);

  const drop = (id) => setActive((current) => (current === id ? null : current));
  const step = count > 1 ? (100 - CARD_W) / (count - 1) : 0;

  const go = (event, href) => {
    event.stopPropagation();
    if (!interactive || !onNavigate) return;
    onNavigate(href, { x: event.clientX, y: event.clientY });
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      {compact ? (
        <WorksDeck items={items} go={go} reduceMotion={reduceMotion} />
      ) : (
      <div className="relative w-full flex-1">
        {items.map((item, index) => {
          const t = count > 1 ? index / (count - 1) : 0.5;
          const width = CARD_W;
          const left = count > 1 ? index * step : (100 - CARD_W) / 2;
          const top = "3%";
          // The tilt fans out left to right, and the middle cards ride a little higher.
          const tilt = -7 + 13.5 * t;
          const arc = 6 * (2 * t - 1) ** 2;
          // Cards are dealt from the middle of the hand out to their slots.
          const fromCenter = ((50 - width / 2 - left) / width) * 100;
          const mask = DECKLES[index % DECKLES.length];
          const lifted = active === item.id;
          // While one card is up, the rest step aside from it and sink back,
          // so it rises clear of them and a card let go slips behind its neighbours.
          const side = activeIndex < 0 || lifted ? 0 : Math.sign(index - activeIndex);
          const depth = activeIndex < 0 ? index + 1 : count - Math.abs(index - activeIndex);

          return (
            <motion.div
              key={item.id}
              className="absolute aspect-[25/27]"
              style={{
                top,
                left: `${left}%`,
                width: `${width}%`,
                zIndex: lifted ? count + 1 : depth,
              }}
              initial={reduceMotion ? false : { x: `${fromCenter}%`, y: "12%", rotate: 0, opacity: 0 }}
              animate={{ x: "0%", y: `${arc}%`, rotate: tilt, opacity: 1 }}
              transition={{ ...SPRING.enter, delay: 0.06 + index * 0.05 }}
            >
              {/* Dealing and lifting live on separate layers, so a hover never waits on the deal's delay. */}
              <motion.button
                type="button"
                aria-label={`${item.title}: ${item.blurb}`}
                onPointerEnter={(event) => event.pointerType === "mouse" && setActive(item.id)}
                onPointerLeave={() => drop(item.id)}
                onFocus={(event) => event.currentTarget.matches(":focus-visible") && setActive(item.id)}
                onBlur={() => drop(item.id)}
                onClick={(event) => go(event, item.href)}
                animate={
                  reduceMotion
                    ? { x: "0%", y: "0%", rotate: 0, scale: 1 }
                    : lifted
                    ? { x: "0%", y: "-7%", rotate: -tilt * 0.7, scale: 1.05 }
                    : side
                    ? { x: `${side * 16}%`, y: "3%", rotate: side * 2, scale: 0.94 }
                    : { x: "0%", y: "0%", rotate: 0, scale: 1 }
                }
                transition={SHUFFLE}
                className="group/card relative block h-full w-full cursor-pointer outline-none"
                style={{ filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.13)) drop-shadow(0 2px 5px rgba(0,0,0,0.06))" }}
              >
                <CardFace item={item} mask={mask} />
              </motion.button>
            </motion.div>
          );
        })}
      </div>
      )}

      <motion.button
        type="button"
        onClick={(event) => go(event, "/works")}
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.35 }}
        className="relative z-10 px-3 py-2 text-[13px] font-medium tracking-[-0.01em] text-[#0879a0] outline-none transition-colors hover:text-[#065f7e] focus-visible:underline"
      >
        view more works
      </motion.button>
    </div>
  );
}
