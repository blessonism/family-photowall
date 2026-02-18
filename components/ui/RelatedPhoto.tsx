"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { blurPlaceholder } from "@/lib/images";

export default function RelatedPhoto({
  src,
  caption,
  albumTitle,
  onClick,
}: {
  src: string;
  caption: string;
  albumTitle: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg cursor-pointer group"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="relative aspect-square">
        <Image
          src={src}
          alt={caption}
          fill
          sizes="(max-width: 640px) 33vw, 20vw"
          placeholder="blur"
          blurDataURL={blurPlaceholder}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <p className="text-white text-xs font-medium">{caption}</p>
        <p className="text-white/60 text-xs">{albumTitle}</p>
      </div>
    </motion.div>
  );
}
