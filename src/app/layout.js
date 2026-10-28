import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BlackHoleTransitionProvider } from "@/components/BlackHoleTransition";
import HomeFace from "@/components/HomeFace";
import KeyboardNav from "@/components/KeyboardNav";
import TransitionScreen from "@/components/TransitionScreen";
import { Inter } from "next/font/google";

const sansFont = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});


export const metadata = {
  metadataBase: new URL("https://worldofsatya.in"),
  title: "Satya Sai Nagubathula | AI + Design Engineer",
  description: "AI + Design Engineer building interfaces, interactive prototypes, and AI-powered tools across product design, frontend engineering, and generative AI.",
  keywords: [
    "AI + Design Engineer",
    "Design Technologist",
    "AI Engineer",
    "AI Engineering",
    "Frontend Engineering",
    "Product Design",
    "Generative AI",
    "AI Video Pipelines",
    "UI Design",
    "ComfyUI",
    "Next.js",
  ],
  openGraph: {
    title: "Satya Sai Nagubathula | AI + Design Engineer",
    description: "AI + Design Engineer building interfaces, interactive prototypes, and AI-powered tools across product design, frontend engineering, and generative AI.",
    url: "https://worldofsatya.in",
    siteName: "World of Satya",
    images: [{ url: "/main.jpeg", width: 800, height: 800, alt: "Satya Sai Nagubathula" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Satya Sai Nagubathula | AI + Design Engineer",
    description: "AI + Design Engineer building interfaces, interactive prototypes, and AI-powered tools across product design, frontend engineering, and generative AI.",
    images: ["/main.jpeg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-clip max-w-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${sansFont.variable} font-sans text-foreground bg-background tracking-normal w-full max-w-full relative antialiased selection:bg-foreground selection:text-background text-base`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <BlackHoleTransitionProvider>
            <HomeFace />
            <KeyboardNav />
            <TransitionScreen />
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </BlackHoleTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
