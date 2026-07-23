"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Video, Code, BookOpen, Wrench, Briefcase, Trophy } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: <Home size={20} /> },
    { name: "AI Videos", href: "/ai-videos", icon: <Video size={20} /> },
    { name: "Open Source", href: "/open-source", icon: <Code size={20} /> },
    { name: "Case Studies", href: "/case-studies", icon: <BookOpen size={20} /> },
    { name: "Internal Tools", href: "/internal-tools", icon: <Wrench size={20} /> },
    { name: "Experience", href: "/experience", icon: <Briefcase size={20} /> },
    { name: "Achievements", href: "/achievements", icon: <Trophy size={20} /> },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav className="flex items-center gap-1 sm:gap-2 px-3 py-3 bg-white/40 backdrop-blur-xl border border-black/5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-x-auto max-w-[90vw] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={item.name}
              className={`p-3 rounded-full transition-all duration-300 flex-shrink-0 ${
                isActive 
                  ? "bg-black text-white shadow-md scale-105" 
                  : "text-black/60 hover:bg-black/5 hover:text-black"
              }`}
            >
              {item.icon}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
