/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["zustand", "@supabase/supabase-js"],
  },
};

module.exports = nextConfig;
