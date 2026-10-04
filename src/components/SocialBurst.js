"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Github, Instagram, Linkedin, Mail, MessageSquare, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { playPopSound, playSocialBurstSound } from "./SoundEffects";

function MediumIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="6" cy="12" r="5" />
      <ellipse cx="16" cy="12" rx="3" ry="5" />
      <ellipse cx="22" cy="12" rx="1" ry="4.5" />
    </svg>
  );
}

const SHOT_INTERVAL = 0.15;
const WIND_UP = 0.12;
const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/satyasainagubathula", icon: Linkedin, color: "#0077b5" },
  { label: "Instagram", href: "https://www.instagram.com/engineerudu", icon: Instagram, color: "#d62976" },
  { label: "Email", href: "mailto:nagubathula.satyasai@gmail.com", icon: Mail, color: "#d84a3c" },
  { label: "GitHub", href: "https://github.com/nagubathula", icon: Github, color: "#24292f" },
  { label: "Medium", href: "https://hippogriff.medium.com", icon: MediumIcon, color: "#24292f" },
];

export default function SocialBurst({ open, onToggle }) {
  const trigger = useRef(null);
  const stopSound = useRef(() => {});

  useEffect(() => {
    if (!open) stopSound.current();
  }, [open]);

  useEffect(() => {
    const handleMute = (event) => {
      if (!event.detail) stopSound.current();
    };
    window.addEventListener("portfolio-sound-change", handleMute);
    return () => {
      stopSound.current();
      window.removeEventListener("portfolio-sound-change", handleMute);
    };
  }, []);

  const handleToggle = () => {
    stopSound.current();
    if (!open) {
      stopSound.current = playSocialBurstSound({
        count: socials.length,
        interval: SHOT_INTERVAL,
        delay: WIND_UP,
      });
    } else {
      playPopSound(460, 0.1);
    }
    onToggle();
  };

  const [compact, setCompact] = useState(true);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const sync = () => setCompact(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const launchX = (index) => -((compact ? index % 3 : index) + 1) * 52 - 6;
  const launchY = (index) => (compact ? -Math.floor(index / 3) * 52 : 0);

  return (
    <div
      className="relative flex h-[108px] w-[212px] shrink-0 items-start gap-2 sm:h-14 sm:w-[316px]"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) trigger.current?.focus();
      }}
    >
      {/* Laser Cannon / Recoil Trigger Button */}
      <motion.button
        ref={trigger}
        type="button"
        onClick={handleToggle}
        aria-label={open ? "Close contact options" : "Contact options"}
        aria-expanded={open}
        aria-controls="social-burst-links"
        initial={false}
        animate={{ scale: open ? [1, 1.08, 0.985, 1] : 1 }}
        transition={
          open
            ? { duration: SHOT_INTERVAL, delay: WIND_UP, times: [0, 0.4, 0.75, 1], ease: "easeInOut", repeat: socials.length - 1 }
            : { duration: 0.12 }
        }
        className={`relative z-20 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
          open ? "border-[#1d1d1f] bg-[#1d1d1f] text-white" : "border-black/[0.06] bg-white text-[#1d1d1f]"
        }`}
      >
        <motion.span
          className="flex"
          initial={false}
          animate={{
            scale: open ? [1, 0.7, 1.08, 1] : 1,
            rotate: open ? [0, -18, 6, 0] : 0,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "message"}
              initial={{ opacity: 0, scale: 0.4, rotate: -40 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 40 }}
              transition={{ duration: 0.13 }}
            >
              {open ? <X size={20} aria-hidden="true" /> : <MessageSquare size={20} aria-hidden="true" />}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </motion.button>

      {/* Shockwave Radial Ring and Laser Ray Emitters */}
      {open && (
        <svg
          aria-hidden="true"
          viewBox="-70 -70 140 140"
          className="pointer-events-none absolute -left-[42px] top-7 z-30 h-[140px] w-[140px] -translate-y-1/2 overflow-visible"
        >
          <motion.circle
            cx="0"
            cy="0"
            fill="none"
            stroke="#89939b"
            strokeWidth="1"
            initial={{ r: 20, opacity: 0 }}
            animate={{ r: 52, opacity: [0, 0.45, 0] }}
            transition={{ duration: 0.4, delay: WIND_UP, ease: "easeOut" }}
          />
          {socials.map((social, shot) =>
            [-0.55, 0, 0.55].map((angle, ray) => {
              const x = Math.cos(angle);
              const y = Math.sin(angle);
              return (
                <motion.line
                  key={social.label + ray}
                  stroke={social.color}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  initial={{ x1: x * 24, y1: y * 24, x2: x * 28, y2: y * 28, opacity: 0 }}
                  animate={{ x1: x * 42, y1: y * 42, x2: x * 47, y2: y * 47, opacity: [0, 0.75, 0] }}
                  transition={{ duration: 0.22, delay: WIND_UP + shot * SHOT_INTERVAL, ease: "easeOut" }}
                />
              );
            })
          )}
        </svg>
      )}

      {/* Projectile Social Icons Shooting into Place */}
      <div id="social-burst-links" className="grid grid-cols-3 gap-2 pt-1.5 sm:grid-cols-5">
        <AnimatePresence>
          {open &&
            socials.map(({ label, href, icon: Icon, color }, index) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                target={href.startsWith("https:") ? "_blank" : undefined}
                rel={href.startsWith("https:") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, x: launchX(index), y: launchY(index), scale: 0.3, rotate: -18 }}
                animate={{
                  opacity: [0, 1, 1, 1],
                  x: [launchX(index), 5, -1, 0],
                  y: [launchY(index), -10, 1, 0],
                  scale: [0.3, 1.06, 0.99, 1],
                  rotate: [-18, 5, -1, 0],
                }}
                exit={{
                  opacity: 0,
                  x: launchX(index),
                  y: launchY(index),
                  scale: 0.3,
                  rotate: -12,
                  transition: { duration: 0.18, delay: (socials.length - 1 - index) * 0.035, ease: "easeIn" },
                }}
                transition={{
                  duration: 0.38,
                  delay: WIND_UP + index * SHOT_INTERVAL,
                  times: [0, 0.6, 0.82, 1],
                  ease: "easeOut",
                }}
                whileHover={{ y: -4, scale: 1.08, transition: { duration: 0.16, delay: 0 } }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  try {
                    playPopSound(660, 0.12);
                  } catch {}
                }}
                style={{ color }}
                className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/[0.06] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.07)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
              </motion.a>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
