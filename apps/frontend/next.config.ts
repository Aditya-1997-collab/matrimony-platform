import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? "/matrimony-platform" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
