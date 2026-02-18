"use client";

import { useEffect, useState } from "react";
import { Users, ImageIcon, History, Settings } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";

interface Stats {
  members: number;
  albums: number;
  photos: number;
  events: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [membersRes, albumsRes, historyRes] = await Promise.all([
          fetch("/api/members"),
          fetch("/api/albums"),
          fetch("/api/history"),
        ]);
        const members = await membersRes.json();
        const albums = await albumsRes.json();
        const history = await historyRes.json();

        setStats({
          members: Array.isArray(members) ? members.length : 0,
          albums: Array.isArray(albums) ? albums.length : 0,
          photos: Array.isArray(albums)
            ? albums.reduce((sum: number, a: { photos?: unknown[] }) => sum + (a.photos?.length || 0), 0)
            : 0,
          events: Array.isArray(history) ? history.length : 0,
        });
      } catch {
        setStats({ members: 0, albums: 0, photos: 0, events: 0 });
      }
    }
    load();
  }, []);

  if (!stats) {
    return <p className="text-stone-400 text-center py-20">加载中...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="家族成员" value={stats.members} icon={Users} color="text-blue-600" />
        <StatsCard label="相册数量" value={stats.albums} icon={ImageIcon} color="text-amber-600" />
        <StatsCard label="照片总数" value={stats.photos} icon={ImageIcon} color="text-green-600" />
        <StatsCard label="历史事件" value={stats.events} icon={History} color="text-purple-600" />
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
        <h3 className="font-bold text-stone-800 mb-3">快捷操作</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "添加成员", href: "/admin/members", icon: Users },
            { label: "管理相册", href: "/admin/albums", icon: ImageIcon },
            { label: "编辑历史", href: "/admin/history", icon: History },
            { label: "站点设置", href: "/admin/settings", icon: Settings },
          ].map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-2 px-4 py-3 bg-stone-50 hover:bg-stone-100 rounded-lg text-sm text-stone-700 transition-colors border border-stone-200"
            >
              <Icon size={16} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
