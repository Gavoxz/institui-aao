"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { PublicStudent } from "@/lib/types";

type ToastItem = { id: number; kind: "ok" | "err"; text: string };
type Ctx = {
  students: PublicStudent[];
  student: PublicStudent | null;
  loading: boolean;
  error: string | null;
  setActiveId: (id: string) => void;
  refresh: () => Promise<void>;
  replace: (s: PublicStudent) => void;
  mask: boolean;
  setMask: (v: boolean) => void;
  toast: (kind: "ok" | "err", text: string) => void;
};

const PortalCtx = createContext<Ctx | null>(null);
export function usePortal() {
  const c = useContext(PortalCtx);
  if (!c) throw new Error("usePortal precisa estar dentro de <Providers>");
  return c;
}

export function cardUrl(s: PublicStudent) {
  return s.card ? `/api/students/${s.id}/card?v=${encodeURIComponent(s.card.updatedAt)}` : null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<PublicStudent[]>([]);
  const [activeId, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mask, setMaskState] = useState(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((kind: "ok" | "err", text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/students", { cache: "no-store" });
      if (!r.ok) throw new Error();
      const d = (await r.json()) as { students: PublicStudent[] };
      setStudents(d.students);
      setError(null);
    } catch {
      setError("Não foi possível carregar os perfis.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    try {
      setActive(localStorage.getItem("inia:active"));
      setMaskState(localStorage.getItem("inia:mask") !== "0");
    } catch {}
  }, [refresh]);

  const student = useMemo(() => students.find((s) => s.id === activeId) ?? students[0] ?? null, [students, activeId]);
  const setActiveId = useCallback((id: string) => {
    setActive(id);
    try { localStorage.setItem("inia:active", id); } catch {}
  }, []);
  const setMask = useCallback((v: boolean) => {
    setMaskState(v);
    try { localStorage.setItem("inia:mask", v ? "1" : "0"); } catch {}
  }, []);
  const replace = useCallback((s: PublicStudent) => setStudents((l) => l.map((x) => (x.id === s.id ? s : x))), []);

  return (
    <PortalCtx.Provider value={{ students, student, loading, error, setActiveId, refresh, replace, mask, setMask, toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-6" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              className={`pointer-events-auto flex max-w-md items-center gap-3 border px-4 py-3 text-sm shadow-2xl backdrop-blur ${t.kind === "ok" ? "border-brand/50 bg-navy-2/95" : "border-red-400/40 bg-[#2a1216]/95"}`}>
              {t.kind === "ok" ? <CheckCircle2 size={16} className="shrink-0 text-brand-soft" /> : <AlertCircle size={16} className="shrink-0 text-red-300" />}
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </PortalCtx.Provider>
  );
}
