"use client";

import { useEffect, useState } from "react";

export default function CRTDistortion() {
  const [crtEnabled, setCrtEnabled] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("portfolio-crt-v2");
      if (stored === "false") {
        setCrtEnabled(false);
      }
    } catch {}

    const handleToggle = (e) => {
      setCrtEnabled(e.detail);
    };

    window.addEventListener("toggle-scanlines", handleToggle);
  }, []);

  useEffect(() => {
    if (crtEnabled) {
      document.body.classList.add("has-crt-distortion");
    } else {
      document.body.classList.remove("has-crt-distortion");
    }
  }, [crtEnabled]);

  return (
    <>
      {/* Warm paper grain texture */}
      <div className="paper-grain" aria-hidden="true" />

      {/* SVG Z-Axis Spherical Lens Bulge Filter */}
      <svg width="0" height="0" style={{ position: "fixed", top: 0, left: 0, width: 0, height: 0, pointerEvents: "none" }} aria-hidden="true">
        <defs>
          <filter id="crt-z-bulge" x="-20%" y="-20%" width="140%" height="140%">
            <feImage href="/crt-displacement.png" xlinkHref="/crt-displacement.png" result="displaceMap" preserveAspectRatio="none" />
            <feDisplacementMap in="SourceGraphic" in2="displaceMap" scale="160" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {crtEnabled && (
        <>
          {/* Subtle CRT scanlines */}
          <div className="crt-scanlines" aria-hidden="true" />

          {/* Gentle edge vignette - pushed to perimeter so navbar is 100% visible */}
          <div className="crt-vignette" aria-hidden="true" />

          {/* Curved Cathode Glass Glare */}
          <div className="crt-glass-glare" aria-hidden="true" />

          {/* Clean CRT Monitor Chassis Bezel with Gentle Curvature */}
          <svg
            className="crt-barrel-bezel"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Dark matte chassis mask with gentle curved tube opening */}
            <path
              fillRule="evenodd"
              fill="#100e0c"
              d="M 0,0 L 1000,0 L 1000,600 L 0,600 Z
                 M 20,16
                 Q 500,8 980,16
                 Q 990,16 992,26
                 Q 996,300 992,574
                 Q 990,584 980,584
                 Q 500,592 20,584
                 Q 10,584 8,574
                 Q 4,300 8,26
                 Q 10,16 20,16 Z"
            />

            {/* Subtle natural glass edge highlight - zero harsh neon */}
            <path
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
              d="M 20,16
                 Q 500,8 980,16
                 Q 990,16 992,26
                 Q 996,300 992,574
                 Q 990,584 980,584
                 Q 500,592 20,584
                 Q 10,584 8,574
                 Q 4,300 8,26
                 Q 10,16 20,16 Z"
            />
          </svg>
        </>
      )}
    </>
  );
}
