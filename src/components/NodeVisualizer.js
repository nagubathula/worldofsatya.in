"use client";



export default function NodeVisualizer() {
  const nodes = [
    { title: "Prompt Architecture", desc: "Structuring text inputs for maximal control over temporal coherence." },
    { title: "ComfyUI Engine", desc: "Custom node workflows for latent space manipulation and IP-Adapters." },
    { title: "Video Generation", desc: "Temporal upscaling and final render using Veo 3 / Wan 2.2." }
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto mt-20">
      <div className="flex flex-col gap-10">
        <div>
          <h2 className="text-xl font-medium text-foreground">Pipeline Architecture</h2>
          <p className="mt-4 text-sm text-foreground/60 max-w-xl leading-relaxed">
            Visualizing multi-modal AI video pipelines. Bridging human-centered design with extreme technical automation.
          </p>
        </div>
        
        <div className="flex flex-col gap-8 border-l-2 border-foreground/5 pl-8 md:pl-12 relative">
          <div 
            className="absolute top-0 bottom-0 left-[-2px] w-[2px] bg-gradient-to-b from-black via-black/20 to-transparent origin-top" 
          />
          {nodes.map((node, i) => (
            <div
              key={i}
              className="relative group flex flex-col p-6 sm:p-8 bg-background rounded-3xl border border-foreground/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:scale-[1.01] transition-all duration-300"
            >
              <div className="absolute top-1/2 -translate-y-1/2 -left-[38px] md:-left-[54px] w-3 h-3 rounded-full bg-background border-[3px] border-foreground/20 shadow-sm" />
              <h3 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">{node.title}</h3>
              <p className="text-foreground/60 text-base max-w-2xl">{node.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
