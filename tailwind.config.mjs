/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background-rgb) / <alpha-value>)",
        foreground: "rgb(var(--foreground-rgb) / <alpha-value>)",
        canvas: "rgb(var(--background-rgb) / <alpha-value>)",
        offwhite: "rgb(var(--foreground-rgb) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--ink-primary-rgb) / <alpha-value>)",
          secondary: "rgb(var(--ink-secondary-rgb) / <alpha-value>)",
          muted: "rgb(var(--ink-muted-rgb) / <alpha-value>)",
        },
        sage: "rgb(var(--accent-sage-rgb) / <alpha-value>)",
      },
      // One typeface across the site: every family, mono included, is Inter.
      // UI Labs introduces a dedicated hardware-instrument monospace token (`font-labMono`).
      fontFamily: {
        sans: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        labMono: ["var(--font-lab-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        pixel: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        editorial: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        handwriting: ["var(--font-sans)", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;
