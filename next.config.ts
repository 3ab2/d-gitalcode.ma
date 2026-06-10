import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = {
  serverExternalPackages: ["esbuild"],
  // Allow iPhone / LAN devices to connect to dev HMR (webpack-hmr WebSocket)
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.219.1",
    "10.10.100.12",
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 88, 92],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default withSerwist(nextConfig);
