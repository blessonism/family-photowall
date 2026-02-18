"use client";

export default function FilterBar({
  items,
  activeItem,
  onSelect,
}: {
  items: string[];
  activeItem: string;
  onSelect: (item: string) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`px-4 py-2 rounded-full text-sm transition-all ${
            activeItem === item
              ? "bg-accent text-white"
              : "bg-background-alt text-foreground-muted hover:text-foreground"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
