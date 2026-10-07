import AboutMe from "@/components/AboutMe";
import Achievements from "@/components/Achievements";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About | Satya Sai Nagubathula — AI + Design Engineer",
  description:
    "Meet Satya Sai Nagubathula, an AI + Design Engineer connecting product design, frontend engineering, and generative AI to build working products.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen relative max-w-7xl mx-auto w-full px-4 sm:px-12">
      <main className="relative z-10 flex flex-col pt-16 sm:pt-14 max-w-6xl mx-auto w-full">
        <AboutMe />
        <section id="achievements" aria-label="Achievements and honors" className="scroll-mt-24 border-t border-black/[0.08] pt-14 sm:pt-20 w-full">
          <Achievements />
        </section>
      </main>
      <Footer />
    </div>
  );
}
