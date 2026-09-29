import WorksList from "@/components/WorksList";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Works | Satya Sai Nagubathula",
  description: "A collection of projects, engineering systems, and open source contributions.",
};

export default function Works() {
  return (
    <div className="min-h-screen relative max-w-7xl mx-auto w-full px-4 sm:px-12">
      <main className="relative z-10 flex flex-col pt-24 sm:pt-28">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-8 mb-8 sm:mb-14 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f5f7] text-[#86868b] text-xs font-sans mb-3 sm:mb-4 uppercase tracking-wider font-medium border border-black/[0.04]">
            Portfolio &amp; Showcase
          </div>
          <h1 className="text-3xl sm:text-6xl font-sans font-semibold tracking-[-0.03em] text-[#1d1d1f] mb-3 sm:mb-4">
            Selected Works
          </h1>
          <p className="text-sm sm:text-base text-[#86868b] max-w-2xl mx-auto leading-relaxed font-sans">
            A comprehensive collection of design systems, production engineering, generative AI workflows, and open-source contributions.
          </p>
        </div>
        
        <WorksList />
      </main>
      
      <Footer />
    </div>
  );
}
