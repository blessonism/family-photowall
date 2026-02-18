import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import GiscusComments from "@/components/ui/GiscusComments";

export const metadata: Metadata = {
  title: "留言纪念",
  description: "分享你的祝福与回忆，留下对家族的美好寄语。",
  openGraph: {
    title: "留言纪念 - 家族传承",
    description: "分享你的祝福与回忆，留下对家族的美好寄语。",
  },
};

export default function GuestbookPage() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          title="留言纪念"
          subtitle="分享你的祝福与回忆"
        />

        <div className="bg-background-alt rounded-lg p-8 text-center mb-12">
          <p className="text-foreground-muted leading-relaxed">
            这里是家族的留言墙，每一位来访者都可以在这里留下对家族的祝福、
            分享与家人相关的美好记忆，或者写下对长辈的感恩之情。
          </p>
        </div>

        <GiscusComments />
      </div>
    </div>
  );
}
