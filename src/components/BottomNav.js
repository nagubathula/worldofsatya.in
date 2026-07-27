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

  const widthSync = useTransform(distance, [-100, 0, 100], [40, 60, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });
  const iconScale = useTransform(width, [40, 60], [1, 1.25]);

  return (
    <Link href={item.href} title={item.name} suppressHydrationWarning className="relative group shrink-0">
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        whileTap={{ scale: 0.88 }}
        className={`rounded-full flex items-center justify-center transition-colors duration-200 ${
          isActive 
            ? "bg-black text-white shadow-md" 
            : "text-black/70 hover:bg-black/10 hover:text-black active:bg-black/10"
        }`}
        suppressHydrationWarning
      >
        <motion.div style={{ scale: iconScale }} className="flex items-center justify-center" suppressHydrationWarning>
          {item.icon}
        </motion.div>
      </motion.div>

      {/* Floating label badge */}
      <span 
        className={`absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-black/90 text-white text-[10px] sm:text-[11px] font-medium rounded-full shadow-lg pointer-events-none whitespace-nowrap transition-all duration-200 ${
          isActive 
            ? "opacity-100 translate-y-0 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0" 
            : "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
        }`}
      >
        {item.name}
      </span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const mouseX = useMotionValue(Infinity);

  const navItems = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "AI Videos", href: "/ai-videos", icon: <Video size={18} /> },
    { name: "Open Source", href: "/open-source", icon: <Code size={18} /> },
    { name: "Case Studies", href: "/case-studies", icon: <BookOpen size={18} /> },
    { name: "Internal Tools", href: "/internal-tools", icon: <Wrench size={18} /> },
    { name: "Experience", href: "/experience", icon: <Briefcase size={18} /> },
    { name: "Achievements", href: "/achievements", icon: <Trophy size={18} /> },
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-2 w-full max-w-fit" suppressHydrationWarning>
      <motion.nav
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 h-[58px] sm:h-[68px] bg-white/70 backdrop-blur-2xl border border-black/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-x-auto max-w-[92vw] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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

