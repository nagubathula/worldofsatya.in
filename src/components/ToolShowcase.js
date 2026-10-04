"use client";

import { useState } from "react";
import { Lock, X, Wrench } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import TiltCard from "@/components/TiltCard";

export default function ToolShowcase({ limit }) {
  const [lockedTool, setLockedTool] = useState(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleToolClick = (tool) => {
    setLockedTool(tool);
    setPin("");
    setError(false);
  };

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(val);
    if (error) setError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.length === 6) {
      setError(true);
      setTimeout(() => setPin(""), 600);
    }
  };
  const tools = [
    {
      title: "AutoEdit",
      description: "AI-powered infographic and typography editor making complex animations in seconds.",
      tags: ["Python", "React", "Whisper","Gemini"],
    },
    {
      title: "WhatThePrompt",
      description: "Web application offering standardized preset pipelines for high-consistency AI video/image generations.",
      tags: ["Next.js", "ComfyUI", "Supabase"],
    },
    {
      title: "Content Nexus",
      description: "Centralized operations suite featuring real-time YouTube analytics, team workflows, and role-based access.",
      tags: ["PostgreSQL", "React", "REST APIs"],
    },
    {
      title: "WA-Guardian",
      description: "Real-time browser extension detecting harmful content and scam alerts in chat apps.",
      tags: ["JavaScript", "Extension", "AI Filter"],
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.35, ease: "easeOut" } 
    },
  };

  return (
    <>
      <motion.section 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="w-full"
      >
        <div className="py-16 sm:py-24 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
          <motion.div variants={itemAnim} className="mb-2 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f5f7] text-[#86868b] text-xs font-sans mb-4 uppercase tracking-wider font-medium border border-black/[0.04]">
              <Wrench size={13} /> Products
            </div>
            <h2 className="text-3xl sm:text-5xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.03em] mb-3 sm:mb-4">
              Internal Tools
            </h2>
            <p className="text-base sm:text-lg text-[#86868b] max-w-2xl leading-relaxed font-sans">
              Zero-cost automation suites and live web products built to scale digital content production by 90%.
            </p>
          </motion.div>
          
          <div className="flex flex-col gap-4 sm:gap-5">
            {(limit ? tools.slice(0, limit) : tools).map((tool, i) => (
              <motion.div variants={itemAnim} key={i}>
                <TiltCard tiltIntensity={1.5}>
                  <div
                    onClick={() => handleToolClick(tool)}
                    className="group flex flex-col gap-5 p-6 sm:p-8 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-black/[0.1] cursor-pointer h-full transition-all duration-200"
                  >
                    {/* Clean Tag */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[11px] font-sans text-[#86868b] tracking-wider uppercase font-medium">Proprietary Suite</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 sm:mb-3">
                        <h3 className="text-xl sm:text-2xl font-sans font-semibold text-[#1d1d1f] tracking-tight group-hover:text-black transition-colors">{tool.title}</h3>
                        <span className="text-[10px] font-sans font-medium tracking-wider px-2.5 py-0.5 bg-[#f5f5f7] text-[#86868b] rounded-full uppercase border border-black/[0.04]">Internal</span>
                      </div>
                      <p className="text-[#515154] text-sm sm:text-base max-w-2xl leading-relaxed font-sans">
                        {tool.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4 w-full pt-4 border-t border-black/[0.04]">
                      <div className="flex flex-wrap gap-1.5">
                        {tool.tags.map((tag, j) => (
                          <span key={j} className="text-xs font-sans text-[#86868b] bg-[#f5f5f7] border border-black/[0.04] px-2.5 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="w-8 h-8 rounded-full border border-black/[0.06] bg-[#f5f5f7] flex items-center justify-center text-[#86868b] group-hover:text-[#1d1d1f] group-hover:border-black/[0.12] transition-colors flex-shrink-0" title="Internal Tool - Confidential">
                        <Lock size={14} />
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
          
          {limit && tools.length > limit && (
            <motion.div variants={itemAnim} className="mt-4 sm:mt-8 flex justify-center">
              <Link href="/internal-tools" className="px-6 py-2.5 bg-[#1d1d1f] text-white rounded-full text-xs sm:text-sm font-sans font-medium hover:bg-[#333336] transition-all shadow-sm">
                View More Internal Tools
              </Link>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Modern Lock Screen Modal */}
      <AnimatePresence>
        {lockedTool && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white border border-black/[0.08] shadow-[0_24px_64px_rgba(0,0,0,0.12)] rounded-3xl p-6 sm:p-8 max-w-md w-[92vw] relative"
            >
              <button 
                onClick={() => setLockedTool(null)}
                className="absolute top-5 right-5 text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] mb-4">
                  <Lock size={20} />
                </div>
                <h3 className="text-xl sm:text-2xl font-sans font-semibold text-[#1d1d1f] mb-1.5">Restricted Access</h3>
                <p className="text-sm text-[#86868b] font-sans mb-6">
                  Enter the 6-digit access code to unlock <span className="font-semibold text-[#1d1d1f]">{lockedTool.title}</span>.
                </p>
                
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="flex justify-center mb-6">
                    <div className="relative flex gap-2 sm:gap-2.5 justify-center">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={pin}
                        onChange={handlePinChange}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-text z-10"
                        autoFocus
                      />
                      {[...Array(6)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-9 h-11 sm:w-11 sm:h-13 flex items-center justify-center text-lg sm:text-xl font-sans font-medium rounded-2xl border transition-colors ${
                            error ? 'border-red-500 text-red-500 bg-red-50' :
                            pin.length === i ? 'border-[#1d1d1f] text-[#1d1d1f] bg-[#f5f5f7] shadow-sm' :
                            pin.length > i ? 'border-black/[0.15] text-[#1d1d1f] bg-white' :
                            'border-black/[0.08] text-neutral-300 bg-[#f5f5f7]'
                          }`}
                        >
                          {pin[i] || '·'}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {error ? (
                    <p className="text-red-600 text-xs font-sans mb-5 animate-pulse">Access Denied: Incorrect authentication code.</p>
                  ) : (
                    <p className="text-[#86868b] text-xs font-sans mb-5">Authorized personnel only.</p>
                  )}
                  
                  <button 
                    type="submit"
                    disabled={pin.length !== 6}
                    className="w-full py-3 bg-[#1d1d1f] text-white rounded-full text-sm font-sans font-medium tracking-normal disabled:opacity-40 disabled:cursor-not-allowed shadow-sm hover:bg-[#333336] transition-all"
                  >
                    Unlock System
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
