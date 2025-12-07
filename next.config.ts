import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production
  compress: true,
  // Disable source maps in production (optional, untuk reduce bundle size)
  productionBrowserSourceMaps: false,
  // Vercel optimizations
  reactStrictMode: true,
  // Performance optimizations
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "date-fns"],
  },
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
