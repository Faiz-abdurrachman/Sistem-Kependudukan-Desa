import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Optimize for production
  compress: true,
  // Disable source maps in production (optional, untuk reduce bundle size)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
