import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'odroidhc4.lan',
        port: '9000',
        pathname: '/**', // Allow all paths under this domain
      },
    ],
  },
};

export default nextConfig;
