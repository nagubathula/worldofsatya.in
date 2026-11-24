/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "(?:lab|labs|uilab)\\..*" }],
          destination: "/ui",
        },
        {
          source: "/:first((?!ui$|api$|_next$)[^./]+)/:rest*",
          has: [{ type: "host", value: "(?:lab|labs|uilab)\\..*" }],
          destination: "/ui/:first/:rest*",
        },
      ],
    };
  },
};

export default nextConfig;
