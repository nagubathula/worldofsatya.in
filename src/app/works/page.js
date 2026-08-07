import WorksList from "@/components/WorksList";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Works | Satya Sai Nagubathula",
  description: "A collection of projects, case studies, and open source contributions.",
};

export default function Works() {
  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-foreground selection:text-background relative max-w-7xl mx-auto w-full px-4 sm:px-12">
      {/* Noise Overlay */}
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
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 mb-8 sm:mb-12 text-center flex flex-col items-center mt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 text-foreground/60 text-xs font-medium mb-4 uppercase tracking-widest">
            Portfolio & Store
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-foreground mb-4">
            Works & <span className="text-foreground/50">Case Studies</span>
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            A comprehensive collection of my design projects, technical experiments, open-source work, and detailed case studies.
          </p>
        </div>
        
        <WorksList />
        
      </main>
      
      <Footer />
    </div>
  );
}
