import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import AppleNavbar from "@/components/AppleNavbar";

export const metadata = {
  metadataBase: new URL("https://worldofsatya.in"),
  title: "Satya Sai Nagubathula | Design Technologist & AI Engineer",
  description: "Design Technologist and AI Engineer building interfaces, interactive prototypes, and AI-powered tools across product design, frontend engineering, and generative AI.",
  keywords: [
    "Design Technologist",
    "Design Technology",
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
    title: "Satya Sai Nagubathula | Design Technologist & AI Engineer",
    description: "Design Technologist and AI Engineer building interfaces, interactive prototypes, and AI-powered tools across product design, frontend engineering, and generative AI.",
    url: "https://worldofsatya.in",
    siteName: "World of Satya",
    images: [{ url: "/main.jpeg", width: 800, height: 800, alt: "Satya Sai Nagubathula" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Satya Sai Nagubathula | Design Technologist & AI Engineer",
    description: "Design Technologist and AI Engineer building interfaces, interactive prototypes, and AI-powered tools across product design, frontend engineering, and generative AI.",
    images: ["/main.jpeg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-clip max-w-full">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('portfolio-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = stored === 'dark' || (!stored && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('theme-dark');
                  } else {
                    document.documentElement.classList.remove('theme-dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`font-sans text-foreground bg-background tracking-tight overflow-x-clip w-full max-w-full relative antialiased selection:bg-foreground selection:text-background`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AppleNavbar />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
