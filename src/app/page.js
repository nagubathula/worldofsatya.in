import HeroSection from "@/components/HeroSection";
import dynamic from 'next/dynamic';

const CassettePlayer = dynamic(() => import('@/components/CassettePlayer').then((mod) => mod.CassettePlayer));
const ToolShowcase = dynamic(() => import('@/components/ToolShowcase'));
const CaseStudies = dynamic(() => import('@/components/CaseStudies'));
const ExperienceTimeline = dynamic(() => import('@/components/ExperienceTimeline'));
const OpenSource = dynamic(() => import('@/components/OpenSource'));
const Achievements = dynamic(() => import('@/components/Achievements'));
const Footer = dynamic(() => import('@/components/Footer'));
const AIVideoShowcase = dynamic(() => import('@/components/AIVideoShowcase'));

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background relative max-w-3xl mx-auto w-full">
      {/* Noise Overlay */}
      <svg className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-difference w-full h-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <main className="relative z-10 flex flex-col bg-background">
        <HeroSection />
        <CassettePlayer />
        
        {/* The Output: What I build */}
        
        <AIVideoShowcase limit={3} />
        <OpenSource limit={2} />
        <CaseStudies limit={2} />
        
        {/* The Process: How I build it */}
        <ToolShowcase limit={2} />
        
        {/* The Background: My Journey */}
        <ExperienceTimeline limit={2} />
        
        {/* Community & Recognition */}
        
        <Achievements limit={2} />
      </main>
      
      <Footer />
    </div>
  );
}
