"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { ToastProvider } from "@/components/admin/Toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    fetch("/api/auth/check")
      .then((res) => {
        if (res.ok) setReady(true);
        else router.replace("/admin/login");
      })
      .catch(() => router.replace("/admin/login"));
  }, [isLogin, router]);

  if (isLogin) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-400">验证中...</p>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-stone-50">
        <AdminSidebar />
        <div className="flex-1 ml-64">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
