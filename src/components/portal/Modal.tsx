"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", key); document.body.style.overflow = prev; };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] grid place-items-end bg-black/70 backdrop-blur-sm sm:place-items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-md border border-white/15 bg-navy p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button onClick={onClose} aria-label="Fechar" className="grid h-9 w-9 place-items-center hover:bg-white/10"><X size={18} /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
