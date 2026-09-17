import ToolShowcase from "@/components/ToolShowcase";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Internal Tools | Satya Sai Nagubathula — Systems & Automations",
  description: "Internal software, production dashboards, and workflow automations created by Satya Sai Nagubathula.",
};

export default function InternalToolsPage() {
  return (
    <div className="min-h-screen relative max-w-7xl mx-auto w-full px-4 sm:px-12">
      <main className="relative z-10 flex flex-col pt-8 sm:pt-14">
        <ToolShowcase />
      </main>
      <Footer />
    </div>
  );
}
