import UIShowcase from "@/components/UIShowcase";
import Footer from "@/components/Footer";
import PageTurn from "@/components/PageTurn";
import { MousePointer2 } from "lucide-react";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "UI | Satya Sai Nagubathula",
  description: "Interface pieces by Satya Sai Nagubathula, live and interactive: drag them, swipe them, turn them over.",
  path: "/ui",
});

export default function UIPage() {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-7xl px-4 sm:px-12">
      <main className="relative z-10 flex flex-col pt-24 sm:pt-36">
        <header className="mx-auto mb-10 w-full max-w-5xl sm:mb-16">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.04] bg-[#f5f5f7] px-3 py-1 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-[#626267]">
              <MousePointer2 size={11} className="text-[#8c9385]" /> Interface lab
            </span>
          </div>
          <h1 className="mb-4 text-6xl font-semibold tracking-[-0.05em] text-[#1d1d1f] sm:text-8xl">
            UI<span className="text-[#8c9385]">.</span>
          </h1>
          <p className="max-w-2xl text-[15px] leading-relaxed text-[#515154] sm:text-lg">
            Interface pieces I&apos;ve designed and built, running live rather than as screenshots. Drag them, swipe them, turn them over.
          </p>
        </header>

        <section aria-label="Interface pieces" className="mx-auto w-full max-w-5xl">
          <UIShowcase />
        </section>
        <PageTurn prev={{ href: "/works", title: "Works" }} next={{ href: "/gallery", title: "Gallery" }} />
      </main>
      <Footer />
    </div>
  );
}
