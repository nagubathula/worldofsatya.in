"use client";



export default function HeroSection() {
  return (
    <section className="flex flex-col justify-center px-6 sm:px-12 max-w-7xl mx-auto w-full pt-24 pb-12">
      <div className="mb-8">
        <p className="text-sm md:text-base font-medium text-black/60">
         I am <span className="font-bold"> Satya Sai Nagubathula </span>, currently
        </p>
      </div>

      <h1 className="text-[12vw] sm:text-7xl md:text-8xl lg:text-[110px] font-medium leading-[0.9] tracking-[-0.04em] max-w-5xl text-black">
        The AI Guy.
      </h1>

      <div className="mt-10 max-w-2xl">
        <p className="text-lg sm:text-xl text-black/70 leading-relaxed font-normal">
          I bridge the gap between creative visual direction and deep technical automation. Currently architecting multi-modal AI video pipelines and building tools that scale digital content production by 90%.
        </p>
        
        <div className="mt-8 flex gap-6 items-center">
          <a href="/files/Resume.pdf" target="_blank" rel="noopener noreferrer" className="text-sm font-medium bg-black text-white px-4 py-2 rounded-full hover:bg-black/80 transition-colors">Resume</a>
          <a href="mailto:nagubathula.satyasai@gmail.com" className="text-sm font-medium hover:text-black/50 transition-colors">Email</a>
          <a href="https://www.linkedin.com/in/satyasainagubathula" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-black/50 transition-colors">LinkedIn</a>
          <a href="https://hippogriff.medium.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-black/50 transition-colors">Medium</a>
        </div>
      </div>
    </section>
  );
}
