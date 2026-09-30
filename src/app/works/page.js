import WorksList from "@/components/WorksList";
import AIVideoShowcase from "@/components/AIVideoShowcase";
import ToolShowcase from "@/components/ToolShowcase";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Works | Satya Sai Nagubathula",
  description: "Projects, case studies, open-source tools, and creative experiments by Satya Sai Nagubathula. All the work, in one place.",
};

export default function Works() {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-7xl px-4 sm:px-12">
      <main className="relative z-10 flex flex-col pt-28 sm:pt-36">
        <header className="mx-auto mb-10 w-full max-w-5xl sm:mb-14">
          <p className="mb-5 text-xs uppercase tracking-[0.2em] text-[#626267]">Ideas, made real</p>
          <h1 className="mb-5 text-6xl font-semibold tracking-[-0.05em] text-[#1d1d1f] sm:text-8xl">Works<span className="text-[#8c9385]">.</span></h1>
          <p className="max-w-xl text-base leading-relaxed text-[#515154] sm:text-lg">Products I&apos;ve built, decisions behind the designs, and tools shared with the community. Everything lives here.</p>
          <nav aria-label="Works sections" className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#515154]">
            <a href="#collection" className="underline decoration-black/20 underline-offset-4 hover:text-black">Explore the collection</a>
            <a href="#ai-videos" className="underline decoration-black/20 underline-offset-4 hover:text-black">AI videos</a>
            <a href="#internal-tools" className="underline decoration-black/20 underline-offset-4 hover:text-black">Internal tools</a>
          </nav>
        </header>
        <section id="collection" aria-label="Work collection" className="scroll-mt-24"><WorksList /></section>
        <section id="ai-videos" aria-label="AI videos" className="scroll-mt-24 border-t border-black/10"><AIVideoShowcase /></section>
        <section id="internal-tools" aria-label="Internal tools" className="scroll-mt-24 border-t border-black/10"><ToolShowcase /></section>
      </main>
      <Footer />
    </div>
  );
}
