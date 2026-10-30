"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import ChibiAvatar from "./ChibiAvatar";
import { EASE_OUT, SPRING } from "@/lib/motion";

// Scrolling less than this is a wobble, not a direction.
const JITTER = 6;
// Near the top there is nothing under the face to cover.
const TOP = 80;
// Long enough to cross from the face into the menu without it closing.
const CLOSE_DELAY = 160;

// The shape: a 48px circle round the face at the top centre of the screen, like
// a notch, that opens downwards and outwards into a card this wide. The face
// stays put at the top and the pages are centred under it.
const FACE = 48;
const CARD_W = 168;
const LIST_TOP = FACE + 2;
// One soft, bounce-free motion, so the circle reads as growing into the card
// rather than being swapped for it.
const MORPH = { type: "spring", stiffness: 260, damping: 32, mass: 0.9 };
// On a page with a socket for it (the About page's Venn centre), the notch sits
// in the socket and rides up with it, docking at the top once the socket passes.
// Over this many pixels below the top it eases from socket size to notch size.
const DOCK_RANGE = 160;

const PAGES = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Works", href: "/works" },
  { label: "UI", href: "/ui" },
  { label: "Gallery", href: "/gallery" },
];

function isCurrent(pathname, href) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

const faceClass =
  "block h-12 w-12 rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-[#2ec4f0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]";

// The pages arrive one after another as the card opens, and all leave at once
// as it closes, so closing never waits on them.
const list = {
  open: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
  closed: { transition: { staggerChildren: 0 } },
};
const item = {
  open: { opacity: 1, y: 0, transition: { duration: 0.26, ease: EASE_OUT } },
  closed: { opacity: 0, y: -6, transition: { duration: 0.1 } },
};

// The face from the home page, kept in the corner of every other page as a dark
// round button. Click it to go home; hover it (tap it on a phone) and the
// circle grows into a card with the site's pages under the face. No navbar
// until you ask for one. It ducks out while you scroll down to read and comes
// back when you scroll up.
export default function HomeFace() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  // Phones can't hover, so there the face is a button that opens the menu.
  const [touch, setTouch] = useState(false);
  // The open card is as tall as its list, measured once it is on the page.
  const [listHeight, setListHeight] = useState(0);
  const closeTimer = useRef(null);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const stripRef = useRef(null);
  // Where the notch is riding: offset from its docked spot, and its size.
  const rideX = useMotionValue(0);
  const rideY = useMotionValue(0);
  const rideScale = useMotionValue(1);
  const isOpen = useMotionValue(0);
  // Open, the menu is always its normal size, wherever the notch is.
  const scale = useTransform([rideScale, isOpen], ([s, o]) => (o ? 1 : s));
  const riding = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(hover: none)");
    const sync = () => setTouch(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (listRef.current) setListHeight(listRef.current.offsetHeight);
  }, [pathname]);

  useEffect(() => {
    isOpen.set(open ? 1 : 0);
  }, [open, isOpen]);

  // Follow the socket, if this page has one. Every frame, so it stays glued
  // through smooth scrolling and the page's own entrance.
  useEffect(() => {
    let frame;
    const follow = () => {
      const core = document.querySelector("[data-venn-core]");
      const strip = stripRef.current;
      if (core && strip) {
        const c = core.getBoundingClientRect();
        const dockY = strip.getBoundingClientRect().top + FACE / 2;
        const dy = Math.max(0, c.top + c.height / 2 - dockY);
        const t = Math.min(dy / DOCK_RANGE, 1);
        rideY.set(dy);
        rideX.set((c.left + c.width / 2 - window.innerWidth / 2) * t);
        // Inside the socket, the face fills it like the old picture did.
        rideScale.set(1 + ((c.width * 0.86) / FACE - 1) * t);
        riding.current = dy > 0;
      } else if (riding.current || rideY.get() !== 0) {
        rideX.set(0);
        rideY.set(0);
        rideScale.set(1);
        riding.current = false;
      }
      frame = requestAnimationFrame(follow);
    };
    frame = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(frame);
  }, [pathname, rideX, rideY, rideScale]);

  useEffect(() => {
    setHidden(false);
    setOpen(false);
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < JITTER) return;
      // Riding in the socket it scrolls with the page, so it never ducks out.
      const down = y > lastY && y > TOP && !riding.current;
      setHidden(down);
      if (down) setOpen(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Esc or a tap anywhere else closes the menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      // Ours, not the page's "go up a level".
      e.preventDefault();
      setOpen(false);
    };
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  if (pathname === "/") return null;

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  const face = <ChibiAvatar className="h-full w-full" />;

  // Its own transition name keeps it still while the page changes under it.
  // The strip spans the top of the screen only to centre the shape; it lets
  // clicks through everywhere else.
  return (
    <>
    {/* While the notch is open the page behind it softly blurs, so the menu is
        the only thing in focus. A tap on the blur closes it. */}
    <AnimatePresence>
      {open && (
        <motion.div
          key="notch-backdrop"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="fixed inset-0 z-40 bg-white/30 backdrop-blur-md"
        />
      )}
    </AnimatePresence>
    <div ref={stripRef} className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center sm:top-6">
    <motion.div style={{ x: rideX, y: rideY, scale, transformOrigin: `50% ${FACE / 2}px` }}>
    <motion.div
      ref={rootRef}
      data-home-face
      style={{ viewTransitionName: "home-face" }}
      animate={hidden ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
      transition={SPRING.enter}
      // On touch-first screens the tap alone opens and closes it.
      onPointerEnter={(e) => !touch && e.pointerType === "mouse" && show()}
      onPointerLeave={(e) => !touch && e.pointerType === "mouse" && hideSoon()}
      // Tabbing to it brings it back and opens the menu, so keyboard users get it
      // too. A mouse click also focuses it, but hover already handles the mouse.
      onFocus={(e) => {
        setHidden(false);
        if (e.target.matches(":focus-visible")) show();
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) hideSoon();
      }}
      className={hidden ? "pointer-events-none" : "pointer-events-auto"}
    >
      {/* One shape, sized for real (not scaled), so the border, shadow and face
          never stretch: a circle that grows into the card. A 24px radius on a
          48px box is the circle, and the card's corners. */}
      <motion.div
        initial={false}
        animate={
          open
            ? { width: CARD_W, height: LIST_TOP + listHeight }
            : { width: FACE, height: FACE }
        }
        transition={MORPH}
        style={{ borderRadius: 24 }}
        className="relative overflow-hidden border border-white/10 bg-[#1a1a1a] shadow-[0_10px_30px_rgba(0,0,0,0.22)]"
      >
        {/* The face never moves: the card grows out from under it, evenly both ways. */}
        <div className="absolute -top-px left-1/2" style={{ marginLeft: -FACE / 2 }}>
          {touch ? (
            <button type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} className={faceClass}>
              {face}
            </button>
          ) : (
            <Link href="/" aria-label="Home" className={faceClass}>
              {face}
            </Link>
          )}
        </div>

        {/* Always on the page, so the card knows its height; out of reach while closed. */}
        <motion.nav
          ref={listRef}
          aria-label="Pages"
          inert={!open}
          initial={false}
          animate={open ? "open" : "closed"}
          variants={list}
          className="absolute left-1/2 px-2 pb-4"
          style={{ top: LIST_TOP, width: CARD_W, marginLeft: -CARD_W / 2 }}
        >
          <ul className="flex flex-col items-center">
            {PAGES.map((page) => (
              <motion.li key={page.href} variants={item}>
                <Link
                  href={page.href}
                  aria-current={isCurrent(pathname, page.href) ? "page" : undefined}
                  className="block rounded-xl px-3 py-1 text-[22px] font-semibold leading-tight tracking-[-0.02em] text-white outline-none transition-colors hover:text-white/70 focus-visible:bg-white/10"
                >
                  {page.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      </motion.div>
    </motion.div>
    </motion.div>
    </div>
    </>
  );
}
