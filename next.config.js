/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["zustand", "@supabase/supabase-js"],
  },
  // Turbopack config (Next.js 16 default)
  turbopack: {},
};

module.exports = nextConfig;
