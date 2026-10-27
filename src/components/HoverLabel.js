// The button's name in a small pill under it, shown on hover or keyboard focus.
// Its parent needs `group/label` and `relative`. Touch screens never hover, so it stays hidden there.
export default function HoverLabel({ children }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-full z-40 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full bg-[#1d1d1f] px-2.5 py-1 text-[11px] font-medium tracking-[-0.01em] text-white opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition duration-200 ease-out group-hover/label:translate-y-0 group-hover/label:opacity-100 group-focus-within/label:translate-y-0 group-focus-within/label:opacity-100 [@media(hover:none)]:hidden"
    >
      {children}
    </span>
  );
}
