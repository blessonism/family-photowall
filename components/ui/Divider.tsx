export default function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 py-8 ${className}`}>
      <div className="flex-1 max-w-32 h-px bg-border" />
      <div className="w-1.5 h-1.5 rotate-45 bg-accent" />
      <div className="flex-1 max-w-32 h-px bg-border" />
    </div>
  );
}
