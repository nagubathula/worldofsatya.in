"use client";

import { usePathname } from "next/navigation";
import ChibiAvatarButton from "./ChibiAvatarButton";

// The face from the home page, kept in the corner of every other page as the
// way back home. No navbar: the face is the site's mark, so it is the link.
export default function HomeFace() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <div className="fixed left-4 top-4 z-50 sm:left-6 sm:top-6">
      <ChibiAvatarButton href="/" label="Home" size={48} />
    </div>
  );
}
