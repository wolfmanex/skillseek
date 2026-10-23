import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page depends on the session cookie, so the app renders per request.
  // Cache Components can be adopted later for public pages (job and pro listings).
  // Room for the admin company CSV upload; Vercel caps request bodies at 4.5 MB.
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
