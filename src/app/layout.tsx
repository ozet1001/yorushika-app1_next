import type { Metadata, Viewport  } from "next";
import Script from 'next/script'
import localFont from "next/font/local";
import { Kaisei_Decol } from 'next/font/google'
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";


const kaisei = Kaisei_Decol({ 
  weight: ['500', '700'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-kaisei',
});

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
  title: "月猫図書館",
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-KJ3G5HC4CL"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KJ3G5HC4CL');
            `}
          </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kaisei.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
