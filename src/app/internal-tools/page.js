import ToolShowcase from "@/components/ToolShowcase";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function InternalToolsPage() {
  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-foreground selection:text-background relative max-w-7xl mx-auto w-full px-4 sm:px-12">
      <svg className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-difference w-full h-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
      <main className="relative z-10 flex flex-col pt-12 sm:pt-20">
        <div className="px-4 sm:px-0 mb-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-md border border-foreground/5 text-foreground/70 hover:text-foreground hover:bg-background transition-all text-xs sm:text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
        <ToolShowcase />
      </main>
      <Footer />
    </div>
  );
}
