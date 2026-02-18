import Image from "next/image";
import Link from "next/link";
import { getAlbums } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { blurPlaceholder } from "@/lib/images";

const recentAlbums = getAlbums().slice(0, 3);

export default function RecentActivities() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="家族影像" subtitle="那些美好的瞬间" />

        <div className="grid md:grid-cols-3 gap-6">
          {recentAlbums.map((album, i) => (
            <ScrollReveal key={album.id} delay={i * 0.1}>
              <div className="group rounded-lg overflow-hidden shadow-sm bg-card">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={album.cover}
                    alt={album.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={blurPlaceholder}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-foreground-muted">
                    {album.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {album.title}
                  </h3>
                  <p className="text-sm text-foreground-subtle mt-1">
                    {album.date} &middot; {album.photos.length} 张照片
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-accent transition-colors"
          >
            浏览全部影像
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
