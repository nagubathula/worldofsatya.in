import OpenSource from "@/components/OpenSource";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Open Source | Satya Sai Nagubathula — Community & Code",
  description: "Open-source software, design primitives, and developer tooling built and maintained by Satya Sai Nagubathula.",
};

export default function OpenSourcePage() {
  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-foreground selection:text-background relative max-w-7xl mx-auto w-full px-4 sm:px-12">
      <main className="relative z-10 flex flex-col pt-8 sm:pt-14">
        <OpenSource />
      </main>
      <Footer />
    </div>
  );
}
