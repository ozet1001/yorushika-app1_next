/** @type {import('next').NextConfig} */
const nextConfig = {
  // 画像最適化設定を追加
  images: {
    // domains を削除して、すべて remotePatterns に統一
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
      // YouTube MVサムネイル
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**",
      },
      // YouTube画像
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/**",
      },
      // Twitter画像
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;