/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use Next.js defaults for both `output` and `distDir`. We do not
  // set `output: 'standalone'` here: that mode produces a self-contained
  // Node.js server bundle for self-hosting (e.g. Docker), not a folder
  // Vercel can serve as static output. Combined with a `distDir`
  // override and a `vercel.json` pointing at that override, every
  // route 404'd in production. Removed in milestone 12.
  // Enable CORS for Design Mode to load resources cross-origin (dev only)
  // Note: Do NOT set allowedDevOrigins - the default allows all origins in dev mode
  async headers() {
    // Only add permissive CORS headers in development
    if (process.env.NODE_ENV !== 'development') {
      return [];
    }
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
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
