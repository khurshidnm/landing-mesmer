import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/i,
      type: "asset/resource",
      generator: {
        filename: "static/uploads/[hash][ext][query]",
      },
    });
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
      allowedOrigins: ["http://localhost:3000"],
    },
  },

};

export default nextConfig;
