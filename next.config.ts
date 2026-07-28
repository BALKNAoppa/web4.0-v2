import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 нэг distDir дээр НЭГ л dev server зөвшөөрдөг (.next/dev/lock).
  // Unitel + Univision хоёрыг зэрэг асаахын тулд брэнд бүрт өөр build хавтас.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
