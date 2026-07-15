import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Prevent this app's JS and CSS from colliding with the main site's /_next assets.
  assetPrefix: "/landings-assets",
  images: { unoptimized: true },
  turbopack: { root: process.cwd() },
  async rewrites() {
    return [
      // Public images live at the project root, but are exposed below the
      // /landings namespace when this deployment is mounted behind web-ebia.
      { source: "/landings/media/:path*", destination: "/:path*" },
    ];
  },
};
export default nextConfig;
