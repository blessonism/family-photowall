"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Member } from "@/lib/data";
import { blurPlaceholder } from "@/lib/images";

export default function FamilyTreeNodeCard({
  member,
  isActive,
}: {
  member: Member;
  isActive?: boolean;
}) {
  return (
    <Link href={`/members/${member.id}`}>
      <motion.div
        className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors cursor-pointer ${
          isActive
            ? "bg-accent-light ring-2 ring-accent"
            : "hover:bg-background-alt"
        }`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-border">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="64px"
            placeholder="blur"
            blurDataURL={blurPlaceholder}
            className="object-cover"
          />
        </div>
        <div className="text-center">
          <p className="font-serif text-sm font-bold text-foreground leading-tight">
            {member.name}
          </p>
          <p className="text-xs text-foreground-subtle">{member.title}</p>
        </div>
      </motion.div>
    </Link>
  );
}
