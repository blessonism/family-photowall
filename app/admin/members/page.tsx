"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import FormDrawer from "@/components/admin/FormDrawer";
import ImageUploader from "@/components/admin/ImageUploader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";

interface MemberTimeline { year: number; event: string }
interface Member {
  id: string;
  name: string;
  generation: number;
  branch: string;
  title: string;
  bio: string;
  photo: string;
  birthYear: number;
  highlights: string[];
  parentId: string | null;
  spouseId: string | null;
  childrenIds: string[];
  gender: "M" | "F";
  timeline: MemberTimeline[];
}

const empty: Omit<Member, "id"> = {
  name: "",
  generation: 1,
  branch: "主家",
  title: "",
  bio: "",
  photo: "",
  birthYear: new Date().getFullYear(),
  highlights: [],
  parentId: null,
  spouseId: null,
  childrenIds: [],
  gender: "M",
  timeline: [],
};

export default function MembersAdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/members");
      setMembers(await res.json());
    } catch {
      showToast("加载成员失败", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setDrawerOpen(true);
  };

  const openEdit = (m: Member) => {
    setEditing(m);
    setForm({
      name: m.name, generation: m.generation, branch: m.branch, title: m.title,
      bio: m.bio, photo: m.photo, birthYear: m.birthYear, highlights: m.highlights,
      parentId: m.parentId, spouseId: m.spouseId, childrenIds: m.childrenIds,
      gender: m.gender, timeline: m.timeline || [],
    });
    setDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { showToast("姓名不能为空", "error"); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/members/${editing.id}` : "/api/members";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      showToast(editing ? "成员已更新" : "成员已添加", "success");
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
      const res = await fetch(`/api/members/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("成员已删除", "success");
      setDeleteTarget(null);
      load();
    } catch {
      showToast("删除失败", "error");
    } finally {
      setDeleting(false);
    }
  };

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addTimelineItem = () => {
    setForm((prev) => ({
      ...prev,
      timeline: [...prev.timeline, { year: new Date().getFullYear(), event: "" }],
    }));
  };

  const updateTimeline = (idx: number, field: "year" | "event", value: string | number) => {
    setForm((prev) => ({
      ...prev,
      timeline: prev.timeline.map((t, i) => i === idx ? { ...t, [field]: value } : t),
    }));
  };

  const removeTimeline = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== idx),
    }));
  };

  const getMemberName = (id: string | null) => {
    if (!id) return "";
    return members.find((m) => m.id === id)?.name || id;
  };

  if (loading) return <p className="text-stone-400 text-center py-20">加载中...</p>;

  const inputCls = "mt-1 w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-stone-500">共 {members.length} 位成员</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg text-sm hover:bg-stone-900 transition-colors">
          <Plus size={16} /> 添加成员
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">姓名</th>
              <th className="text-left px-4 py-3 font-medium">辈分</th>
              <th className="text-left px-4 py-3 font-medium">分支</th>
              <th className="text-left px-4 py-3 font-medium">性别</th>
              <th className="text-left px-4 py-3 font-medium">父/母</th>
              <th className="text-right px-4 py-3 font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3 font-medium text-stone-800">{m.name}</td>
                <td className="px-4 py-3 text-stone-600">第 {m.generation} 代</td>
                <td className="px-4 py-3 text-stone-600">{m.branch}</td>
                <td className="px-4 py-3 text-stone-600">{m.gender === "M" ? "男" : "女"}</td>
                <td className="px-4 py-3 text-stone-600">{getMemberName(m.parentId) || "—"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => openEdit(m)} className="p-1.5 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeleteTarget(m)} className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && <p className="text-center text-stone-400 py-8">暂无成员</p>}
      </div>

      <FormDrawer open={drawerOpen} title={editing ? "编辑成员" : "添加成员"} onClose={() => setDrawerOpen(false)} onSubmit={handleSave} loading={saving}>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">头像</span>
          <div className="mt-1">
            <ImageUploader value={form.photo} targetDir="members" prefix={form.name || "member"} onChange={(url) => setField("photo", url)} />
          </div>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">姓名 *</span>
          <input value={form.name} onChange={(e) => setField("name", e.target.value)} className={inputCls} />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">辈分（代）</span>
            <input type="number" value={form.generation} onChange={(e) => setField("generation", Number(e.target.value))} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">分支</span>
            <input value={form.branch} onChange={(e) => setField("branch", e.target.value)} className={inputCls} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">头衔</span>
            <input value={form.title} onChange={(e) => setField("title", e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">出生年份</span>
            <input type="number" value={form.birthYear} onChange={(e) => setField("birthYear", Number(e.target.value))} className={inputCls} />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">性别</span>
          <select value={form.gender} onChange={(e) => setField("gender", e.target.value as "M" | "F")} className={inputCls}>
            <option value="M">男</option>
            <option value="F">女</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">简介</span>
          <textarea value={form.bio} onChange={(e) => setField("bio", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">亮点标签（逗号分隔）</span>
          <input
            value={form.highlights.join(", ")}
            onChange={(e) => setField("highlights", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className={inputCls}
            placeholder="如：高级工程师, 家族活动组织者"
          />
        </label>

        {/* 家族关系 */}
        <div className="border-t border-stone-200 pt-4 mt-2">
          <p className="text-sm font-medium text-stone-700 mb-3">家族关系</p>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-stone-500">父/母</span>
              <select value={form.parentId || ""} onChange={(e) => setField("parentId", e.target.value || null)} className={inputCls}>
                <option value="">无</option>
                {members.filter((m) => m.id !== editing?.id).map((m) => (
                  <option key={m.id} value={m.id}>{m.name}（第{m.generation}代）</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-stone-500">配偶</span>
              <select value={form.spouseId || ""} onChange={(e) => setField("spouseId", e.target.value || null)} className={inputCls}>
                <option value="">无</option>
                {members.filter((m) => m.id !== editing?.id).map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="block mt-3">
            <span className="text-xs text-stone-500">子女（多选）</span>
            <div className="mt-1 max-h-32 overflow-y-auto border border-stone-300 rounded-lg p-2 space-y-1">
              {members.filter((m) => m.id !== editing?.id).map((m) => (
                <label key={m.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.childrenIds.includes(m.id)}
                    onChange={(e) => {
                      if (e.target.checked) setField("childrenIds", [...form.childrenIds, m.id]);
                      else setField("childrenIds", form.childrenIds.filter((c) => c !== m.id));
                    }}
                    className="rounded border-stone-300"
                  />
                  {m.name}（第{m.generation}代）
                </label>
              ))}
            </div>
          </label>
        </div>

        {/* 人生里程碑 */}
        <div className="border-t border-stone-200 pt-4 mt-2">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-stone-700">人生里程碑</p>
            <button type="button" onClick={addTimelineItem} className="text-xs text-amber-600 hover:text-amber-700">
              + 添加
            </button>
          </div>
          <div className="space-y-2">
            {form.timeline.map((t, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="number"
                  value={t.year}
                  onChange={(e) => updateTimeline(i, "year", Number(e.target.value))}
                  className="w-20 px-2 py-1.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="年份"
                />
                <input
                  value={t.event}
                  onChange={(e) => updateTimeline(i, "event", e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  placeholder="事件描述"
                />
                <button type="button" onClick={() => removeTimeline(i)} className="p-1 text-stone-400 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </FormDrawer>

      <ConfirmDialog
        open={!!deleteTarget}
        message={`确定要删除成员「${deleteTarget?.name}」吗？此操作不可撤销。`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
