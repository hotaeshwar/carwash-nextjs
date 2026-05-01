/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  reactStrictMode: true,
  devIndicators: false,  // ✅ Removes N logo
};

export default nextConfig;  // ✅ ES module syntax (not module.exports)