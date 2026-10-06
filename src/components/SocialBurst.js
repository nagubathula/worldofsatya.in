"use client";

import { AnimatePresence, motion, useSpring, useMotionValue } from "framer-motion";
import { Github, Instagram, Linkedin, Mail, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { play8BitTapSound, playPopSound, playSocialBurstSound } from "./SoundEffects";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Magnetic cursor spring tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 260, mass: 0.2 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    if (!trigger.current) return;
    const rect = trigger.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(Math.max(-10, Math.min(10, (e.clientX - centerX) * 0.25)));
    mouseY.set(Math.max(-10, Math.min(10, (e.clientY - centerY) * 0.25)));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    try {
      play8BitTapSound();
    } catch {}
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    mouseX.set(0);
    mouseY.set(0);
  };

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
      {/* Rive-Style Laser Cannon Trigger Button */}
      <motion.div
        style={{
          x: magneticX,
          y: magneticY,
        }}
        className="relative z-20 shrink-0 select-none"
      >
        <motion.button
          ref={trigger}
          type="button"
          onClick={handleToggle}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          aria-label={open ? "Close contact options" : "Contact options"}
          aria-expanded={open}
          aria-controls="social-burst-links"
          initial={false}
          animate={{
            scaleX: isPressed ? 1.08 : isHovered ? 1.03 : open ? [1, 1.08, 0.985, 1] : 1,
            scaleY: isPressed ? 0.88 : isHovered ? 1.03 : open ? [1, 1.08, 0.985, 1] : 1,
            y: isPressed ? 2 : isHovered ? -1 : 0,
          }}
          transition={
            open
              ? { duration: SHOT_INTERVAL, delay: WIND_UP, times: [0, 0.4, 0.75, 1], ease: "easeInOut", repeat: socials.length - 1 }
              : { type: "spring", stiffness: 400, damping: 18 }
          }
          className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 overflow-hidden ${
            open ? "border-[#1d1d1f] bg-[#1d1d1f] text-white" : "border-black/[0.08] bg-white text-[#1d1d1f]"
          }`}
        >
          {/* Ambient Glow */}
          <motion.div
            animate={{
              opacity: isHovered && !open ? 1 : 0,
              scale: isHovered ? 1 : 0.8,
            }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"
          />

          <motion.span
            className="flex items-center justify-center pointer-events-none"
            initial={false}
            animate={{
              scale: open ? [1, 0.7, 1.08, 1] : 1,
              rotate: open ? [0, -18, 6, 0] : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, scale: 0.4, rotate: -40 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 40 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={20} aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="message"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  {/* Rive Animated Vector Speech Bubble with Typing Dots */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="overflow-visible">
                    <motion.path
                      d="M21 11.5C21 16.1944 16.9706 20 12 20C10.4285 20 8.94827 19.6171 7.66667 18.9412L3 20L4.28571 16.2778C3.47953 14.8872 3 13.2543 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 21 6.80558 21 11.5Z"
                      stroke="#1d1d1f"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      animate={{
                        scale: isHovered ? [1, 1.04, 1] : 1,
                      }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {/* 3 Sequential Typing Dots */}
                    <g>
                      {[8, 12, 16].map((cx, idx) => (
                        <motion.circle
                          key={cx}
                          cx={cx}
                          cy="11.5"
                          r="1.3"
                          fill="#1d1d1f"
                          animate={{
                            y: isHovered ? [-1.6, 1.4, -1.6] : [0, -1, 0],
                            opacity: [0.35, 1, 0.35],
                          }}
                          transition={{
                            duration: 1.1,
                            repeat: Infinity,
                            delay: idx * 0.16,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </g>
                  </svg>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.span>

          {/* Micro Bevel Gloss Highlight */}
          <div className="absolute inset-0 rounded-2xl border border-white/60 pointer-events-none" />
        </motion.button>
      </motion.div>

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
      <div id="social-burst-links" className="grid grid-cols-3 gap-2.5 pt-1 sm:grid-cols-5">
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
                custom={index}
                initial={{
                  opacity: 0,
                  x: launchX(index),
                  y: launchY(index),
                  scale: 0.3,
                  rotate: -16,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 380,
                    damping: 20,
                    mass: 0.7,
                    delay: WIND_UP + index * SHOT_INTERVAL,
                  },
                }}
                exit={{
                  opacity: 0,
                  x: launchX(index),
                  y: launchY(index),
                  scale: 0.3,
                  rotate: -10,
                  transition: {
                    duration: 0.18,
                    delay: (socials.length - 1 - index) * 0.035,
                    ease: "easeIn",
                  },
                }}
                whileHover={{
                  y: -4,
                  scale: 1.08,
                  transition: { type: "spring", stiffness: 450, damping: 18 },
                }}
                whileTap={{
                  scale: 0.92,
                  transition: { duration: 0.1 },
                }}
                onClick={() => {
                  try {
                    playPopSound(660, 0.12);
                  } catch {}
                }}
                style={{ color }}
                className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/[0.08] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 overflow-hidden"
              >
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
              </motion.a>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
