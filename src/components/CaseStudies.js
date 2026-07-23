"use client";


import { ArrowUpRight, BookOpen } from "lucide-react";
import Link from "next/link";

export default function CaseStudies({ limit }) {
  const studies = [
    {
      title: "From Doodles to Design",
      description: "My journey bridging creative visual direction and deep technical automation.",
      type: "Medium Article",
      link: "https://hippogriff.medium.com",
    },
    {
      title: "How I Built My Pseudo Fullstack Portfolio",
      description: "An in-depth breakdown of the design and development process for my portfolio website.",
      type: "Medium Article",
      link: "https://medium.com/@hippogriff/how-i-built-my-psuedo-fullstack-portfolio-73cd1f6aecda",
    },
    {
      title: "Zero-Cost Automation",
      description: "Building an internal productivity suite using Google Colab, Supabase, and lightweight web extensions.",
      type: "Architecture Breakdown",
      link: "#",
    },
    {
      title: "Why Are You Still Confused When Turning Your Design To Code?",
      description: "A guide on bridging the gap between design and development, avoiding common handoff pitfalls.",
      type: "Medium Article",
      link: "https://medium.com/design-bootcamp/why-are-you-still-confusing-when-turning-your-design-to-code-a7489d544deb",
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5">
      <div className="flex flex-col gap-10">
        <div className="mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-black/60 text-xs font-medium mb-4 uppercase tracking-widest">
            <BookOpen size={14} /> Writing
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-black tracking-tight mb-4">
            Case Studies
          </h2>
          <p className="text-base md:text-lg text-black/60 max-w-2xl leading-relaxed">
            Technical breakdowns, engineering experiments, and thoughts on the future of generative UI.
          </p>
        </div>
        
        <div className="flex flex-col gap-6">
          {(limit ? studies.slice(0, limit) : studies).map((study, i) => {
            const isLink = study.link !== "#";
            const CardWrapper = isLink ? 'a' : 'div';
            const wrapperProps = isLink ? { href: study.link, target: "_blank", rel: "noopener noreferrer" } : {};
            
            return (
              <CardWrapper
                key={i}
                {...wrapperProps}
                className={`group block bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${isLink ? 'hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:scale-[1.01] cursor-pointer' : ''} transition-all duration-300 relative overflow-hidden`}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <p className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-3">{study.type}</p>
                    <h3 className="text-2xl font-semibold text-black tracking-tight mb-3">
                      {study.title}
                    </h3>
                    <p className="text-black/60 text-base max-w-2xl leading-relaxed">{study.description}</p>
                  </div>
                  {isLink && (
                    <div className="mt-6 flex justify-end">
                      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                        <ArrowUpRight size={18} className="text-black/60 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  )}
                </div>
              </CardWrapper>
            );
          })}
        </div>
        
        {limit && studies.length > limit && (
          <div className="mt-8 flex justify-center">
            <Link href="/case-studies" className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors">
              View More Case Studies
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
