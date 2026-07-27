import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import ParallaxBackground from "@/components/ParallaxBackground";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata = {
  title: "Satya Sai Nagubathula | Portfolio",
  description: "AI Pipeline Architect & Creative Technologist",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden max-w-full">
      <body className={`${geist.variable} ${jetbrainsMono.variable} font-sans text-foreground bg-transparent tracking-tight pb-24 overflow-x-hidden w-full max-w-full relative`} suppressHydrationWarning>
        <ParallaxBackground />
        <CustomCursor />
        <SmoothScroll>
          {children}
          <BottomNav />
        </SmoothScroll>
      </body>
    </html>
  );
}
