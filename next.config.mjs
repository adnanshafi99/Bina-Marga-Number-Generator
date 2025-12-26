/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Skip database connection during build
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;

