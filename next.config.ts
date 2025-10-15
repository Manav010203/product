import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ ESLint won't block production builds
  },
  // ...other Next.js config options
}

export default nextConfig
