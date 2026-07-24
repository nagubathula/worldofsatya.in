"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Video, Code, BookOpen, Wrench, Briefcase, Trophy } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function DockItem({ item, isActive, mouseX }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Base width is roughly 44px (p-3 + 20px icon)
  const widthSync = useTransform(distance, [-100, 0, 100], [44, 70, 44]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });
  
  const iconScale = useTransform(width, [44, 70], [1, 1.4]);

  return (
    <Link href={item.href} title={item.name}>
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        className={`rounded-full flex items-center justify-center transition-colors duration-200 ${
          isActive 
            ? "bg-black text-white shadow-md" 
            : "text-black/60 hover:bg-black/10 hover:text-black"
        }`}
      >
        <motion.div style={{ scale: iconScale }} className="flex items-center justify-center">
          {item.icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const mouseX = useMotionValue(Infinity);

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
      <motion.nav
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-center gap-1 sm:gap-2 px-3 h-[68px] bg-white/40 backdrop-blur-xl border border-black/5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-x-auto max-w-[90vw] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-center"
      >
        {navItems.map((item) => (
          <DockItem 
            key={item.name} 
            item={item} 
            isActive={pathname === item.href} 
            mouseX={mouseX} 
          />
        ))}
      </motion.nav>
    </div>
  );
}
