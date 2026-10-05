import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import AppleNavbar from "@/components/AppleNavbar";
import { BlackHoleTransitionProvider } from "@/components/BlackHoleTransition";
import { Inter, EB_Garamond } from "next/font/google";

const sansFont = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

const garamondFont = EB_Garamond({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-editorial',
});

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
                function clean() {
                  var els = document.querySelectorAll('[bis_skin_checked]');
                  for (var i = 0; i < els.length; i++) {
                    els[i].removeAttribute('bis_skin_checked');
                  }
                }
                clean();
                if (typeof MutationObserver !== 'undefined') {
                  var obs = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked' && m.target.hasAttribute('bis_skin_checked')) {
                        m.target.removeAttribute('bis_skin_checked');
                      }
                      if (m.type === 'childList') {
                        clean();
                      }
                    }
                  });
                  if (document.documentElement) {
                    obs.observe(document.documentElement, {
                      attributes: true,
                      attributeFilter: ['bis_skin_checked'],
                      subtree: true,
                      childList: true
                    });
                  }
                  window.addEventListener('DOMContentLoaded', clean);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${sansFont.variable} ${garamondFont.variable} font-sans text-foreground bg-background tracking-normal w-full max-w-full relative antialiased selection:bg-foreground selection:text-background text-base`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <BlackHoleTransitionProvider>
            <AppleNavbar />
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </BlackHoleTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
