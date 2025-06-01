import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Yorushika App 1st",
  description: "ヨルシカの全楽曲の歌詞、MV、制作背景、考察等を一箇所にまとめた総合情報サイト。新規ファンから深い考察を求めるコアファンまで、ヨルシカの世界を深く知ることができるサイト。",
  keywords: [
    "ヨルシカ",
    "歌詞",
    "MV",
    "考察",
    "楽曲解説", 
    "suis",
    "n-buna",
    "音楽",
    "歌詞の意味",
    "ファンアート",
    "新曲",
    "エルマ",
    "エイミー",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
