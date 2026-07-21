"use client";


import { Trophy, Star, Award, Medal } from "lucide-react";

export default function Achievements() {
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
      icon: <Trophy className="w-5 h-5 text-black/60" />
    },
    {
      title: "NASA Space Apps Awards",
      description: "Galactic Impact Award (2023) and Local Award for Local Impact (2022).",
      icon: <Trophy className="w-5 h-5 text-black/60" />
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
        <div>
          <h2 className="text-xl font-medium text-black">Achievements</h2>
          <p className="mt-4 text-sm text-black/60 max-w-xl leading-relaxed">
            Recognition across open-source, hackathons, and AI growth metrics.
          </p>
        </div>
        
        <div className="flex flex-col gap-6">
          {achievements.map((item, i) => (
            <div
              key={i}
              className="group flex flex-col p-6 sm:p-8 bg-white rounded-3xl border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:scale-[1.01] transition-all duration-300"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-black tracking-tight mb-2">{item.title}</h3>
              <p className="text-black/60 text-sm leading-relaxed font-medium">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
