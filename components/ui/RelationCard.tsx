"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Member } from "@/lib/data";
import { blurPlaceholder } from "@/lib/images";

export default function RelationCard({
  member,
  relation,
}: {
  member: Member;
  relation: string;
}) {
  return (
    <Link href={`/members/${member.id}`}>
      <motion.div
        className="flex items-center gap-4 bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="56px"
            placeholder="blur"
            blurDataURL={blurPlaceholder}
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-accent">{relation}</p>
          <p className="font-serif font-bold text-foreground truncate">{member.name}</p>
          <p className="text-xs text-foreground-subtle">{member.title}</p>
        </div>
      </motion.div>
    </Link>
  );
}
