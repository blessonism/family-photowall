import ScrollReveal from "./ScrollReveal";

export default function SectionHeading({
  title,
  subtitle,
  className = "",
  small,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  small?: boolean;
}) {
  if (small) {
    return (
      <div className={`mb-6 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-accent" />
          <h3 className="font-serif text-xl font-bold text-foreground">{title}</h3>
        </div>
        {subtitle && (
          <p className="mt-1 text-sm text-foreground-muted ml-11">{subtitle}</p>
        )}
      </div>
    );
  }

  return (
    <ScrollReveal className={`text-center mb-16 ${className}`}>
      <div className="w-12 h-px bg-accent mx-auto mb-6" />
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-foreground-muted text-lg">{subtitle}</p>
      )}
    </ScrollReveal>
  );
}
