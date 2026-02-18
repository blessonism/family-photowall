import type { Metadata } from "next";
import { getHistoryEvents } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import TimelineItem from "@/components/ui/TimelineItem";

export const metadata: Metadata = {
  title: "家族历史",
  description: "那些岁月里的重要时刻，记录家族的历史大事记。",
  openGraph: {
    title: "家族历史 - 家族传承",
    description: "那些岁月里的重要时刻，记录家族的历史大事记。",
  },
};

const events = getHistoryEvents();

export default function HistoryPage() {
  return (
    <div className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="家族历史"
          subtitle="那些岁月里的重要时刻"
        />

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-[22px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {events.map((event, i) => (
              <TimelineItem
                key={event.year}
                year={event.year}
                title={event.title}
                description={event.description}
                image={event.image}
                position={i % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
