import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "images.bewakoof.com",
      "th.bing.com",
      "images-na.ssl-images-amazon.com",
    ],
  },
};

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
