import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coursevideogenerator.blob.core.windows.net',
      },
    ],
  },
  turbopack: {},
};

export default nextConfig;
