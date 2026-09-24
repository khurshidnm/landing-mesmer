import path from "path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  compress: true,
  // Pin the project root: a stray ~/package-lock.json otherwise makes Next
  // treat the home folder as the workspace root, which breaks Turbopack chunks.
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingRoot: path.resolve(__dirname),
  // Turnstile site key is public by design; accept it with or without the
  // NEXT_PUBLIC_ prefix so the browser widget gets it either way.
  env: {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY:
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
      process.env.TURNSTILE_SITE_KEY ||
      "",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);