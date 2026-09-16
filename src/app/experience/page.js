import ExperienceTimeline from "@/components/ExperienceTimeline";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Experience | Satya Sai Nagubathula — Professional Journey",
  description: "Career trajectory, leadership roles, and design engineering impact by Satya Sai Nagubathula.",
};

export default function ExperiencePage() {
  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-foreground selection:text-background relative max-w-7xl mx-auto w-full px-4 sm:px-12">
      <main className="relative z-10 flex flex-col pt-8 sm:pt-14">
        <ExperienceTimeline />
      </main>
      <Footer />
    </div>
  );
}
