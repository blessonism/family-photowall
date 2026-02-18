"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";
interface Toast { id: string; message: string; type: ToastType }
interface ToastCtx { showToast: (message: string, type: ToastType) => void }

const Ctx = createContext<ToastCtx | undefined>(undefined);

const icons = { success: CheckCircle, error: AlertCircle, info: Info };
const colors = {
  success: "border-green-200 text-green-800",
  error: "border-red-200 text-red-800",
  info: "border-blue-200 text-blue-800",
};
const iconColors = { success: "text-green-500", error: "text-red-500", info: "text-blue-500" };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <Ctx.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border w-80 bg-white ${colors[t.type]}`}
              >
                <Icon className={`w-5 h-5 ${iconColors[t.type]}`} />
                <p className="text-sm font-medium flex-1">{t.message}</p>
                <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="text-stone-400 hover:text-stone-600">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
