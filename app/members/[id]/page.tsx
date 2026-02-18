import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMembers, getMemberWithRelations, getAdjacentMembers } from "@/lib/data";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Divider from "@/components/ui/Divider";
import MemberDetailHero from "@/components/sections/MemberDetailHero";
import FamilyRelationsGrid from "@/components/sections/FamilyRelationsGrid";
import RelatedAlbumSection from "@/components/sections/RelatedAlbumSection";
import TimelineSection from "@/components/sections/TimelineSection";
import MemberNav from "@/components/sections/MemberNav";

export function generateStaticParams() {
  return getMembers().map((m) => ({ id: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const member = getMemberWithRelations(id);
  if (!member) return { title: "成员未找到" };

  return {
    title: `${member.name} - 家族成员`,
    description: member.bio,
    openGraph: {
      title: `${member.name} - 家族传承`,
      description: member.bio,
    },
  };
}

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = getMemberWithRelations(id);
  if (!member) notFound();

  const { prev, next } = getAdjacentMembers(id);

  return (
    <div className="pt-6 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb
          items={[
            { label: "首页", href: "/" },
            { label: "家族成员", href: "/members" },
            { label: member.name },
          ]}
        />

        <MemberDetailHero member={member} />

        <Divider />

        <FamilyRelationsGrid member={member} />

        <Divider />

        <RelatedAlbumSection memberId={member.id} />

        <Divider />

        <TimelineSection timeline={member.timeline} />

        <MemberNav prev={prev} next={next} />
      </div>
    </div>
  );
}
