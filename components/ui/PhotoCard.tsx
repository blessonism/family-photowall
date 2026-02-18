"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { blurPlaceholder } from "@/lib/images";

export default function PhotoCard({
  src,
  caption,
  onClick,
}: {
  src: string;
  caption: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-lg cursor-pointer group"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={src}
          alt={caption}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          placeholder="blur"
          blurDataURL={blurPlaceholder}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
        <p className="p-4 text-white text-sm">{caption}</p>
      </div>
    </motion.div>
  );
}
