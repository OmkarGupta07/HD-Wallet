import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Ensure Turbopack uses this project folder as the workspace root so
  // dependency resolution finds `node_modules` inside this folder.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
