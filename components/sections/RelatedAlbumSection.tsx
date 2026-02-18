"use client";

import { useState } from "react";
import { getAlbumsByMemberId } from "@/lib/data";
import type { Photo } from "@/lib/data";
import RelatedPhoto from "@/components/ui/RelatedPhoto";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Lightbox from "@/components/ui/Lightbox";

export default function RelatedAlbumSection({
  memberId,
}: {
  memberId: string;
}) {
  const albumPhotos = getAlbumsByMemberId(memberId);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState<Photo[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (albumPhotos.length === 0) return null;

  const allPhotos = albumPhotos.flatMap((ap) =>
    ap.photos.map((p) => ({ ...p, albumTitle: ap.album.title }))
  );

  const openLightbox = (index: number) => {
    setLightboxPhotos(allPhotos);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <ScrollReveal>
      <div>
        <SectionHeading title="关联相册" small />

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {allPhotos.map((photo, i) => (
            <RelatedPhoto
              key={i}
              src={photo.src}
              caption={photo.caption}
              albumTitle={photo.albumTitle}
              onClick={() => openLightbox(i)}
            />
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
    </ScrollReveal>
  );
}
