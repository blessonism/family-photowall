import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "影像画廊",
  description: "用镜头记录家族的每一刻，珍藏那些温暖的瞬间。",
  openGraph: {
    title: "影像画廊 - 家族传承",
    description: "用镜头记录家族的每一刻，珍藏那些温暖的瞬间。",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
