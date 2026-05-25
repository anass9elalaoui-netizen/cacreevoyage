import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudflare.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.mixkit.co',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'pub-925c6a08cfd74451a3f7e27ee1e4c8d3.r2.dev',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    reactCompiler: false,
  },
}

export default withPayload(nextConfig)
