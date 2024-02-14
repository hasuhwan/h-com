/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/upload/:slug",
        destination: "http://localhost:9090/upload/:slug",
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cloudflare-ipfs.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "loremflickr.com" },
    ],
  },
};

module.exports = nextConfig;
