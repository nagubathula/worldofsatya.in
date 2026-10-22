"use client";

import Link from "next/link";
import { markReturnToWorks } from "@/lib/worksReturn";

// "← All works", returning to the spot in the list the project was opened from.
// Marked on press, not click: the page transition takes the click before React sees it.
export default function BackToWorks({ className = "" }) {
  return (
    <Link
      href="/works"
      onPointerDown={markReturnToWorks}
      onKeyDown={(e) => e.key === "Enter" && markReturnToWorks()}
      className={className}
    >
      ← All works
    </Link>
  );
}
