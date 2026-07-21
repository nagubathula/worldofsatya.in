import HeroSection from "@/components/HeroSection";
import NodeVisualizer from "@/components/NodeVisualizer";
import ToolShowcase from "@/components/ToolShowcase";
import CaseStudies from "@/components/CaseStudies";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import OpenSource from "@/components/OpenSource";
import Achievements from "@/components/Achievements";
import Footer from "@/components/Footer";
import { CassettePlayer } from "@/components/CassettePlayer";
import AIVideoShowcase from "@/components/AIVideoShowcase";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background relative">
      {/* Noise Overlay */}
      <svg className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-difference w-full h-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <main className="relative z-10 flex flex-col bg-background">
        <HeroSection />
        
        {/* The Output: What I build */}
        <CaseStudies />
        <AIVideoShowcase />
        
        {/* The Process: How I build it */}
        <NodeVisualizer />
        <ToolShowcase />
        
        {/* The Background: My Journey */}
        <ExperienceTimeline />
        
        {/* Community & Recognition */}
        <OpenSource />
        <Achievements />
        
        {/* The Vibe: Creative Outro */}
        <CassettePlayer />
      </main>
      
      <Footer />
    </div>
  );
}
