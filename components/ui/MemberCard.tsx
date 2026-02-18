"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Member } from "@/lib/data";
import { blurPlaceholder } from "@/lib/images";

export default function MemberCard({
  member,
  onClick,
}: {
  member: Member;
  onClick?: () => void;
}) {
  return (
    <motion.div
      className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          placeholder="blur"
          blurDataURL={blurPlaceholder}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-bold text-foreground">
          {member.name}
        </h3>
        <p className="text-sm text-accent mt-1">{member.title}</p>
        <p className="text-sm text-foreground-muted mt-2 line-clamp-2">
          {member.bio}
        </p>
      </div>
    </motion.div>
  );
}
