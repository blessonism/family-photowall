"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import FormDrawer from "@/components/admin/FormDrawer";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";

interface HistoryEvent { year: number; title: string; description: string; image: string }

const emptyEvent = { year: new Date().getFullYear(), title: "", description: "", image: "" };

export default function HistoryAdminPage() {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<HistoryEvent | null>(null);
  const [form, setForm] = useState(emptyEvent);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HistoryEvent | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/history");
      setEvents(await res.json());
    } catch {
      showToast("加载历史事件失败", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyEvent);
    setDrawerOpen(true);
  };

  const openEdit = (ev: HistoryEvent) => {
    setEditing(ev);
    setForm({ year: ev.year, title: ev.title, description: ev.description, image: ev.image });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { showToast("标题不能为空", "error"); return; }
    if (!form.year) { showToast("年份不能为空", "error"); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/history/${editing.year}` : "/api/history";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      showToast(editing ? "事件已更新" : "事件已添加", "success");
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
      const res = await fetch(`/api/history/${deleteTarget.year}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("事件已删除", "success");
      setDeleteTarget(null);
      load();
    } catch {
      showToast("删除失败", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="text-stone-400 text-center py-20">加载中...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-stone-500">共 {events.length} 个事件</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg text-sm hover:bg-stone-900 transition-colors">
          <Plus size={16} /> 添加事件
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium w-24">年份</th>
              <th className="text-left px-4 py-3 font-medium">标题</th>
              <th className="text-left px-4 py-3 font-medium">描述</th>
              <th className="text-right px-4 py-3 font-medium w-24">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {events.map((ev) => (
              <tr key={ev.year} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3 font-bold text-amber-700">{ev.year}</td>
                <td className="px-4 py-3 font-medium text-stone-800">{ev.title}</td>
                <td className="px-4 py-3 text-stone-600 truncate max-w-xs">{ev.description}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => openEdit(ev)} className="p-1.5 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteTarget(ev)} className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && <p className="text-center text-stone-400 py-8">暂无历史事件</p>}
      </div>

      <FormDrawer open={drawerOpen} title={editing ? "编辑事件" : "添加事件"} onClose={() => setDrawerOpen(false)} onSubmit={handleSave} loading={saving}>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">配图</span>
          <div className="mt-1">
            <ImageUploader value={form.image} targetDir="history" prefix={String(form.year)} onChange={(url) => setForm((p) => ({ ...p, image: url }))} />
          </div>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">年份 *</span>
            <input type="number" value={form.year} onChange={(e) => setForm((p) => ({ ...p, year: Number(e.target.value) }))} className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">标题 *</span>
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">描述</span>
          <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={4} className="mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none" />
        </label>
      </FormDrawer>

      <ConfirmDialog
        open={!!deleteTarget}
        message={`确定要删除「${deleteTarget?.year} - ${deleteTarget?.title}」吗？此操作不可撤销。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
