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
        viewport={{ once: false, margin: "-100px" }}
        className="w-full border-t border-foreground/5"
      >
        <div className="py-16 sm:py-32 px-4 sm:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8 sm:gap-10">
          <motion.div variants={itemAnim} className="mb-2 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 text-foreground/60 text-xs font-medium mb-4 uppercase tracking-widest">
              <Wrench size={14} /> Products
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold text-foreground tracking-tight mb-3 sm:mb-4">
              Internal Tools
            </h2>
            <p className="text-sm sm:text-lg text-foreground/60 max-w-2xl leading-relaxed">
              Zero-cost automation suites and live web products built to scale digital content production by 90%.
            </p>
          </motion.div>
          
          <div className="flex flex-col gap-4 sm:gap-6">
            {(limit ? tools.slice(0, limit) : tools).map((tool, i) => (
              <motion.div variants={itemAnim} key={i}>
                <TiltCard tiltIntensity={2}>
                  <motion.div
                    onClick={() => handleToolClick(tool)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                    className="group flex flex-col gap-5 p-5 sm:p-8 bg-background rounded-2xl sm:rounded-3xl border border-foreground/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] cursor-pointer h-full"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 sm:mb-3">
                        <h3 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">{tool.title}</h3>
                        <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 sm:py-1 bg-foreground/5 text-foreground/50 rounded-full uppercase">Internal</span>
                      </div>
                      <p className="text-foreground/60 text-sm sm:text-base max-w-2xl leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4 w-full pt-4 border-t border-foreground/[0.04]">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {tool.tags.map((tag, j) => (
                          <span key={j} className="text-[11px] sm:text-xs font-mono text-foreground/50 bg-foreground/[0.03] px-2 py-0.5 sm:py-1 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-foreground/5 flex items-center justify-center text-foreground/30 bg-foreground/5 flex-shrink-0" title="Internal Tool - Confidential">
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
              <Link href="/internal-tools" className="px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors">
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              className="bg-background rounded-3xl p-5 sm:p-8 max-w-md w-[92vw] shadow-2xl relative"
            >
              <button 
                onClick={() => setLockedTool(null)}
                className="absolute top-5 right-5 text-foreground/40 hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-foreground/5 rounded-full flex items-center justify-center text-foreground/50 mb-4 sm:mb-6">
                  <Lock size={22} />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">Restricted Access</h3>
                <p className="text-sm sm:text-base text-foreground/60 mb-6">
                  Enter the 6-digit access code to unlock <span className="font-medium text-foreground">{lockedTool.title}</span>.
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
                          className={`w-9 h-11 sm:w-12 sm:h-14 flex items-center justify-center text-lg sm:text-2xl font-mono font-medium rounded-xl border-2 transition-colors ${
                            error ? 'border-red-500 text-red-500 bg-red-50' :
                            pin.length === i ? 'border-foreground text-foreground' :
                            pin.length > i ? 'border-foreground/20 text-foreground' :
                            'border-foreground/10 text-foreground/30'
                          }`}
                        >
                          {pin[i] || '·'}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {error ? (
                    <p className="text-red-500 text-xs sm:text-sm mb-4 sm:mb-6 animate-pulse">Access Denied: Incorrect authentication code.</p>
                  ) : (
                    <p className="text-foreground/40 text-xs sm:text-sm mb-4 sm:mb-6">Authorized personnel only.</p>
                  )}
                  
                  <button 
                    type="submit"
                    disabled={pin.length !== 6}
                    className="w-full py-3.5 sm:py-4 bg-foreground text-background rounded-xl text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-foreground/90 transition-colors"
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
