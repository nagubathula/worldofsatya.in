"use client";

export default function RetroRainbowRibbon({ className = "" }) {
  const stripes = [
    { color: "#4aa3df", name: "cyan" },
    { color: "#5cb88f", name: "green" },
    { color: "#f2c14e", name: "yellow" },
    { color: "#f28e2b", name: "orange" },
    { color: "#e54b4b", name: "red" },
    { color: "#8e5ba5", name: "purple" },
  ];

  return (
    <div 
      className={`w-full flex flex-col overflow-hidden select-none pointer-events-none opacity-90 shadow-[0_1px_2px_rgba(62,56,50,0.1)] ${className}`}
      aria-hidden="true"
    >
      {stripes.map((stripe) => (
        <div
          key={stripe.name}
          className="w-full h-[2px] sm:h-[2.5px]"
          style={{ backgroundColor: stripe.color }}
        />
      ))}
    </div>
  );
}
