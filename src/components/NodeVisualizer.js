"use client";

import { motion } from "framer-motion";

export default function NodeVisualizer() {
  const nodes = [
    { title: "Prompt Architecture", desc: "Structuring text inputs for maximal control over temporal coherence." },
    { title: "ComfyUI Engine", desc: "Custom node workflows for latent space manipulation and IP-Adapters." },
    { title: "Video Generation", desc: "Temporal upscaling and final render using Veo 3 / Wan 2.2." }
  ];

  return (
    <section className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-black/5 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="text-xl font-medium text-black">Pipeline Architecture</h2>
          <p className="mt-4 text-sm text-black/60 max-w-xs leading-relaxed">
            Visualizing multi-modal AI video pipelines. Bridging human-centered design with extreme technical automation.
          </p>
        </div>
        
        <div className="md:col-span-8 flex flex-col gap-12 border-l border-black/5 pl-8 md:pl-16 relative">
          <motion.div 
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-gradient-to-b from-black via-black/20 to-transparent origin-top" 
          />
          
          {nodes.map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative"
            >
              <div className="absolute top-2 -left-[37px] md:-left-[69px] w-[6px] h-[6px] rounded-full bg-black" />
              <h3 className="text-2xl font-medium text-black mb-2 tracking-tight">{node.title}</h3>
              <p className="text-black/60 text-base max-w-md">{node.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
