import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import IntroSection from "@/components/sections/IntroSection";
import MemberHighlight from "@/components/sections/MemberHighlight";
import RecentActivities from "@/components/sections/RecentActivities";
import Divider from "@/components/ui/Divider";

export const metadata: Metadata = {
  title: "首页",
  description: "张氏家族传承官网 - 记录家族的故事、成员与珍贵影像。",
  openGraph: {
    title: "家族传承 - 张氏家族",
    description: "记录家族的故事、成员与珍贵影像。",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <Divider />
      <MemberHighlight />
      <Divider />
      <RecentActivities />
    </>
  );
}
