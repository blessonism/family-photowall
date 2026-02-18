"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/admin": "仪表盘",
  "/admin/members": "成员管理",
  "/admin/albums": "相册管理",
  "/admin/history": "历史大事记",
  "/admin/settings": "站点设置",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const title = titles[pathname] || "管理后台";

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-stone-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-bold text-stone-800 font-serif">{title}</h2>
        <p className="text-xs text-stone-500">家族网站管理系统</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs border border-amber-200">
        A
      </div>
    </header>
  );
}
