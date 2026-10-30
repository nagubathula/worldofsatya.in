import Link from "next/link";
import ChibiAvatar from "@/components/ChibiAvatar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Page not found | Satya Sai Nagubathula",
};

const ways = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/works" },
  { label: "Gallery", href: "/gallery" },
];

// A broken link lands on the face, not a dead end: three ways back in.
// The big face stands in for the corner one, which hides here (globals.css).
export default function NotFound() {
  return (
    <div data-not-found className="relative mx-auto min-h-screen w-full max-w-7xl px-4 sm:px-12">
      <main className="flex min-h-[85dvh] flex-col items-center justify-center pt-16 text-center">
        <div className="h-40 w-40 sm:h-48 sm:w-48">
          <ChibiAvatar className="h-full w-full" />
        </div>
        <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73]">404</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-[#111111] sm:text-6xl">
          This page wandered off.
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#6e6e73]">
          The link might be old, or the page moved. Try one of these instead.
        </p>
        <nav aria-label="Ways back" className="mt-8 flex flex-wrap justify-center gap-2">
          {ways.map((way, i) => (
            <Link
              key={way.href}
              href={way.href}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                i === 0
                  ? "bg-[#1d1d1f] text-white hover:bg-[#333336]"
                  : "border border-black/[0.08] text-[#1d1d1f] hover:bg-black/[0.04]"
              }`}
            >
              {way.label}
            </Link>
          ))}
        </nav>
      </main>
      <Footer />
    </div>
  );
}
