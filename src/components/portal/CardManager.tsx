/* eslint-disable @next/next/no-img-element */
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Expand, Loader2, Maximize2, Printer, RefreshCw, RotateCw, Trash2, UploadCloud, X, ZoomIn, ZoomOut } from "lucide-react";
import type { PublicStudent } from "@/lib/types";
import { formatBytes, formatDate } from "@/lib/format";
import { Modal } from "./Modal";
import { cardUrl, usePortal } from "./Providers";

const MAX = 4 * 1024 * 1024;
const NOTE = "Modelo demonstrativo sem validade oficial. Arquivo exibido sem alterações.";

function Viewer({ src, mode, onClose }: { src: string; mode: "zoom" | "full"; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [rot, setRot] = useState(false);
  const [ratio, setRatio] = useState(1.572);
  const [fs, setFs] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 640 && window.innerHeight > window.innerWidth) setRot(true); // celular em pé: gira para aproveitar a tela
    if (mode === "full") root.current?.requestFullscreen?.().catch(() => {});
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const fsc = () => setFs(!!document.fullscreenElement);
    window.addEventListener("keydown", key);
    document.addEventListener("fullscreenchange", fsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.removeEventListener("fullscreenchange", fsc);
      document.body.style.overflow = prev;
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, [mode, onClose]);

  const toggleFs = () => (document.fullscreenElement ? document.exitFullscreen() : root.current?.requestFullscreen?.())?.catch(() => {});
  const Btn = ({ onClick, label, children, disabled }: { onClick: () => void; label: string; children: React.ReactNode; disabled?: boolean }) => (
    <button onClick={onClick} disabled={disabled} aria-label={label} title={label} className="grid h-11 w-11 place-items-center border border-white/15 bg-black/40 transition hover:bg-white/10 active:scale-95 disabled:opacity-30">{children}</button>
  );

  return (
    <motion.div ref={root} role="dialog" aria-modal="true" aria-label="Visualização da carteirinha" className="fixed inset-0 z-[65] flex flex-col bg-black/95" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <p className="eyebrow truncate pl-1">Minha Carteirinha</p>
        <div className="flex gap-2">
          <Btn label="Diminuir zoom" onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))} disabled={rot || zoom <= 1}><ZoomOut size={18} /></Btn>
          <Btn label="Aumentar zoom" onClick={() => setZoom((z) => Math.min(3, +(z + 0.5).toFixed(1)))} disabled={rot || zoom >= 3}><ZoomIn size={18} /></Btn>
          <Btn label="Girar para o modo celular" onClick={() => { setRot((v) => !v); setZoom(1); }}><RotateCw size={18} /></Btn>
          <Btn label="Tela cheia" onClick={toggleFs}><Maximize2 size={18} className={fs ? "text-brand-soft" : ""} /></Btn>
          <Btn label="Imprimir" onClick={() => window.print()}><Printer size={18} /></Btn>
          <Btn label="Fechar" onClick={onClose}><X size={18} /></Btn>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 overflow-auto p-3">
        {rot ? (
          <div className="m-auto flex-none" style={{ width: `min(calc(100dvh - 8rem), calc((100vw - 1.5rem) * ${ratio}))`, transform: "rotate(90deg)" }}>
            <img src={src} alt="Carteirinha estudantil (girada)" className="block h-auto w-full" onLoad={(e) => setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)} />
          </div>
        ) : (
          <img src={src} alt="Carteirinha estudantil" className="m-auto block" onLoad={(e) => setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight)}
            style={zoom === 1 ? { maxWidth: "100%", maxHeight: "100%", objectFit: "contain" } : { width: `${zoom * 100}%`, maxWidth: "none", flex: "none" }} />
        )}
      </div>
      <p className="px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 text-center text-[11px] text-steel">{NOTE}</p>
    </motion.div>
  );
}

export function CardManager({ student }: { student: PublicStudent }) {
  const { replace, toast } = usePortal();
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<{ file: File; url: string } | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [drag, setDrag] = useState(false);
  const [viewer, setViewer] = useState<null | "zoom" | "full">(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const closeViewer = useCallback(() => setViewer(null), []);

  const src = cardUrl(student);
  const showUploader = !student.card || replacing || !!draft;

  const clearDraft = useCallback(() => {
    setDraft((d) => { if (d) URL.revokeObjectURL(d.url); return null; });
    if (inputRef.current) inputRef.current.value = "";
  }, []);
  useEffect(() => () => { clearDraft(); }, [student.id, clearDraft]);

  const pick = (file?: File | null) => {
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type) || !/\.(png|jpe?g)$/i.test(file.name)) return toast("err", "Formato inválido. Envie PNG, JPG ou JPEG.");
    if (file.size > MAX) return toast("err", `O arquivo tem ${formatBytes(file.size)}. O limite é 4 MB.`);
    clearDraft();
    setDraft({ file, url: URL.createObjectURL(file) });
  };

  const upload = () => {
    if (!draft) return;
    setProgress(0);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/students/${student.id}/card`);
    xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      setProgress(null);
      let d: { error?: string; student?: PublicStudent } = {};
      try { d = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && d.student) {
        replace(d.student); clearDraft(); setReplacing(false);
        toast("ok", "Carteirinha enviada e vinculada ao perfil.");
      } else toast("err", d.error ?? "Falha no envio.");
    };
    xhr.onerror = () => { setProgress(null); toast("err", "Falha de conexão durante o envio."); };
    const fd = new FormData();
    fd.append("file", draft.file);
    xhr.send(fd);
  };

  const remove = async () => {
    setRemoving(true);
    try {
      const r = await fetch(`/api/students/${student.id}/card`, { method: "DELETE" });
      const d = (await r.json()) as { student?: PublicStudent; error?: string };
      if (!r.ok || !d.student) throw new Error(d.error);
      replace(d.student); setConfirmRemove(false);
      toast("ok", "Carteirinha removida do perfil.");
    } catch (e) { toast("err", (e as Error).message || "Não foi possível remover."); }
    finally { setRemoving(false); }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
      <section aria-label="Carteirinha">
        {src && student.card ? (
          <>
            <div className="bg-grid border border-white/10 p-4 sm:p-8" style={{ perspective: 1400 }}>
              <motion.div key={student.card.updatedAt} className="relative mx-auto max-w-3xl overflow-hidden bg-white shadow-[0_30px_80px_-20px_rgba(46,107,255,0.35)]"
                initial={reduce ? false : { opacity: 0, rotateX: -16, y: 36, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, rotateX: 0, y: 0, clipPath: "inset(0 0 0% 0)" }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
                <button onClick={() => setViewer("zoom")} className="block w-full cursor-zoom-in" aria-label="Ampliar carteirinha">
                  <img src={src} alt={`Carteirinha estudantil de ${student.name}`} className="block h-auto w-full" draggable={false} />
                </button>
                {!reduce && <motion.span aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-brand shadow-[0_0_24px_4px_#2E6BFF]" initial={{ left: "0%", opacity: 1 }} animate={{ left: "100%", opacity: 0 }} transition={{ duration: 1.3, delay: 0.5, ease: "easeInOut" }} />}
              </motion.div>
              <p className="mt-4 text-center text-[11px] text-steel">{NOTE}</p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button className="btn-primary" onClick={() => setViewer("zoom")}><Expand size={16} />Ampliar</button>
              <button className="btn-ghost" onClick={() => setViewer("full")}><Maximize2 size={16} />Tela cheia</button>
              <button className="btn-ghost" onClick={() => window.print()}><Printer size={16} />Imprimir</button>
              <button className="btn-ghost" onClick={() => { setReplacing(true); window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); }}><RefreshCw size={16} />Substituir</button>
            </div>
          </>
        ) : (
          <div className="panel grid place-items-center px-6 py-20 text-center"><UploadCloud className="text-steel" size={32} /><p className="mt-4 text-lg font-medium">Nenhuma carteirinha vinculada</p><p className="mt-1 max-w-sm text-sm text-steel">Envie a imagem da carteirinha de {student.name.split(" ")[0]} para exibi-la aqui.</p></div>
        )}
      </section>

      <aside className="space-y-6">
        {student.card && (
          <dl className="panel divide-y divide-white/10 text-sm">
            {[["Arquivo", student.card.originalName], ["Formato", student.card.mime === "image/png" ? "PNG" : "JPEG"], ["Tamanho", formatBytes(student.card.bytes)],
              ["Origem", student.card.source === "seed" ? "Demonstração pré-carregada" : "Enviado pelo estudante"], ["Atualizado", formatDate(student.card.updatedAt)]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-3"><dt className="eyebrow">{k}</dt><dd className="truncate text-right">{v}</dd></div>
            ))}
          </dl>
        )}

        <AnimatePresence initial={false}>
          {showUploader && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <p className="eyebrow mb-3">{student.card ? "Substituir arquivo" : "Enviar carteirinha"}</p>
              {!draft ? (
                <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files?.[0]); }}
                  className={`flex cursor-pointer flex-col items-center gap-3 border border-dashed px-6 py-10 text-center transition ${drag ? "border-brand bg-brand/10" : "border-white/25 hover:border-white/50 hover:bg-white/5"}`}>
                  <UploadCloud size={28} className={drag ? "text-brand-soft" : "text-steel"} />
                  <span className="text-sm"><span className="font-medium text-brand-soft">Selecione</span> ou arraste a imagem aqui</span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-steel">PNG · JPG · JPEG · até 4 MB</span>
                  <input ref={inputRef} type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
                </label>
              ) : (
                <div className="panel p-3">
                  <img src={draft.url} alt="Prévia do arquivo selecionado" className="block h-auto w-full bg-white" />
                  <p className="mt-3 truncate text-sm">{draft.file.name}</p>
                  <p className="font-mono text-[11px] text-steel">{formatBytes(draft.file.size)} · prévia, ainda não enviado</p>
                  {progress !== null && <div className="mt-3 h-1 bg-white/10"><div className="h-full bg-brand transition-all" style={{ width: `${progress}%` }} /></div>}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button className="btn-primary" onClick={upload} disabled={progress !== null}>{progress !== null ? <><Loader2 size={16} className="animate-spin" />{progress}%</> : "Confirmar envio"}</button>
                    <button className="btn-ghost" onClick={clearDraft} disabled={progress !== null}>Cancelar</button>
                  </div>
                </div>
              )}
              {replacing && !draft && <button className="btn-ghost mt-3 w-full" onClick={() => setReplacing(false)}>Cancelar substituição</button>}
            </motion.div>
          )}
        </AnimatePresence>

        {student.card && !showUploader && (
          <button className="btn-danger w-full" onClick={() => setConfirmRemove(true)}><Trash2 size={16} />Remover carteirinha</button>
        )}
        <p className="text-xs leading-relaxed text-steel">O envio não representa emissão, reconhecimento ou validação oficial. O arquivo é guardado e exibido exatamente como foi enviado.</p>
      </aside>

      <AnimatePresence>{viewer && src && <Viewer src={src} mode={viewer} onClose={closeViewer} />}</AnimatePresence>

      <Modal open={confirmRemove} onClose={() => !removing && setConfirmRemove(false)} title="Remover carteirinha?">
        <p className="text-sm text-steel">O arquivo será apagado do armazenamento deste perfil. Você poderá enviar outro depois.</p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button className="btn-ghost" onClick={() => setConfirmRemove(false)} disabled={removing}>Manter</button>
          <button className="btn-danger" onClick={remove} disabled={removing}>{removing ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}Remover</button>
        </div>
      </Modal>

      {src && (
        <div id="print-area" className="hidden print:flex">
          <figure><img src={src} alt="" /><figcaption style={{ marginTop: 8, fontSize: 11, color: "#444" }}>{NOTE}</figcaption></figure>
        </div>
      )}
    </div>
  );
}
