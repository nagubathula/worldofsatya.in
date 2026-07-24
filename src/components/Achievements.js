"use client";


import { Trophy, Star, Award, Medal, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function Achievements({ limit }) {
  const achievements = [
    {
      title: "100k+ Followers Growth",
      description: "Led and scaled 14+ AI-driven social media channels, reaching over 100,000 average followers.",
      icon: <Star className="w-5 h-5 text-black/60" />
    },
    {
      title: "AI Training & Upskilling",
      description: "Trained and upskilled over 500+ individuals in applied Generative AI and automation.",
      icon: <Award className="w-5 h-5 text-black/60" />
    },
    {
      title: "GSOC 2024 Qualified",
      description: "Qualified for Google Summer of Code 2024.",
      icon: <Trophy className="w-5 h-5 text-black/60" />,
      link: "https://summerofcode.withgoogle.com/"
    },
    {
      title: "NASA Space Apps Awards",
      description: "Galactic Impact Award (2023) and Local Award for Local Impact (2022).",
      icon: <Trophy className="w-5 h-5 text-black/60" />,
      link: "https://www.spaceappschallenge.org/"
    },
    {
      title: "Hackathon Highlights",
      description: "Won 14 Hackathons. Finalist & Runner Up at Kavach Cyber Security Hackathon (2023). First Runner Up at NULLCON GOA Hardware CTF (2022).",
      icon: <Medal className="w-5 h-5 text-black/60" />
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5">
      <div className="flex flex-col gap-10">
        <div className="mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-black/60 text-xs font-medium mb-4 uppercase tracking-widest">
            <Trophy size={14} /> Recognition
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-black tracking-tight mb-4">
            Achievements
          </h2>
          <p className="text-base md:text-lg text-black/60 max-w-2xl leading-relaxed">
            Recognition across open-source, hackathons, and AI growth metrics.
          </p>
        </div>
        
        <div className="flex flex-col gap-6">
          {(limit ? achievements.slice(0, limit) : achievements).map((item, i) => {
            const isLink = !!item.link;
            const CardWrapper = isLink ? 'a' : 'div';
            const wrapperProps = isLink ? { href: item.link, target: "_blank", rel: "noopener noreferrer" } : {};
            
            return (
              <CardWrapper
                key={i}
                {...wrapperProps}
                className={`group flex flex-col p-6 sm:p-8 bg-white rounded-3xl border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:scale-[1.01] transition-all duration-300 ${isLink ? 'cursor-pointer block block' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>{item.icon}</div>
                  {isLink && (
                    <ArrowUpRight size={20} className="text-black/40 group-hover:text-black transition-colors" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-black tracking-tight mb-2">{item.title}</h3>
                <p className="text-black/60 text-sm leading-relaxed font-medium">{item.description}</p>
              </CardWrapper>
            );
          })}
        </div>
        
        {limit && achievements.length > limit && (
          <div className="mt-8 flex justify-center">
            <Link href="/achievements" className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/90 transition-colors">
              View More Achievements
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
