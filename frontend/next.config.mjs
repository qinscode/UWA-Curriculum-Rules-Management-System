/** @type {import('next').NextConfig} */

import { config } from 'dotenv'
config()

const nextConfig = {
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: undefined
  }
}

export default nextConfig
