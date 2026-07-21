"use client";



export default function OpenSource() {
  const projects = [
    {
      name: "CHAYA UI",
      role: "Core Contributor",
      description: "A modern, functional design system and component library for React built with Next.js and TailwindCSS. Collaborated directly with creators on design, development, and optimization. Authored several exclusive custom components.",
    },
    {
      name: "Engineerudu",
      role: "FOSS Community Builder",
      description: "Building Andhra Pradesh's first Free and Open Source Community to foster local talent and collaborative development.",
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5">
      <div className="flex flex-col gap-10">
        <div>
          <h2 className="text-xl font-medium text-black">Open Source</h2>
          <p className="mt-4 text-sm text-black/60 max-w-xl leading-relaxed">
            Giving back to the community through code, design, and education.
          </p>
        </div>
        
        <div className="flex flex-col gap-6">
          {projects.map((project, i) => (
            <div
              key={i}
              className="group flex flex-col justify-between p-6 sm:p-8 bg-white rounded-3xl border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:scale-[1.01] transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-black tracking-tight mb-1">{project.name}</h3>
              <p className="text-xs font-semibold text-black/40 uppercase tracking-widest mb-4">{project.role}</p>
              <p className="text-black/70 text-base max-w-2xl leading-relaxed">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
