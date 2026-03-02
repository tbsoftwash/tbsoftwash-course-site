import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Prevent Next from inferring an unrelated workspace root when multiple lockfiles exist.
    root: __dirname,
  },
};

export default nextConfig;
