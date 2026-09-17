"use client";

import { useEffect, useState } from "react";

export default function CRTDistortion() {
  const [mapUrl, setMapUrl] = useState(null);

  useEffect(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const imgData = ctx.createImageData(size, size);
    const data = imgData.data;

    // Distortion amount (higher = more bulging)
    const k = 0.2;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const nx = (x / size) * 2 - 1;
        const ny = (y / size) * 2 - 1;
        const r = Math.sqrt(nx * nx + ny * ny);
        
        let dx = 0;
        let dy = 0;
        
        if (r < 1.5) {
          const factor = 1 + k * r * r;
          dx = nx * factor - nx;
          dy = ny * factor - ny;
        }

        // Map to 0-255 (128 is neutral)
        const rVal = Math.max(0, Math.min(255, 128 + dx * 128));
        const gVal = Math.max(0, Math.min(255, 128 + dy * 128));

        const idx = (y * size + x) * 4;
        data[idx] = rVal;     // R -> X displacement
        data[idx + 1] = gVal; // G -> Y displacement
        data[idx + 2] = 0;    // B
        data[idx + 3] = 255;  // A
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setMapUrl(canvas.toDataURL("image/png"));

    // Add a class to the body that will be targeted by the global styles
    document.body.classList.add("has-crt-distortion");

    return () => {
      document.body.classList.remove("has-crt-distortion");
    };
  }, []);

  if (!mapUrl) return null;

  return (
    <>
      <svg style={{ position: "fixed", width: 0, height: 0, pointerEvents: "none", zIndex: -1 }}>
        <defs>
          <filter id="crt-bulge" x="-10%" y="-10%" width="120%" height="120%">
            <feImage href={mapUrl} result="map" preserveAspectRatio="none" />
            {/* The scale determines how strong the distortion is. Scale is based on screen pixels. */}
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="map" 
              scale="40" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>
      <style dangerouslySetInnerHTML={{ __html: `
        .has-crt-distortion #crt-content {
          filter: url(#crt-bulge);
          transform: translateZ(0) scale(1.02); /* Force hardware acceleration and hide pulled edges */
          min-height: 100vh;
        }
      `}} />
    </>
  );
}
