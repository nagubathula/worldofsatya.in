import AboutMe from "@/components/AboutMe";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Footer from "@/components/Footer";
import AppleNavbar from "@/components/AppleNavbar";

export const metadata = {
  title: "About | Satya Sai Nagubathula — Design Technologist & AI Engineer",
  description:
    "Meet Satya Sai Nagubathula, a Design Technologist and AI Engineer connecting product design, frontend engineering, and generative AI to build working products.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-foreground selection:text-background relative max-w-7xl mx-auto w-full px-4 sm:px-12">
      <AppleNavbar />
      <main className="relative z-10 flex flex-col pt-4 sm:pt-10">
        <AboutMe />
        <ExperienceTimeline />
      </main>
      <Footer />
    </div>
  );
}
