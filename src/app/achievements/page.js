import Achievements from "@/components/Achievements";
import Footer from "@/components/Footer";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Achievements | Satya Sai Nagubathula — Honors & Milestones",
  description: "Recognitions, client milestones, and community honors achieved by Satya Sai Nagubathula.",
  path: "/achievements",
});

export default function AchievementsPage() {
  return (
    <div className="min-h-screen relative max-w-7xl mx-auto w-full px-4 sm:px-12">
      <main className="relative z-10 flex flex-col pt-8 sm:pt-14">
        <Achievements />
      </main>
      <Footer />
    </div>
  );
}
