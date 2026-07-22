"use client";


import { ArrowUpRight } from "lucide-react";

export default function CaseStudies() {
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
        <div>
          <h2 className="text-xl font-medium text-black">Case Studies & Writing</h2>
          <p className="mt-4 text-sm text-black/60 max-w-xl leading-relaxed">
            Technical breakdowns, engineering experiments, and thoughts on the future of generative UI.
          </p>
        </div>
        
        <div className="flex flex-col gap-6">
          {studies.map((study, i) => {
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
      </div>
    </section>
  );
}
