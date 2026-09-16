"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
  mounted: true,
});

export function ThemeProvider({ children }) {
  const [theme] = useState("light");

  useEffect(() => {
    try {
      localStorage.removeItem("portfolio-theme");
      document.documentElement.classList.remove("theme-dark");
      document.documentElement.classList.add("theme-light");
    } catch {
      // Ignore
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {}, setTheme: () => {}, mounted: true }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
