"use client";

import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "AI Lora Detection System for Compatriot",
    role: "ML Engineer • Python • Tkinter",
    image: "/images/NbU0l0KX6AVILpHZr98II19w.png",
  },
  {
    id: 2,
    title: "BIllJot - Omnichannel POS for Restaurants",
    role: "Full Stack • Next.js • MongoDB",
    image: "/images/cf7Ykti8tN1i5SnENxbgv3AZhM.jpg",
  },
  {
    id: 3,
    title: "Qubira Ai Chatbot for Practizo",
    role: "AI Engineer • Next.js • Tailwind",
    image: "/images/qPo8UwbXYQLdfL9GWywM4qmZs.jpg",
  },
  {
    id: 4,
    title: "Device Attendance Management System",
    role: "IoT • ESP32 • Python • Discord Bot",
    image: "/images/OWAfbCEyptdBvl7S7klcSgsu5Q.jpeg",
  },
  {
    id: 5,
    title: "BSides Kochi - Landing Page",
    role: "Web Design • Framer Motion • Next.js",
    image: "/images/OWAfbCEyptdBvl7S7klcSgsu5Q.jpeg",
  }
];

export function SelectedWorks() {
  return (
    <section className="bg-[#f2f2f2] py-24 px-8 md:px-12" id="projects">
      <div className="flex flex-col gap-16 max-w-4xl mx-auto">
        {/* Section Title */}
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-black font-sans mb-8">
            Selected Works
          </h2>
        </div>

        {/* Vertical Stack */}
        <div className="flex flex-col gap-16">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-col gap-4 group">
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden relative shadow-md">
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl md:text-3xl font-semibold font-sans leading-tight text-black">
                  {project.title}
                </h3>
                <p className="text-base md:text-lg font-medium font-sans text-gray-500">
                  {project.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
