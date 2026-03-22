import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
