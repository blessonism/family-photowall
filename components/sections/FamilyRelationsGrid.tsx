import type { MemberWithRelations } from "@/lib/data";
import RelationCard from "@/components/ui/RelationCard";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function FamilyRelationsGrid({
  member,
}: {
  member: MemberWithRelations;
}) {
  const hasRelations = member.parent || member.spouse || member.children.length > 0;

  if (!hasRelations) return null;

  return (
    <ScrollReveal>
      <div>
        <SectionHeading title="家族关系" small />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {member.parent && (
            <RelationCard
              member={member.parent}
              relation={member.gender === "M" ? "父亲" : "父亲"}
            />
          )}
          {member.spouse && (
            <RelationCard
              member={member.spouse}
              relation={member.gender === "M" ? "妻子" : "丈夫"}
            />
          )}
          {member.children.map((child) => (
            <RelationCard
              key={child.id}
              member={child}
              relation={child.gender === "M" ? "儿子" : "女儿"}
            />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
