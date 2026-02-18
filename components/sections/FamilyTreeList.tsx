"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { buildFamilyTree, getGenerations } from "@/lib/data";
import type { FamilyTreeNode } from "@/lib/data";
import FamilyTreeNodeCard from "@/components/ui/FamilyTreeNode";

const tree = buildFamilyTree();
const generations = getGenerations();

const genLabels = ["一", "二", "三", "四", "五"];

function flattenByGeneration(nodes: FamilyTreeNode[]): Map<number, FamilyTreeNode[]> {
  const map = new Map<number, FamilyTreeNode[]>();

  function walk(node: FamilyTreeNode) {
    const gen = node.member.generation;
    if (!map.has(gen)) map.set(gen, []);
    map.get(gen)!.push(node);
    node.children.forEach(walk);
  }

  nodes.forEach(walk);
  return map;
}

export default function FamilyTreeList() {
  const genMap = flattenByGeneration(tree);
  const [expanded, setExpanded] = useState<Set<number>>(new Set(generations));

  const toggle = (gen: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(gen)) next.delete(gen);
      else next.add(gen);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {generations.map((gen) => {
        const nodes = genMap.get(gen) || [];
        const isOpen = expanded.has(gen);

        return (
          <div key={gen} className="bg-card rounded-lg shadow-sm overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              onClick={() => toggle(gen)}
            >
              <span className="font-serif font-bold text-foreground">
                第{genLabels[gen - 1] || gen}代
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-foreground-subtle">{nodes.length}人</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-foreground-subtle transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-2 px-4 pb-4">
                    {nodes.map((node) => (
                      <FamilyTreeNodeCard key={node.member.id} member={node.member} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
