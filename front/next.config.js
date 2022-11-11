/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    ENVIRONMENT: process.env.ENVIRONMENT,
    SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    BASE_URL: process.env.BASE_URL,
  },
}

module.exports = nextConfig
