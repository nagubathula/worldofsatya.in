import WorksList from "@/components/WorksList";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Works | Satya Sai Nagubathula",
  description: "A collection of projects, case studies, and open source contributions.",
};

export default function Works() {
  return (
    <div className="min-h-screen relative max-w-7xl mx-auto w-full px-4 sm:px-12">

      <main className="relative z-10 flex flex-col pt-8 sm:pt-14">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 mb-8 sm:mb-12 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#3e3832]/5 text-[#3e3832]/80 text-xs font-pixel mb-4 uppercase tracking-widest border-2 border-[#3e3832]/25 shadow-[2px_2px_0px_rgba(62,56,50,0.15)]">
            Portfolio &amp; Showcase
          </div>
          <h1 className="text-4xl sm:text-6xl font-editorial font-normal tracking-tight text-[#3e3832] mb-4">
            Works &amp; <span className="italic text-[#3e3832]/60">Case Studies</span>
          </h1>
          <p className="text-base sm:text-lg text-[#3e3832]/75 max-w-2xl mx-auto leading-relaxed font-editorial">
            A comprehensive collection of design systems, production engineering, generative AI workflows, and open-source contributions.
          </p>
        </div>
        
        <WorksList />
      </main>
      
      <Footer />
    </div>
  );
}
