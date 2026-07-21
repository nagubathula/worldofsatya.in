"use client";

export default function AIVideoShowcase() {
  const videos = [
    {
      src: "/aivideos/AI_ADVERTISEMENT.mp4",
      title: "AI Advertisement",
      description: "Generative AI commercial showcase.",
    },
    {
      src: "/aivideos/HANGY.mp4",
      title: "HANGY",
      description: "AI Video generation experiment.",
    },
    {
      src: "/aivideos/engineerudu_horizontal.mp4",
      title: "Engineerudu (Horizontal)",
      description: "Promotional AI video for FOSS community.",
    },
    {
      src: "/aivideos/engineerudu_vertical.mp4",
      title: "Engineerudu (Vertical)",
      description: "Vertical format AI promotional content.",
    }
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5">
      <div className="flex flex-col gap-10">
        <div>
          <h2 className="text-xl font-medium text-black">AI Video Generation</h2>
          <p className="mt-4 text-sm text-black/60 max-w-xl leading-relaxed">
            Showcasing advanced generative AI video workflows. Combining temporal coherence, custom nodes, and latent space manipulation using tools like ComfyUI, Veo 3, and Wan 2.2.
          </p>
        </div>
        
        <div className="flex flex-col gap-12 min-w-0">
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 items-start scroll-smooth">
            {videos.map((video, i) => (
              <div key={i} className="flex flex-col items-start group w-[85vw] sm:w-auto snap-center shrink-0">
                <div className="relative rounded-2xl overflow-hidden bg-black/5 mb-4 shadow-sm border border-black/5 flex justify-center items-center w-full h-auto sm:w-auto sm:h-[320px]">
                  <video 
                    src={video.src} 
                    controls 
                    preload="metadata"
                    playsInline
                    className="w-full h-auto sm:w-auto sm:h-full"
                  />
                </div>
                <div className="w-full sm:max-w-xs">
                  <h3 className="text-lg font-medium text-black tracking-tight mb-1">{video.title}</h3>
                  <p className="text-black/60 text-sm leading-relaxed">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
