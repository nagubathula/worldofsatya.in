import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import ParallaxBackground from "@/components/ParallaxBackground";
import ClickBurst from "@/components/ClickBurst";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://worldofsatya.in"),
  title: "Satya Sai Nagubathula | Portfolio",
  description: "Engineering AI to build better and faster products. Frontend Engineering, Product Design & Generative AI.",
  keywords: [
    "Frontend Engineering",
    "Product Design",
    "Generative AI",
    "AI Video Pipelines",
    "UI Design",
    "ComfyUI",
    "Next.js",
  ],
  openGraph: {
    title: "Satya Sai Nagubathula | The AI/UI Guy",
    description: "Engineering AI to build better and faster products. Frontend Engineering, Product Design & Generative AI.",
    url: "https://worldofsatya.in",
    siteName: "World of Satya",
    images: [{ url: "/main.jpeg", width: 800, height: 800, alt: "Satya Sai Nagubathula" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Satya Sai Nagubathula | The AI/UI Guy",
    description: "Engineering AI to build better and faster products. Frontend Engineering, Product Design & Generative AI.",
    images: ["/main.jpeg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-clip max-w-full">
      <body className={`${geist.variable} ${jetbrainsMono.variable} font-sans text-foreground bg-transparent tracking-tight pb-24 overflow-x-clip w-full max-w-full relative`} suppressHydrationWarning>
        <ParallaxBackground />
        <CustomCursor />
        <ClickBurst />
        <SmoothScroll>
          {children}
          <BottomNav />
        </SmoothScroll>
      </body>
    </html>
  );
}
