/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // necessário para Docker/EasyPanel
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
  },
}

module.exports = nextConfig
