"use client";


import { useState } from "react";
import { Lock, X, Wrench } from "lucide-react";
import Link from "next/link";

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

  return (
    <>
      <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5">
      <div className="flex flex-col gap-10">
        <div className="mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-black/60 text-xs font-medium mb-4 uppercase tracking-widest">
            <Wrench size={14} /> Products
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-black tracking-tight mb-4">
            Internal Tools
          </h2>
          <p className="text-base md:text-lg text-black/60 max-w-2xl leading-relaxed">
            Zero-cost automation suites and live web products built to scale digital content production by 90%.
          </p>
        </div>
        
        <div className="flex flex-col gap-6">
          {(limit ? tools.slice(0, limit) : tools).map((tool, i) => (
            <div
              key={i}
              onClick={() => handleToolClick(tool)}
              className="group flex flex-col gap-6 p-6 sm:p-8 bg-white rounded-3xl border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-semibold text-black tracking-tight">{tool.title}</h3>
                  <span className="text-[10px] font-semibold tracking-wider px-2 py-1 bg-black/5 text-black/50 rounded-full uppercase">Internal</span>
                </div>
                <p className="text-black/60 text-base max-w-2xl">
                  {tool.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between gap-6 w-full pt-4 border-t border-black/[0.04]">
                <div className="flex flex-wrap gap-2">
                  {tool.tags.map((tag, j) => (
                    <span key={j} className="text-xs font-mono text-black/50 bg-black/[0.03] px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-black/30 bg-black/5 flex-shrink-0" title="Internal Tool - Confidential">
                  <Lock size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {limit && tools.length > limit && (
          <div className="mt-8 flex justify-center">
            <Link href="/internal-tools" className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors">
              View More Internal Tools
            </Link>
          </div>
        )}
      </div>
    </section>

      {/* Lock Screen Modal */}
      {lockedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setLockedTool(null)}
              className="absolute top-6 right-6 text-black/40 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center text-black/50 mb-6">
                <Lock size={24} />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Restricted Access</h3>
              <p className="text-black/60 mb-8">
                Enter the 6-digit access code to unlock <span className="font-medium text-black">{lockedTool.title}</span>.
              </p>
              
              <form onSubmit={handleSubmit} className="w-full">
                <div className="flex justify-center gap-3 mb-6">
                  {/* Fake 6-digit input visual */}
                  <div className="relative flex gap-2 sm:gap-3 justify-center">
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
                        className={`w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center text-xl sm:text-2xl font-mono font-medium rounded-xl border-2 transition-colors ${
                          error ? 'border-red-500 text-red-500 bg-red-50' :
                          pin.length === i ? 'border-black text-black' :
                          pin.length > i ? 'border-black/20 text-black' :
                          'border-black/10 text-black/30'
                        }`}
                      >
                        {pin[i] || '·'}
                      </div>
                    ))}
                  </div>
                </div>
                
                {error ? (
                  <p className="text-red-500 text-sm mb-6 animate-pulse">Access Denied: Incorrect authentication code.</p>
                ) : (
                  <p className="text-black/40 text-sm mb-6">Authorized personnel only.</p>
                )}
                
                <button 
                  type="submit"
                  disabled={pin.length !== 6}
                  className="w-full py-4 bg-black text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/90 transition-colors"
                >
                  Unlock System
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
