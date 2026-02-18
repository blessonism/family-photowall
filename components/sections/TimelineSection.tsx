import type { MemberTimeline } from "@/lib/data";
import TimelineEvent from "@/components/ui/TimelineEvent";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function TimelineSection({
  timeline,
}: {
  timeline: MemberTimeline[];
}) {
  if (timeline.length === 0) return null;

  const sorted = [...timeline].sort((a, b) => a.year - b.year);

  return (
    <ScrollReveal>
      <div>
        <SectionHeading title="人生里程碑" small />

        <div className="relative">
          <div className="absolute left-[4px] top-2 bottom-2 w-px bg-border" />
          <div className="space-y-5">
            {sorted.map((item, i) => (
              <TimelineEvent
                key={item.year}
                year={item.year}
                event={item.event}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
