import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'odroidhc4.lan',
      },
    ],
  },
};

export default nextConfig;
