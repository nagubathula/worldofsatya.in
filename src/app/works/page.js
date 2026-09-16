import WorksList from "@/components/WorksList";
import Footer from "@/components/Footer";
import AppleNavbar from "@/components/AppleNavbar";

export const metadata = {
  title: "Works | Satya Sai Nagubathula",
  description: "A collection of projects, case studies, and open source contributions.",
};

export default function Works() {
  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-foreground selection:text-background relative max-w-7xl mx-auto w-full px-4 sm:px-12">
      <AppleNavbar />

      <main className="relative z-10 flex flex-col pt-8 sm:pt-14">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 mb-8 sm:mb-12 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 text-foreground/60 text-xs font-medium mb-4 uppercase tracking-widest border border-foreground/[0.06]">
            Portfolio &amp; Showcase
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-foreground mb-4">
            Works &amp; <span className="text-foreground/50">Case Studies</span>
          </h1>
          <p className="text-base sm:text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            A comprehensive collection of design systems, production engineering, generative AI workflows, and open-source contributions.
          </p>
        </div>
        
        <WorksList />
      </main>
      
      <Footer />
    </div>
  );
}
