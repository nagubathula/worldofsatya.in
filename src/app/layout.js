import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground tracking-tight`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
