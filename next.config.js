// next.config.js
//
// We *require* the redirect array out of the archive lib. This is
// JavaScript, not TypeScript, but Next.js bundles redirects() during
// build and `require` of a `.ts` source from `.js` doesn't work in
// Next 15 — so the redirect map is also exported as a generated
// JSON file at `src/lib/archive/redirects.generated.json` (committed,
// kept in sync by `bun run sync:redirects`). The TS source is the
// single source of truth.
const archiveRedirects = require("./src/lib/archive/redirects.generated.json");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return archiveRedirects;
  },
  async headers() {
    if (process.env.NODE_ENV !== "development") return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;