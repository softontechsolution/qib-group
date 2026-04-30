import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '**',
      },
    ],
    unoptimized: true, // This skips the security check and the processing
  },
};

export default nextConfig;
