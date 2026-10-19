"use client";

import React, { createContext, useContext, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { haptic, smoothNavigate } from "@/lib/motion";

const BlackHoleContext = createContext({
  phase: "idle",
  navigate: () => {},
});

export function useBlackHoleTransition() {
  return useContext(BlackHoleContext);
}

export function triggerBlackHoleNav(href) {
  if (typeof window !== "undefined" && href) {
    window.location.href = href;
  }
}

function internalPath(anchor) {
  const raw = anchor.getAttribute("href");
  if (!raw || raw.startsWith("#") || anchor.target === "_blank" || anchor.hasAttribute("download")) return null;
  let url;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;
  const next = `${url.pathname}${url.search}`;
  const current = `${window.location.pathname}${window.location.search}`;
  if (next === current) return null;
  return `${next}${url.hash}`;
}

export function BlackHoleTransitionProvider({ children }) {
  const router = useRouter();

  const navigate = useCallback((href) => {
    smoothNavigate(router, href);
  }, [router]);

  useEffect(() => {
    const onPointerDown = (event) => {
      const target = event.target instanceof Element
        ? event.target.closest("button, [role='button']")
        : null;
      if (!target || target.closest("[data-haptic='off']")) return;
      haptic("tap");
    };

    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor || anchor.closest("[data-transition='off']")) return;
      const href = internalPath(anchor);
      if (!href) return;
      event.preventDefault();
      event.stopPropagation();
      smoothNavigate(router, href);
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("click", onClick, true);
    };
  }, [router]);

  return (
    <BlackHoleContext.Provider value={{ phase: "idle", navigate }}>
      {children}
    </BlackHoleContext.Provider>
  );
}
