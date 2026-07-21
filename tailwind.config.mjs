/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F5F5F5",
        foreground: "#111111",
        canvas: "#F5F5F5",
        offwhite: "#111111", // Inverting these semantics for the light theme to minimize refactoring
      },
      fontFamily: {
        sans: ["var(--font-geist)", "Inter", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};
