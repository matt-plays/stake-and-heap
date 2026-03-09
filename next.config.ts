import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@mattplays/mpds'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
