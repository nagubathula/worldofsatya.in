"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { EASE_OUT, SPRING, workMediaStyle } from "@/lib/motion";

// Each card takes this share of the row and the rest is split into equal steps,
// so the fan always spans the row edge to edge with the cards overlapping.
const CARD_W = 32;

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

// Selected work as a hand of cards. Hover lifts a card out of the fan; a click
// morphs its screenshot into the project page (see workMediaStyle).
export default function WorksFan({ items, onNavigate, interactive, reduceMotion }) {
  const [active, setActive] = useState(null);
  const count = items.length;
  const step = count > 1 ? (100 - CARD_W) / (count - 1) : 0;

  const go = (event, href) => {
    event.stopPropagation();
    if (!interactive || !onNavigate) return;
    onNavigate(href, { x: event.clientX, y: event.clientY });
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      <div className="relative w-full flex-1">
        {items.map((item, index) => {
          const t = count > 1 ? index / (count - 1) : 0.5;
          const left = count > 1 ? index * step : (100 - CARD_W) / 2;
          // The tilt fans out left to right, and the middle cards ride a little higher.
          const tilt = -7 + 13.5 * t;
          const arc = 6 * (2 * t - 1) ** 2;
          // Cards are dealt from the middle of the row out to their slots.
          const fromCenter = ((50 - CARD_W / 2 - left) / CARD_W) * 100;
          const mask = DECKLES[index % DECKLES.length];
          const lifted = active === item.id;

          return (
            <motion.div
              key={item.id}
              className="absolute top-[3%] aspect-[25/27]"
              style={{ left: `${left}%`, width: `${CARD_W}%`, zIndex: lifted ? count + 1 : index + 1 }}
              initial={reduceMotion ? false : { x: `${fromCenter}%`, y: "12%", rotate: 0, opacity: 0 }}
              animate={{ x: "0%", y: `${arc}%`, rotate: tilt, opacity: 1 }}
              transition={{ ...SPRING.enter, delay: 0.06 + index * 0.05 }}
            >
              {/* Dealing and lifting live on separate layers, so a hover never waits on the deal's delay. */}
              <motion.button
                type="button"
                aria-label={`${item.title}: ${item.blurb}`}
                onPointerEnter={(event) => event.pointerType === "mouse" && setActive(item.id)}
                onPointerLeave={() => setActive(null)}
                onFocus={(event) => event.currentTarget.matches(":focus-visible") && setActive(item.id)}
                onBlur={() => setActive(null)}
                onClick={(event) => go(event, item.href)}
                animate={
                  lifted && !reduceMotion
                    ? { y: "-7%", rotate: -tilt * 0.7, scale: 1.05 }
                    : { y: "0%", rotate: 0, scale: 1 }
                }
                transition={SPRING.press}
                className="group relative block h-full w-full cursor-pointer outline-none"
                style={{ filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.13)) drop-shadow(0 2px 5px rgba(0,0,0,0.06))" }}
              >
                <span
                  className="relative block h-full w-full bg-[#e5e5e5]"
                  style={{ maskImage: mask, WebkitMaskImage: mask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
                >
                  <span className="absolute inset-0" style={workMediaStyle(item.slug)}>
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 840px) 250px, 30vw"
                      className="object-cover object-top"
                    />
                  </span>
                  {/* Touch screens can't hover, so the names show there all the time. */}
                  <span className="absolute bottom-[6%] left-[6%] rounded-full bg-white/90 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium tracking-[-0.01em] text-[#111111] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
                    {item.title}
                  </span>
                </span>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        type="button"
        onClick={(event) => go(event, "/works")}
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.35 }}
        className="relative z-10 pb-1 text-[13px] font-medium tracking-[-0.01em] text-[#2ec4f0] outline-none transition-colors hover:text-[#0b9fd0] focus-visible:underline"
      >
        view more works
      </motion.button>
    </div>
  );
}
