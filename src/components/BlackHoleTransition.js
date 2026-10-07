"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";

const BlackHoleContext = createContext({
  phase: "idle",
  navigate: () => {},
});

export function useBlackHoleTransition() {
  return useContext(BlackHoleContext);
}

export function triggerBlackHoleNav(href) {
  if (typeof window !== "undefined" && href) {
    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) {
      window.location.href = href;
    } else {
      window.location.href = href;
    }
  }
}

export function BlackHoleTransitionProvider({ children }) {
  const router = useRouter();

  const navigate = useCallback(
    (href) => {
      if (!href) return;
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        window.location.href = href;
      } else {
        router.push(href);
      }
    },
    [router]
  );

  return (
    <BlackHoleContext.Provider value={{ phase: "idle", navigate }}>
      {children}
    </BlackHoleContext.Provider>
  );
}
