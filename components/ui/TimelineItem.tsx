import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { blurPlaceholder } from "@/lib/images";

export default function TimelineItem({
  year,
  title,
  description,
  image,
  position,
}: {
  year: number;
  title: string;
  description: string;
  image: string;
  position: "left" | "right";
}) {
  return (
    <div className="relative flex items-center md:gap-8">
      {/* Center line dot */}
      <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-white z-10" />

      {/* Left content (desktop) */}
      <div
        className={`hidden md:block w-1/2 ${position === "left" ? "pr-12" : ""}`}
      >
        {position === "left" && (
          <ScrollReveal direction="left">
            <ItemContent
              year={year}
              title={title}
              description={description}
              image={image}
              align="right"
            />
          </ScrollReveal>
        )}
      </div>

      {/* Right content (desktop) */}
      <div
        className={`hidden md:block w-1/2 ${position === "right" ? "pl-12" : ""}`}
      >
        {position === "right" && (
          <ScrollReveal direction="right">
            <ItemContent
              year={year}
              title={title}
              description={description}
              image={image}
              align="left"
            />
          </ScrollReveal>
        )}
      </div>

      {/* Mobile: always right */}
      <div className="md:hidden pl-10 w-full">
        <ScrollReveal>
          <ItemContent
            year={year}
            title={title}
            description={description}
            image={image}
            align="left"
          />
        </ScrollReveal>
      </div>
    </div>
  );
}

function ItemContent({
  year,
  title,
  description,
  image,
  align,
}: {
  year: number;
  title: string;
  description: string;
  image: string;
  align: "left" | "right";
}) {
  return (
    <div className={`${align === "right" ? "text-right" : "text-left"}`}>
      <span className="font-serif text-2xl font-bold text-accent">{year}</span>
      <div className="mt-3 bg-card rounded-lg overflow-hidden shadow-sm">
        <div className="relative aspect-[2/1]">
          <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" placeholder="blur" blurDataURL={blurPlaceholder} className="object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-serif text-lg font-bold text-foreground">
            {title}
          </h3>
          <p className="mt-2 text-sm text-foreground-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}
