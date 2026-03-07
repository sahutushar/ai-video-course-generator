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
  // Disable turbopack temporarily to avoid persistence directory issues
  // turbopack: {},
};

export default nextConfig;
