"use client";

import dynamic from "next/dynamic";
import WorksFan from "@/components/WorksFan";
import ButtonLab from "@/components/ButtonLab";
import SensorLab from "@/components/SensorLab";
import LayoutLab from "@/components/LayoutLab";
import TypeLab from "@/components/TypeLab";
import CommandPaletteLab from "@/components/CommandPaletteLab";
import DrawerLab from "@/components/DrawerLab";
import FormLab from "@/components/FormLab";
import ChartLab from "@/components/ChartLab";
import ThemeLab from "@/components/ThemeLab";
import SynthLab from "@/components/SynthLab";
import SpatialDockLab from "@/components/SpatialDockLab";
import ShaderSurfaceLab from "@/components/ShaderSurfaceLab";
import AIComposerLab from "@/components/AIComposerLab";
import { calendarSections } from "@/components/FlipCalendarNav";
import { useBlackHoleTransition } from "@/components/BlackHoleTransition";

const worksPreview = calendarSections.find((section) => section.isWorks).previewItems;

const LanyardWall = dynamic(() => import("@/components/LanyardWall"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[480px] w-full items-center justify-center font-labMono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
      Initializing WebGL Physics…
    </div>
  ),
});

function WorksHandDemo({ reduceMotion }) {
  const { navigate } = useBlackHoleTransition();
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <div className="relative aspect-[100/124] w-[min(360px,84vw)] sm:aspect-[780/380] sm:w-[min(720px,88%)]">
        <WorksFan items={worksPreview} onNavigate={navigate} interactive reduceMotion={reduceMotion} />
      </div>
    </div>
  );
}

export const LAB_DEMOS = {
  "id-badge": LanyardWall,
  "tactile-synth": SynthLab,
  "shader-surface": ShaderSurfaceLab,
  "spatial-dock": SpatialDockLab,
  "ai-composer": AIComposerLab,
  buttons: ButtonLab,
  layout: LayoutLab,
  type: TypeLab,
  sensors: SensorLab,
  "works-hand": WorksHandDemo,
  "command-palette": CommandPaletteLab,
  "bottom-sheet": DrawerLab,
  forms: FormLab,
  "data-viz": ChartLab,
  "theme-transition": ThemeLab,
};
