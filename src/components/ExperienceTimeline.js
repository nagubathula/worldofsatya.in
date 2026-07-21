"use client";



export default function ExperienceTimeline() {
  const experiences = [
    {
      year: "05/2025 - Present",
      role: "Generative AI Engineer and Creative Lead",
      company: "NXTWAVE DISRUPTIVE TECHNOLOGIES",
      description: "Led AI production, scaling channels to 100K+ followers and orchestrating 2,000+ videos. Pioneered structured JSON automation for models like Veo 3 & Wan 2.2. Built internal tools slashing asset creation time by 90%.",
    },
    {
      year: "11/2024 - 03/2025",
      role: "Freelance",
      company: "CrestLogic Systems",
      description: "Branding, User Interface Design, and marketing funnel development for billjot.",
    },
    {
      year: "07/2024 - 10/2024",
      role: "Product Design Engineer (Consultant)",
      company: "Andhra Pradesh Solar Power Corporation",
      description: "UI Design, Web Design, and Fullstack Web development.",
    },
    {
      year: "08/2023 - 07/2024",
      role: "Product Engineer (Intern)",
      company: "Traboda Solutions",
      description: "UI Designer, Hardware Security Researcher, and Fullstack Web Development.",
    },
    {
      year: "01/2022 - 02/2023",
      role: "Design and Development Engineer (Intern)",
      company: "Redantio Solutions",
      description: "UI Designer, Figma Tutor, Graphic Design, Hardware Security Research and Web Development.",
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5">
      <div className="flex flex-col gap-10">
        <div>
          <h2 className="text-xl font-medium text-black">Experience</h2>
          <p className="mt-4 text-sm text-black/60 max-w-xl leading-relaxed">
            A history of bridging design and engineering.
          </p>
        </div>
        
        <div className="flex flex-col gap-6">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 md:gap-6 p-6 sm:p-8 bg-white rounded-3xl border border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="pt-1">
                <span className="text-sm font-mono text-black/40 bg-black/5 px-3 py-1 rounded-full">{exp.year}</span>
              </div>
              <div className="w-full">
                <h3 className="text-2xl font-semibold text-black tracking-tight mb-1">{exp.role}</h3>
                <h4 className="text-base font-medium text-black/60 mb-4">{exp.company}</h4>
                <p className="text-black/70 text-base max-w-2xl leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
