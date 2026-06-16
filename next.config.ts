import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  // The /resume.pdf route reads @fontsource .woff files from node_modules at
  // runtime (via process.cwd()). Standalone output traces only imported files,
  // so force-include the fonts or the PDF route 404s on the fonts in prod.
  outputFileTracingIncludes: {
    "/resume.pdf": [
      "./node_modules/@fontsource/inter-tight/files/*.woff",
      "./node_modules/@fontsource/fraunces/files/*.woff",
    ],
  },
  async redirects() {
    return [
      {
        source: "/writing",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/writing/:slug*",
        destination: "/blog/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
