import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production
  compress: true,
  // Disable source maps in production (optional, untuk reduce bundle size)
  productionBrowserSourceMaps: false,
  // Vercel optimizations
  reactStrictMode: true,
  // swcMinify is default in Next.js 16, no need to specify
};

export default nextConfig;
