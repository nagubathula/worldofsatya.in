import AIVideoShowcase from "@/components/AIVideoShowcase";
import Footer from "@/components/Footer";
import AppleNavbar from "@/components/AppleNavbar";

export const metadata = {
  title: "AI Videos | Satya Sai Nagubathula — Generative AI Workflows",
  description: "AI video generation, ComfyUI pipelines, and motion experiments orchestrated by Satya Sai Nagubathula.",
};

export default function AIVideosPage() {
  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-foreground selection:text-background relative max-w-7xl mx-auto w-full px-4 sm:px-12">
      <AppleNavbar />
      <main className="relative z-10 flex flex-col pt-8 sm:pt-14">
        <AIVideoShowcase />
      </main>
      <Footer />
    </div>
  );
}
