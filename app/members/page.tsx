"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getMembers, getGenerations, getBranches } from "@/lib/data";
import type { Member } from "@/lib/data";
import { blurPlaceholder } from "@/lib/images";
import SectionHeading from "@/components/ui/SectionHeading";
import MemberCard from "@/components/ui/MemberCard";
import FilterBar from "@/components/ui/FilterBar";
import ScrollReveal from "@/components/ui/ScrollReveal";
import FamilyTree from "@/components/sections/FamilyTree";
import FamilyTreeList from "@/components/sections/FamilyTreeList";

const members = getMembers();
const generations = getGenerations();
const branches = getBranches();

const genLabels = generations.map((g) => `第${["一", "二", "三", "四", "五"][g - 1] || g}代`);
const filterItems = ["全部", ...genLabels, ...branches];

type ViewMode = "tree" | "list";

export default function MembersPage() {
  const [activeFilter, setActiveFilter] = useState("全部");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const filtered = activeFilter === "全部"
    ? members
    : members.filter((m) => {
        const genIdx = genLabels.indexOf(activeFilter);
        if (genIdx >= 0) return m.generation === generations[genIdx];
        return m.branch === activeFilter;
      });

  return (
    <div className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="家族成员" subtitle="每一位家人都是传承的力量" />

        {/* View toggle */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              viewMode === "tree"
                ? "bg-accent text-white"
                : "bg-background-alt text-foreground-muted hover:text-foreground"
            }`}
            onClick={() => setViewMode("tree")}
          >
            家族树
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              viewMode === "list"
                ? "bg-accent text-white"
                : "bg-background-alt text-foreground-muted hover:text-foreground"
            }`}
            onClick={() => setViewMode("list")}
          >
            列表视图
          </button>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "tree" ? (
            <motion.div
              key="tree"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Desktop: FamilyTree, Mobile: FamilyTreeList */}
              <div className="hidden md:block">
                <FamilyTree />
              </div>
              <div className="md:hidden">
                <FamilyTreeList />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <FilterBar
                items={filterItems}
                activeItem={activeFilter}
                onSelect={setActiveFilter}
              />

              <motion.div
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((member, i) => (
                    <motion.div
                      key={member.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Link href={`/members/${member.id}`}>
                        <MemberCard member={member} />
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Member detail modal (kept for backward compat, optional) */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={selectedMember.photo}
                  alt={selectedMember.name}
                  fill
                  sizes="512px"
                  placeholder="blur"
                  blurDataURL={blurPlaceholder}
                  className="object-cover"
                />
                <button
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
                  onClick={() => setSelectedMember(null)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-baseline gap-3">
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    {selectedMember.name}
                  </h2>
                  <span className="text-sm text-accent">{selectedMember.title}</span>
                </div>
                <p className="mt-1 text-xs text-foreground-subtle">
                  第{["一", "二", "三", "四", "五"][selectedMember.generation - 1]}代 &middot; {selectedMember.branch}
                </p>
                <p className="mt-4 text-foreground-muted leading-relaxed">
                  {selectedMember.bio}
                </p>
                {selectedMember.highlights.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedMember.highlights.map((h) => (
                      <span
                        key={h}
                        className="px-3 py-1 bg-accent-light text-accent text-xs rounded-full"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
