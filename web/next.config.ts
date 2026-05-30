import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Fixes the workspace root warning [1]
    turbopack: {
      root: process.cwd(),
    },
  // 2. Your existing Strapi image configurations
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '**',
      },
    ],
    unoptimized: true, 
  },
};

export default nextConfig;
