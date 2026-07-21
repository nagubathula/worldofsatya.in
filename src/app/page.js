import HeroSection from "@/components/HeroSection";
import NodeVisualizer from "@/components/NodeVisualizer";
import ToolShowcase from "@/components/ToolShowcase";
import CaseStudies from "@/components/CaseStudies";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Footer from "@/components/Footer";
import { CassettePlayer } from "@/components/CassettePlayer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      <main className="relative z-10 flex flex-col bg-background">
        <CassettePlayer />
        <HeroSection />
        <NodeVisualizer />
        <ToolShowcase />
        <CaseStudies />
        <ExperienceTimeline />
      </main>
      
      <Footer />
    </div>
  );
}
