"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getMembers } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { blurPlaceholder } from "@/lib/images";

const featured = getMembers().slice(0, 4);

export default function MemberHighlight() {
  return (
    <section className="py-24 px-6 bg-background-alt">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="家族成员" subtitle="传承的力量源于每一位家人" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((member, i) => (
            <ScrollReveal
              key={member.id}
              delay={i * 0.1}
            >
              <motion.div
                className="bg-card rounded-lg overflow-hidden shadow-sm group"
                whileHover={{ y: -4 }}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
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
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/members"
            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
          >
            查看全部成员
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
