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
    card: "summary",
    title: "Satya Sai Nagubathula | AI + Design Engineer",
    description: "AI + Design Engineer building interfaces, interactive prototypes, and AI-powered tools across product design, frontend engineering, and generative AI.",
    images: ["/main.jpeg"],
  },
};

// Tells search engines who the site is about, so results can show the name,
// role and linked profiles together.
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Satya Sai Nagubathula",
  url: "https://worldofsatya.in",
  image: "https://worldofsatya.in/main.jpeg",
  jobTitle: "AI + Design Engineer",
  sameAs: [
    "https://www.linkedin.com/in/satyasainagubathula",
    "https://github.com/nagubathula",
    "https://www.instagram.com/engineerudu",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-clip max-w-full">
      <body
        className={`${sansFont.variable} font-sans text-foreground bg-background tracking-normal w-full max-w-full relative antialiased selection:bg-foreground selection:text-background text-base`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
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
