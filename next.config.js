const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false, // Temporarily enable PWA in development for testing
  buildExcludes: [/middleware-manifest\.json$/]
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: []
  }
}

module.exports = withPWA(nextConfig) 