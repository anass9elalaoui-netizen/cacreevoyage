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
    // Keep optimised images 30 days instead of the 60 s default
    minimumCacheTTL: 2592000,
  },
  async headers() {
    return [
      {
        // Files in /public have no hash in their name: cache 7 days, revalidate in background
        source: '/:all*(mp4|MP4|webm|webp|png|jpg|jpeg|svg|pdf)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }],
      },
    ]
  },
  experimental: {
    reactCompiler: false,
  },
}

export default withPayload(nextConfig)
