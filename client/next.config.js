/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["primereact"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
