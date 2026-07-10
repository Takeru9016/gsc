import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cdn.sanity.io",
        protocol: "https",
      },
      {
        hostname: "res.cloudinary.com",
        protocol: "https",
      },
    ],
  },
  reactCompiler: false,
  async redirects() {
    return [
      {
        destination: "/sports/open-gym",
        permanent: true,
        source: "/facilities/open-gym",
      },
    ];
  },
};

export default nextConfig;
