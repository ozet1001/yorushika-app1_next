/** @type {import('next').NextConfig} */
const nextConfig = {
  // 画像最適化設定を追加
  images: {
    domains: [
      "i.ytimg.com", // YouTube MVサムネイル
      "img.youtube.com", // YouTube画像
      "pbs.twimg.com", // Twitter画像
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yorushika-image-1.s3.ap-northeast-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
