"use client";

import { motion } from "framer-motion";
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="text-xl font-medium text-black">Achievements</h2>
          <p className="mt-4 text-sm text-black/60 max-w-xs leading-relaxed">
            Recognition across open-source, hackathons, and AI growth metrics.
          </p>
        </div>
        
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {achievements.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group p-6 border border-black/5 rounded-2xl bg-white/50 hover:bg-white transition-colors"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-medium text-black tracking-tight mb-2">{item.title}</h3>
              <p className="text-black/70 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
