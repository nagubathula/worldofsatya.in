"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SelectedWorks } from "@/components/SelectedWorks";
import { Archive } from "@/components/Archive";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] overflow-x-hidden flex flex-col font-sans">
      <Header />
      <Hero />
      <SelectedWorks />
      <Archive />
      <About />
      <Footer />
    </main>
  );
}
