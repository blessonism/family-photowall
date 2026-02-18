"use client";

import { useState } from "react";
import { getAlbums, getAlbumCategories } from "@/lib/data";
import type { Photo } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import FilterBar from "@/components/ui/FilterBar";
import PhotoCard from "@/components/ui/PhotoCard";
import Lightbox from "@/components/ui/Lightbox";
import ScrollReveal from "@/components/ui/ScrollReveal";

const albums = getAlbums();
const categories = ["全部", ...getAlbumCategories()];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filtered =
    activeCategory === "全部"
      ? albums
      : albums.filter((a) => a.category === activeCategory);

  const openLightbox = (photos: Photo[], index: number) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading title="影像画廊" subtitle="用镜头记录家族的每一刻" />

        <FilterBar
          items={categories}
          activeItem={activeCategory}
          onSelect={setActiveCategory}
        />

        <div className="space-y-16">
          {filtered.map((album) => (
            <ScrollReveal key={album.id}>
              <div>
                <div className="flex items-baseline gap-3 mb-6">
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    {album.title}
                  </h3>
                  <span className="text-sm text-foreground-subtle">
                    {album.date}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {album.photos.map((photo, i) => (
                    <PhotoCard
                      key={i}
                      src={photo.src}
                      caption={photo.caption}
                      onClick={() => openLightbox(album.photos, i)}
                    />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox
          photos={lightboxPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, i - 1))}
          onNext={() =>
            setLightboxIndex((i) => Math.min(lightboxPhotos.length - 1, i + 1))
          }
        />
      )}
    </div>
  );
}
