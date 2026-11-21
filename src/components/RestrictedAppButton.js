"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Lock, LockOpen, X } from "lucide-react";
import Magnetic from "./Magnetic";
import { verifyAccessPin } from "@/lib/accessPin";
import { playPopSound } from "./SoundEffects";

export default function RestrictedAppButton({
  title,
  label = "Live App (Restricted)",
  repoUrl,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleOpen = () => {
    try {
      playPopSound(500, 0.08);
    } catch {}
    setPinError(false);
    setIsOpen(true);
  };

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPin(val);
    if (pinError) setPinError(false);
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (pin.length !== 6) return;
    if (await verifyAccessPin(pin)) {
      setUnlocked(true);
      setPin("");
      setPinError(false);
      try {
        playPopSound(520, 0.06);
      } catch {}
      return;
    }
    setPinError(true);
    setTimeout(() => setPin(""), 600);
  };

  return (
    <>
      <Magnetic max={6}>
        <button
          type="button"
          onClick={handleOpen}
          className="group inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-sm font-medium text-white shadow-[0_6px_20px_-8px_rgba(0,0,0,0.45)] transition-[background-color,transform,box-shadow] duration-200 hover:bg-[#333336] hover:shadow-[0_10px_28px_-10px_rgba(0,0,0,0.5)] active:scale-95"
        >
          {unlocked ? (
            <>
              <LockOpen size={15} className="text-emerald-400" />
              Internal Access Verified
            </>
          ) : (
            <>
              <Lock size={15} className="text-white/80" />
              {label}
            </>
          )}
        </button>
      </Magnetic>

      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white border border-black/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.12)] rounded-3xl p-6 sm:p-8 max-w-md w-[92vw] relative"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={unlocked ? "Internal access verified" : "Live app restricted"}
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 text-[#6e6e73] hover:text-[#1d1d1f] transition-colors p-1"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {unlocked ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-500/20 flex items-center justify-center text-emerald-600 mb-4">
                    <LockOpen size={20} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-sans font-semibold text-[#1d1d1f] mb-1.5">
                    Internal Access Verified
                  </h3>
                  <p className="text-sm text-[#6e6e73] font-sans mb-6 leading-relaxed">
                    The production deployment for{" "}
                    <span className="font-semibold text-[#1d1d1f]">{title}</span> is gated
                    behind organization Google OAuth via{" "}
                    <span className="font-semibold text-[#1d1d1f]">ContentHub</span>.
                  </p>
                  <div className="w-full flex flex-col gap-2.5">
                    {repoUrl && (
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#1d1d1f] text-white rounded-full text-sm font-sans font-medium hover:bg-[#333336] transition-all shadow-sm"
                      >
                        Open Team Repository
                        <ArrowUpRight
                          size={16}
                          className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    )}
                    <a
                      href={`mailto:nagubathula.satyasai@gmail.com?subject=${encodeURIComponent(`${title} Live Walkthrough`)}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#f5f5f7] text-[#1d1d1f] border border-black/[0.08] rounded-full text-sm font-sans font-medium hover:bg-white transition-all"
                    >
                      Request Live Walkthrough
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] mb-4">
                    <Lock size={20} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-sans font-semibold text-[#1d1d1f] mb-1.5">
                    Live App Restricted
                  </h3>
                  <p className="text-sm text-[#6e6e73] font-sans mb-6">
                    Enter the 6-digit access code to unlock internal workspace links for{" "}
                    <span className="font-semibold text-[#1d1d1f]">{title}</span>.
                  </p>

                  <form onSubmit={handlePinSubmit} className="w-full flex flex-col items-center">
                    <div className="relative mb-6 w-full flex justify-center">
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={pin}
                        onChange={handlePinChange}
                        autoFocus
                        placeholder="••••••"
                        className={`w-48 text-center tracking-[0.5em] text-2xl font-mono py-2.5 bg-[#f5f5f7] rounded-xl border outline-none transition-all ${
                          pinError
                            ? "border-red-500 bg-red-50/50 animate-shake"
                            : "border-black/[0.08] focus:border-black/[0.3] focus:bg-white"
                        }`}
                      />
                    </div>

                    {pinError && (
                      <p className="text-xs text-red-500 font-sans mb-4">
                        Incorrect PIN. Access denied.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={pin.length !== 6}
                      className="w-full py-3 bg-[#1d1d1f] text-white rounded-full text-sm font-sans font-medium hover:bg-[#333336] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                    >
                      Unlock Live Access
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
