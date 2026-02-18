import Image from "next/image";
import type { MemberWithRelations } from "@/lib/data";
import { blurPlaceholder } from "@/lib/images";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function MemberDetailHero({
  member,
}: {
  member: MemberWithRelations;
}) {
  const genLabels = ["一", "二", "三", "四", "五"];

  return (
    <ScrollReveal>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-md shrink-0">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="224px"
            placeholder="blur"
            blurDataURL={blurPlaceholder}
            className="object-cover"
          />
        </div>

        <div className="text-center md:text-left">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            {member.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-foreground-subtle">
            <span className="text-accent font-medium">{member.title}</span>
            <span>&middot;</span>
            <span>第{genLabels[member.generation - 1] || member.generation}代</span>
            <span>&middot;</span>
            <span>{member.branch}</span>
            <span>&middot;</span>
            <span>{member.birthYear}年生</span>
          </div>

          <p className="mt-4 text-foreground-muted leading-relaxed max-w-xl">
            {member.bio}
          </p>

          {member.highlights.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              {member.highlights.map((h) => (
                <span
                  key={h}
                  className="px-3 py-1 bg-accent-light text-accent text-xs rounded-full"
                >
                  {h}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}
