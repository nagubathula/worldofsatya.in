"use client";

import { ReactLenis, useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={{ lerp: 0.072, duration: 1.45, smoothWheel: true, syncTouch: true, wheelMultiplier: 0.82, touchMultiplier: 1.05 }}>
      <ScrollReset />
      {children}
    </ReactLenis>
  );
}
