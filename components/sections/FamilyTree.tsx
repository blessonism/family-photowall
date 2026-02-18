"use client";

import { buildFamilyTree, getGenerations } from "@/lib/data";
import type { FamilyTreeNode as TreeNodeType } from "@/lib/data";
import FamilyTreeNodeCard from "@/components/ui/FamilyTreeNode";
import ScrollReveal from "@/components/ui/ScrollReveal";

const tree = buildFamilyTree();
const generations = getGenerations();

const genLabels = ["一", "二", "三", "四", "五"];

function flattenByGeneration(nodes: TreeNodeType[]): Map<number, TreeNodeType[]> {
  const map = new Map<number, TreeNodeType[]>();

  function walk(node: TreeNodeType) {
    const gen = node.member.generation;
    if (!map.has(gen)) map.set(gen, []);
    map.get(gen)!.push(node);
    node.children.forEach(walk);
  }

  nodes.forEach(walk);
  return map;
}

export default function FamilyTree() {
  const genMap = flattenByGeneration(tree);

  return (
    <div className="space-y-12">
      {generations.map((gen, gi) => {
        const nodes = genMap.get(gen) || [];
        return (
          <ScrollReveal key={gen} delay={gi * 0.1}>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-serif text-lg font-bold text-accent">
                  第{genLabels[gen - 1] || gen}代
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                {nodes.map((node) => (
                  <div key={node.member.id} className="relative">
                    <FamilyTreeNodeCard member={node.member} />
                    {node.children.length > 0 && (
                      <div className="absolute left-1/2 -bottom-6 w-px h-6 bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        );
      })}

      {/* Vertical connector lines between generations */}
      <style jsx>{`
        /* Connection lines handled via absolute positioning on nodes */
      `}</style>
    </div>
  );
}
