import ScrollReveal from "./ScrollReveal";

export default function TimelineEvent({
  year,
  event,
  index,
}: {
  year: number;
  event: string;
  index: number;
}) {
  return (
    <ScrollReveal delay={index * 0.05}>
      <div className="relative flex items-start gap-4 pl-6">
        <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-accent border-2 border-white" />
        <div>
          <span className="font-serif text-sm font-bold text-accent">{year}</span>
          <p className="text-sm text-foreground-muted mt-0.5">{event}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}
