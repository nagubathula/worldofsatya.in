import { IBM_Plex_Mono } from "next/font/google";
import LabWorldShell from "@/components/uilab/LabWorldShell";

const labMonoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lab-mono",
  display: "swap",
});

export default function UILabsLayout({ children }) {
  return (
    <div className={labMonoFont.variable}>
      <LabWorldShell>{children}</LabWorldShell>
    </div>
  );
}
