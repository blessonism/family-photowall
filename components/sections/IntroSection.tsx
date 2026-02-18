import ScrollReveal from "@/components/ui/ScrollReveal";

export default function IntroSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <div className="w-12 h-px bg-accent mx-auto mb-8" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            源远流长
          </h2>
          <p className="mt-6 text-foreground-muted leading-relaxed text-lg max-w-2xl mx-auto">
            我们的家族扎根于这片土地，历经数代人的耕耘与奋斗。
            从祖辈的勤劳朴实，到今日的多元发展，家族的精神一脉相承。
            这里记录着每一位家族成员的故事，每一段值得铭记的历史。
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
