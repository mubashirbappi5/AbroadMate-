/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@abroadmate/shared",
    "@abroadmate/validation",
    "@abroadmate/database",
    "@abroadmate/eligibility-engine",
    "@abroadmate/scholarship-engine",
    "@abroadmate/visa-engine",
    "@abroadmate/roadmap-engine",
    "@abroadmate/ai",
  ],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
