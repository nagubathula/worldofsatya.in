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
        staggerChildren: 0.15,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, scale: 0.85, y: 20 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25, 
        mass: 0.8 
      } 
    },
  };

  return (
    <>
      <motion.section 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full"
      >
        <div className="py-16 sm:py-32 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
          <motion.div variants={itemAnim} className="mb-2 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#3e3832]/5 text-[#3e3832]/80 text-xs font-pixel mb-4 uppercase tracking-widest border-2 border-[#3e3832]/25 shadow-[2px_2px_0px_rgba(62,56,50,0.15)]">
              <Wrench size={14} /> Products
            </div>
            <h2 className="text-3xl sm:text-5xl font-editorial font-normal text-[#3e3832] tracking-tight mb-3 sm:mb-4">
              Internal Tools
            </h2>
            <p className="text-base sm:text-lg text-[#3e3832]/75 max-w-2xl leading-relaxed font-editorial">
              Zero-cost automation suites and live web products built to scale digital content production by 90%.
            </p>
          </motion.div>
          
          <div className="flex flex-col gap-4 sm:gap-6">
            {(limit ? tools.slice(0, limit) : tools).map((tool, i) => (
              <motion.div variants={itemAnim} key={i}>
                <TiltCard tiltIntensity={2}>
                  <motion.div
                    onClick={() => handleToolClick(tool)}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                    className="group flex flex-col gap-5 p-6 sm:p-8 retro-card cursor-pointer h-full transition-all duration-300"
                  >
                    {/* Clean Tag */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xs font-pixel text-[#3e3832]/60 tracking-widest uppercase">Proprietary Suite</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 sm:mb-3">
                        <h3 className="text-xl sm:text-2xl font-editorial font-normal text-[#3e3832] tracking-tight">{tool.title}</h3>
                        <span className="text-[10px] font-pixel tracking-widest px-2.5 py-0.5 bg-[#3e3832]/5 text-[#3e3832]/80 rounded-sm uppercase border-2 border-[#3e3832]/25 shadow-[1px_1px_0px_rgba(62,56,50,0.12)]">Internal</span>
                      </div>
                      <p className="text-[#3e3832]/75 text-base max-w-2xl leading-relaxed font-editorial">
                        {tool.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4 w-full pt-4 border-t border-[#3e3832]/10">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {tool.tags.map((tag, j) => (
                          <span key={j} className="text-xs font-pixel text-[#3e3832]/70 bg-[#3e3832]/[0.05] border border-[#3e3832]/10 px-2 py-0.5 rounded-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-sm border-2 border-[#3e3832]/25 shadow-[1px_1px_0px_rgba(62,56,50,0.15)] flex items-center justify-center text-[#3e3832]/60 bg-[#3e3832]/5 flex-shrink-0" title="Internal Tool - Confidential">
                        <Lock size={15} />
                      </div>
                    </div>
                  </motion.div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
          
          {limit && tools.length > limit && (
            <motion.div variants={itemAnim} className="mt-4 sm:mt-8 flex justify-center">
              <Link href="/internal-tools" className="px-6 py-3 bg-[#3e3832] text-[#f4ebd8] rounded-sm border-2 border-[#3e3832] text-xs font-pixel tracking-wider shadow-[3px_3px_0px_rgba(62,56,50,0.35)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(62,56,50,0.4)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(62,56,50,0.4)] transition-all">
                View More Internal Tools
              </Link>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Lock Screen Modal */}
      <AnimatePresence>
        {lockedTool && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3e3832]/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="bg-[#fcf8f0] border-2 border-[#3e3832]/35 shadow-[8px_8px_0px_rgba(62,56,50,0.25)] rounded-sm p-6 sm:p-8 max-w-md w-[92vw] relative"
            >
              <button 
                onClick={() => setLockedTool(null)}
                className="absolute top-5 right-5 text-[#3e3832]/40 hover:text-[#3e3832] transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#3e3832]/5 border-2 border-[#3e3832]/25 shadow-[2px_2px_0px_rgba(62,56,50,0.15)] rounded-sm flex items-center justify-center text-[#3e3832]/60 mb-4 sm:mb-6">
                  <Lock size={22} />
                </div>
                <h3 className="text-xl sm:text-2xl font-editorial font-normal text-[#3e3832] mb-2">Restricted Access</h3>
                <p className="text-base text-[#3e3832]/70 font-editorial mb-6">
                  Enter the 6-digit access code to unlock <span className="font-semibold text-[#3e3832]">{lockedTool.title}</span>.
                </p>
                
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="flex justify-center mb-6">
                    <div className="relative flex gap-1.5 sm:gap-3 justify-center">
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
                          className={`w-9 h-11 sm:w-12 sm:h-14 flex items-center justify-center text-lg sm:text-2xl font-pixel rounded-sm border-2 transition-colors ${
                            error ? 'border-red-500 text-red-500 bg-red-50' :
                            pin.length === i ? 'border-[#3e3832] text-[#3e3832] bg-[#f4ebd8]' :
                            pin.length > i ? 'border-[#3e3832]/30 text-[#3e3832] bg-[#fdfaf3]' :
                            'border-[#3e3832]/15 text-[#3e3832]/30 bg-[#fdfaf3]'
                          }`}
                        >
                          {pin[i] || '·'}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {error ? (
                    <p className="text-red-600 text-xs sm:text-sm font-pixel mb-4 sm:mb-6 animate-pulse">Access Denied: Incorrect authentication code.</p>
                  ) : (
                    <p className="text-[#3e3832]/50 text-xs sm:text-sm font-pixel mb-4 sm:mb-6">Authorized personnel only.</p>
                  )}
                  
                  <button 
                    type="submit"
                    disabled={pin.length !== 6}
                    className="w-full py-3.5 sm:py-4 bg-[#3e3832] text-[#f4ebd8] rounded-sm border-2 border-[#3e3832] text-sm font-pixel tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-[3px_3px_0px_rgba(62,56,50,0.35)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(62,56,50,0.4)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(62,56,50,0.4)] transition-all"
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
