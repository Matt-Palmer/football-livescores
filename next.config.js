/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /*
      `images.domains` was deprecated in Next 15 and removed in 16.
      remotePatterns is stricter: it matches on protocol and path as well as
      hostname, so it cannot be widened by accident.
    */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sportmonks.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
