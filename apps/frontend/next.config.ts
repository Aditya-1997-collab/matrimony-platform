import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // <--- ADD THIS LINE
  images: {
    unoptimized: true, // <--- ALSO ADD THIS (Required for GitHub Pages image support)
  },
};

export default nextConfig;
