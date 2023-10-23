/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "secure-api.net",
      },
    ],
  },
};

module.exports = nextConfig;
