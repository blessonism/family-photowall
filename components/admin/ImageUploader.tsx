"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  targetDir: string;
  prefix?: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ value, targetDir, prefix = "upload", onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const upload = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("targetDir", targetDir);
        fd.append("prefix", prefix);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "上传失败");
        onChangeRef.current(data.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "上传失败");
      } finally {
        setUploading(false);
      }
    },
    [targetDir, prefix],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload],
  );

  const hasImage = value && !value.includes("placeholder");

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => { if (!uploading) inputRef.current?.click(); }}
        className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-colors overflow-hidden h-40
          ${dragOver ? "border-amber-400 bg-amber-50" : "border-stone-300 hover:border-stone-400 bg-stone-50"}
          ${!hasImage ? "flex items-center justify-center" : ""}`}
      >
        {hasImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="absolute inset-0 w-full h-full object-cover" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChangeRef.current(""); }}
              className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 z-10"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="text-center text-stone-400">
            {uploading ? (
              <Loader2 size={24} className="mx-auto mb-2 animate-spin" />
            ) : (
              <Upload size={24} className="mx-auto mb-2" />
            )}
            <p className="text-sm">{uploading ? "上传中..." : "点击或拖拽上传图片"}</p>
            <p className="text-xs mt-1">JPG / PNG / WebP, 最大 2MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
