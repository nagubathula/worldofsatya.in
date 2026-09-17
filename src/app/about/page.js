import AboutMe from "@/components/AboutMe";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About | Satya Sai Nagubathula — Design Technologist & AI Engineer",
  description:
    "Meet Satya Sai Nagubathula, a Design Technologist and AI Engineer connecting product design, frontend engineering, and generative AI to build working products.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen relative max-w-7xl mx-auto w-full px-4 sm:px-12">
      <main className="relative z-10 flex flex-col pt-4 sm:pt-10">
        <AboutMe />
        <ExperienceTimeline />
      </main>
      <Footer />
    </div>
  );
}
