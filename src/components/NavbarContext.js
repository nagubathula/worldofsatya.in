"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

const NavbarContext = createContext({
  homeSection: "avatar",
  setHomeSection: () => {},
});

export function NavbarProvider({ children }) {
  const [homeSection, setHomeSection] = useState("avatar");

  const value = useMemo(
    () => ({
      homeSection,
      setHomeSection,
    }),
    [homeSection]
  );

  return (
    <NavbarContext.Provider value={value}>
      {children}
    </NavbarContext.Provider>
  );
}

export function useNavbar() {
  return useContext(NavbarContext);
}
