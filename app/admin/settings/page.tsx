"use client";

import { useCallback, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useToast } from "@/components/admin/Toast";

interface SiteConfig {
  title: string;
  familyName: string;
  slogan: string;
  description: string;
  nav: { label: string; href: string }[];
  footer: { copyright: string; message: string };
}

export default function SettingsAdminPage() {
  const [form, setForm] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      setForm(await res.json());
    } catch {
      showToast("加载设置失败", "error");
    }
  }, [showToast]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      showToast("设置已保存", "success");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "保存失败", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <p className="text-stone-400 text-center py-20">加载中...</p>;

  const inputCls = "w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-stone-800">基本信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">网站标题</span>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={`mt-1 ${inputCls}`} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">家族姓氏</span>
            <input value={form.familyName} onChange={(e) => setForm({ ...form, familyName: e.target.value })} className={`mt-1 ${inputCls}`} />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">口号</span>
          <input value={form.slogan} onChange={(e) => setForm({ ...form, slogan: e.target.value })} className={`mt-1 ${inputCls}`} />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-stone-700">简介</span>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`mt-1 ${inputCls} resize-none`} />
        </label>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-stone-800">页脚信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">版权信息</span>
            <input value={form.footer.copyright} onChange={(e) => setForm({ ...form, footer: { ...form.footer, copyright: e.target.value } })} className={`mt-1 ${inputCls}`} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">底部寄语</span>
            <input value={form.footer.message} onChange={(e) => setForm({ ...form, footer: { ...form.footer, message: e.target.value } })} className={`mt-1 ${inputCls}`} />
          </label>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? "保存中..." : "保存设置"}
      </button>
    </div>
  );
}
