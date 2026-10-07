import WorksList from "@/components/WorksList";
import Footer from "@/components/Footer";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Works | Satya Sai Nagubathula",
  description: "Products, case studies, open-source systems, generative AI videos, and internal tools by Satya Sai Nagubathula. All the work, in one place.",
};

export default function Works() {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-7xl px-4 sm:px-12">
      <main className="relative z-10 flex flex-col pt-28 sm:pt-36">
        <header className="mx-auto mb-10 w-full max-w-5xl sm:mb-14">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f5f7] text-[11px] font-sans font-medium text-[#626267] uppercase tracking-[0.16em] border border-black/[0.04]">
              <Sparkles size={11} className="text-[#8c9385]" /> Ideas, Made Real
            </span>
          </div>
          <h1 className="mb-4 text-6xl font-semibold tracking-[-0.05em] text-[#1d1d1f] sm:text-8xl">
            Works<span className="text-[#8c9385]">.</span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[#515154] sm:text-lg">
            Products I&apos;ve built, design case studies, generative AI videos, internal automation tools, and open-source systems. Everything lives together in one unified collection.
          </p>
        </header>

        <section id="collection" aria-label="Work collection" className="scroll-mt-24">
          <WorksList />
        </section>
      </main>
      <Footer />
    </div>
  );
}
