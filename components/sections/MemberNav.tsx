import Link from "next/link";
import type { Member } from "@/lib/data";

export default function MemberNav({
  prev,
  next,
}: {
  prev: Member | null;
  next: Member | null;
}) {
  return (
    <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
      {prev ? (
        <Link
          href={`/members/${prev.id}`}
          className="flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>{prev.name}</span>
        </Link>
      ) : (
        <div />
      )}

      <Link
        href="/members"
        className="text-sm text-foreground-subtle hover:text-accent transition-colors"
      >
        返回列表
      </Link>

      {next ? (
        <Link
          href={`/members/${next.id}`}
          className="flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
        >
          <span>{next.name}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
