"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Github, Instagram, Linkedin, Mail, MessageSquare, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function MediumIcon({ size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="6" cy="12" r="5" /><ellipse cx="16" cy="12" rx="3" ry="5" /><ellipse cx="22" cy="12" rx="1" ry="4.5" /></svg>;
}

const SHOT_INTERVAL = 0.4;
const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/satyasainagubathula", icon: Linkedin, color: "#0077b5" },
  { label: "Instagram", href: "https://www.instagram.com/engineerudu", icon: Instagram, color: "#d62976" },
  { label: "Email", href: "mailto:nagubathula.satyasai@gmail.com", icon: Mail, color: "#d84a3c" },
  { label: "GitHub", href: "https://github.com/nagubathula", icon: Github, color: "#24292f" },
  { label: "Medium", href: "https://hippogriff.medium.com", icon: MediumIcon, color: "#24292f" },
];

export default function SocialBurst({ open, onToggle }) {
  const reduced = useReducedMotion();
  const trigger = useRef(null);
  const [compact, setCompact] = useState(true);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const sync = () => setCompact(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const launchX = (index) => -((compact ? index % 3 : index) + 1) * 52 - 6;
  const launchY = (index) => compact ? -Math.floor(index / 3) * 52 : 0;

  return (
    <div className="relative flex items-start gap-2" onKeyDown={(event) => {
      if (event.key === "Escape" && open) trigger.current?.focus();
    }}>
      <motion.button
        ref={trigger}
        type="button"
        onClick={onToggle}
        aria-label={open ? "Close contact options" : "Contact options"}
        aria-expanded={open}
        aria-controls="social-burst-links"
        initial={false}
        animate={reduced ? {} : { scale: open ? [1, 0.82, 1.12, 1] : 1, rotate: open ? [0, -9, 5, 0] : 0 }}
        transition={{ duration: SHOT_INTERVAL, ease: "easeOut", repeat: open && !reduced ? socials.length - 1 : 0 }}
        whileHover={reduced ? {} : { scale: 1.05 }}
        whileTap={reduced ? {} : { scale: 0.9 }}
        className={`relative z-20 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${open ? "border-[#1d1d1f] bg-[#1d1d1f] text-white" : "border-black/[0.06] bg-white text-[#1d1d1f]"}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={open ? "close" : "message"}
            initial={{ opacity: 0, scale: reduced ? 1 : 0.4, rotate: reduced ? 0 : -40 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: reduced ? 1 : 0.5, rotate: reduced ? 0 : 40 }}
            transition={{ duration: reduced ? 0.1 : 0.13 }}>
            {open ? <X size={20} aria-hidden="true" /> : <MessageSquare size={20} aria-hidden="true" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && !reduced && socials.map((social, shot) => (
          <motion.svg key={social.label} aria-hidden="true" viewBox="-90 -90 180 180"
            className="pointer-events-none absolute -left-[62px] top-7 z-30 h-[180px] w-[180px] -translate-y-1/2 overflow-visible"
            exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
            <motion.circle cx="0" cy="0" fill="none" stroke={social.color} strokeWidth="1.5"
              initial={{ r: 16, opacity: 0 }} animate={{ r: 60, opacity: [0, 0.6, 0] }} transition={{ duration: 0.36, delay: shot * SHOT_INTERVAL, ease: "easeOut" }} />
            {Array.from({ length: 12 }, (_, i) => {
              const angle = (i * Math.PI * 2) / 12;
              const x = Math.cos(angle), y = Math.sin(angle);
              return <motion.line key={i} stroke={social.color} strokeWidth={i % 2 ? 2 : 3} strokeLinecap="round"
                initial={{ x1: x * 18, y1: y * 18, x2: x * 24, y2: y * 24, opacity: 0 }}
                animate={{ x1: x * 65, y1: y * 65, x2: x * 73, y2: y * 73, opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.32, delay: shot * SHOT_INTERVAL + 0.04 + (i % 3) * 0.01, ease: "easeOut" }} />;
            })}
          </motion.svg>
        ))}
      </AnimatePresence>

      <div id="social-burst-links" className="grid grid-cols-3 gap-2 pt-1.5 sm:grid-cols-5">
        <AnimatePresence>
          {open && socials.map(({ label, href, icon: Icon, color }, index) => (
            <motion.a key={label} href={href} aria-label={label} title={label}
              target={href.startsWith("https:") ? "_blank" : undefined}
              rel={href.startsWith("https:") ? "noopener noreferrer" : undefined}
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: launchX(index), y: launchY(index), scale: 0.15, rotate: -35 }}
              animate={reduced ? { opacity: 1 } : { opacity: [0, 1, 1, 1], x: [launchX(index), 8, -3, 0], y: [launchY(index), -18, 3, 0], scale: [0.15, 1.15, 0.96, 1], rotate: [-35, 12, -4, 0] }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: launchX(index), y: launchY(index), scale: 0.15, rotate: -20, transition: { duration: reduced ? 0.1 : 0.2, delay: 0 } }}
              transition={{ duration: reduced ? 0.12 : 0.38, delay: reduced ? 0 : index * SHOT_INTERVAL + 0.04, times: [0, 0.6, 0.82, 1], ease: "easeOut" }}
              whileHover={reduced ? {} : { y: -4, scale: 1.08, transition: { duration: 0.16, delay: 0 } }}
              whileTap={reduced ? {} : { scale: 0.9 }}
              style={{ color }}
              className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/[0.06] bg-white shadow-[0_4px_14px_rgba(0,0,0,0.07)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
              <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
