import type { Metadata } from "next";
import { Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import PublicShell from "@/components/layout/PublicShell";
import "./globals.css";

const notoSerif = Noto_Serif_SC({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const notoSans = Noto_Sans_SC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "家族传承 - 张氏家族",
    template: "%s | 家族传承",
  },
  description: "记录我们家族的故事、传统与精神，连接过去与未来。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "家族传承",
    title: "家族传承 - 张氏家族",
    description: "记录我们家族的故事、传统与精神，连接过去与未来。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${notoSerif.variable} ${notoSans.variable} font-sans antialiased`}
      >
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
