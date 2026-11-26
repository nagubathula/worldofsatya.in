import Image from "next/image";

// A row of tall promo panels under a case study's intro. Phones swipe through
// them; wider screens show the whole set side by side.
export default function CaseStudyPanels({ panels, full = false }) {
  return (
    <ul tabIndex={0} aria-label="Product highlights" className={`flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-4 sm:gap-2.5 sm:overflow-visible sm:px-5 [&::-webkit-scrollbar]:hidden ${full ? "lg:gap-5 lg:px-5" : ""}`}>
      {panels.map((panel, i) => (
        <li
          key={panel.src}
          className="cs-rise w-[62vw] shrink-0 snap-center overflow-hidden rounded-[10%/4.6%] sm:w-auto"
          style={{ "--cs-i": i * 2 }}
        >
          <Image
            src={panel.src}
            alt={panel.alt}
            width={1320}
            height={2868}
            sizes={full ? "(min-width: 1024px) 480px, (min-width: 640px) 25vw, 62vw" : "(min-width: 880px) 200px, (min-width: 640px) 25vw, 62vw"}
            loading="eager"
            className="h-auto w-full"
          />
        </li>
      ))}
    </ul>
  );
}
