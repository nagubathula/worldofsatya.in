import OpenSource from "@/components/OpenSource";
import Footer from "@/components/Footer";

export default function OpenSourcePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background relative max-w-3xl mx-auto w-full">
      <svg className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-difference w-full h-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
      <main className="relative z-10 flex flex-col bg-background pt-12">
        <OpenSource />
      </main>
      <Footer />
    </div>
  );
}
