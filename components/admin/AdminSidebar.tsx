"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, ImageIcon, History, Settings, LogOut, ExternalLink } from "lucide-react";

const menu = [
  { name: "仪表盘", href: "/admin", icon: LayoutDashboard },
  { name: "成员管理", href: "/admin/members", icon: Users },
  { name: "相册管理", href: "/admin/albums", icon: ImageIcon },
  { name: "历史管理", href: "/admin/history", icon: History },
  { name: "站点设置", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col h-screen fixed left-0 top-0 border-r border-stone-800 z-40">
      <div className="p-6 border-b border-stone-800">
        <h1 className="text-xl font-serif text-stone-100">家族管理后台</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menu.map(({ name, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              pathname === href
                ? "bg-amber-700 text-white shadow-md"
                : "hover:bg-stone-800 text-stone-400 hover:text-stone-200"
            }`}
          >
            <Icon size={18} />
            <span className="font-medium">{name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-800 space-y-2">
        <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-2 text-sm text-stone-500 hover:text-stone-300 transition-colors">
          <ExternalLink size={16} />
          <span>返回前台</span>
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors">
          <LogOut size={16} />
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
