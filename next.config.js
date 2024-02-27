const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");
const withVanillaExtract = createVanillaExtractPlugin();

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
};

module.exports = withVanillaExtract(nextConfig);
