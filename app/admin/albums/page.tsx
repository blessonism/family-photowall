"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import Image from "next/image";
import FormDrawer from "@/components/admin/FormDrawer";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";

interface Photo { src: string; caption: string }
interface Album { id: string; title: string; date: string; category: string; cover: string; photos: Photo[] }

const emptyAlbum = { title: "", date: "", category: "其他", cover: "", photos: [] as Photo[] };

export default function AlbumsAdminPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Album | null>(null);
  const [form, setForm] = useState(emptyAlbum);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Album | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/albums");
      setAlbums(await res.json());
    } catch {
      showToast("加载相册失败", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyAlbum, date: new Date().toISOString().slice(0, 10) });
    setDrawerOpen(true);
  };

  const openEdit = (a: Album) => {
    setEditing(a);
    setForm({ title: a.title, date: a.date, category: a.category, cover: a.cover, photos: [...a.photos] });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { showToast("标题不能为空", "error"); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/albums/${editing.id}` : "/api/albums";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      showToast(editing ? "相册已更新" : "相册已创建", "success");
      setDrawerOpen(false);
      load();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "保存失败", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/albums/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("相册已删除", "success");
      setDeleteTarget(null);
      load();
    } catch {
      showToast("删除失败", "error");
    } finally {
      setDeleting(false);
    }
  };

  const addPhoto = () => setForm((prev) => ({ ...prev, photos: [...prev.photos, { src: "", caption: "" }] }));
  const removePhoto = (i: number) => setForm((prev) => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }));
  const updatePhoto = (i: number, field: keyof Photo, value: string) =>
    setForm((prev) => ({ ...prev, photos: prev.photos.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)) }));

  const uploadPhotoFile = async (i: number, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("targetDir", "gallery");
    fd.append("prefix", form.title || "photo");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      updatePhoto(i, "src", data.url);
    } catch (e) {
      showToast(e instanceof Error ? e.message : "上传失败", "error");
    }
  };

  if (loading) return <p className="text-stone-400 text-center py-20">加载中...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-stone-500">共 {albums.length} 个相册</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg text-sm hover:bg-stone-900 transition-colors">
          <Plus size={16} /> 创建相册
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {albums.map((a) => (
          <div key={a.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="relative h-40 bg-stone-100">
              <Image src={a.cover} alt={a.title} fill className="object-cover" unoptimized />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-stone-800">{a.title}</h3>
              <p className="text-xs text-stone-500 mt-1">{a.date} · {a.category} · {a.photos.length} 张</p>
              <div className="flex gap-1 mt-3">
                <button onClick={() => openEdit(a)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-600 transition-colors">
                  <Pencil size={13} /> 编辑
                </button>
                <button onClick={() => setDeleteTarget(a)} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-colors">
                  <Trash2 size={13} /> 删除
                </button>
              </div>
            </div>
          </div>
        ))}
        {albums.length === 0 && <p className="text-stone-400 col-span-full text-center py-8">暂无相册</p>}
      </div>

      <FormDrawer open={drawerOpen} title={editing ? "编辑相册" : "创建相册"} onClose={() => setDrawerOpen(false)} onSubmit={handleSave} loading={saving}>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">封面图</span>
          <div className="mt-1">
            <ImageUploader value={form.cover} targetDir="gallery" prefix={form.title || "cover"} onChange={(url) => setForm((p) => ({ ...p, cover: url }))} />
          </div>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">标题 *</span>
          <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">日期</span>
            <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">分类</span>
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none">
              {["节日", "旅行", "庆典", "日常", "其他"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-stone-700">照片列表</span>
            <button type="button" onClick={addPhoto} className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1">
              <Plus size={14} /> 添加照片
            </button>
          </div>
          <div className="space-y-3">
            {form.photos.map((photo, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="w-20 h-20 shrink-0 relative rounded overflow-hidden bg-stone-200">
                  {photo.src && !photo.src.includes("placeholder") ? (
                    <Image src={photo.src} alt="" fill className="object-cover" unoptimized />
                  ) : (
                    <label className="w-full h-full flex items-center justify-center cursor-pointer text-stone-400 hover:text-stone-500">
                      <Upload size={18} />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhotoFile(i, f); e.target.value = ""; }} />
                    </label>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input value={photo.caption} onChange={(e) => updatePhoto(i, "caption", e.target.value)} placeholder="照片说明" className="w-full px-2 py-1.5 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                  <input value={photo.src} onChange={(e) => updatePhoto(i, "src", e.target.value)} placeholder="图片路径" className="w-full px-2 py-1.5 text-xs border border-stone-200 rounded-lg text-stone-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
                </div>
                <button onClick={() => removePhoto(i)} className="text-stone-400 hover:text-red-500 mt-1">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </FormDrawer>

      <ConfirmDialog
        open={!!deleteTarget}
        message={`确定要删除相册「${deleteTarget?.title}」及其所有照片吗？此操作不可撤销。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
