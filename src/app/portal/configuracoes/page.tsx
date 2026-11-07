"use client";
import { useEffect, useState } from "react";
import { Check, Loader2, Plus } from "lucide-react";
import { Modal } from "@/components/portal/Modal";
import { usePortal } from "@/components/portal/Providers";
import type { PublicStudent } from "@/lib/types";

const FIELDS = [["name", "Nome completo"], ["institution", "Instituição"], ["grade", "Série ou curso"], ["shift", "Turno"], ["state", "Estado"]] as const;
type Key = (typeof FIELDS)[number][0];

export default function ConfigPage() {
  const { student, students, setActiveId, refresh, replace, mask, setMask, toast } = usePortal();
  const [form, setForm] = useState<Record<Key, string>>({ name: "", institution: "", grade: "", shift: "", state: "" });
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (student) setForm({ name: student.name, institution: student.institution ?? "", grade: student.grade ?? "", shift: student.shift ?? "", state: student.state ?? "" });
  }, [student]);
  if (!student) return null;

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch(`/api/students/${student.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = (await r.json()) as { student?: PublicStudent; error?: string };
      if (!r.ok || !d.student) throw new Error(d.error);
      replace(d.student);
      toast("ok", "Perfil atualizado.");
    } catch (e) { toast("err", (e as Error).message || "Não foi possível salvar."); }
    finally { setSaving(false); }
  };

  const create = async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newName }) });
      const d = (await r.json()) as { student?: PublicStudent; error?: string };
      if (!r.ok || !d.student) throw new Error(d.error);
      await refresh(); setActiveId(d.student.id); setCreating(false); setNewName("");
      toast("ok", "Perfil criado. Envie a carteirinha em Minha Carteirinha.");
    } catch (e) { toast("err", (e as Error).message || "Não foi possível criar."); }
    finally { setBusy(false); }
  };

  return (
    <>
      <p className="eyebrow">Módulo 05</p>
      <h1 className="mb-8 mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Configurações</h1>
      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="eyebrow mb-4">Perfil ativo</h2>
          <div className="space-y-4">
            {FIELDS.map(([k, label]) => (
              <label key={k} className="block"><span className="mb-1.5 block text-sm text-steel">{label}</span><input className="field" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></label>
            ))}
          </div>
          <p className="mt-4 text-xs text-steel">Número de identificação, CIN e nascimento vêm da carteirinha e são somente leitura.</p>
          <button className="btn-primary mt-6" onClick={save} disabled={saving}>{saving && <Loader2 size={16} className="animate-spin" />}Salvar alterações</button>
        </section>

        <div className="space-y-10">
          <section>
            <h2 className="eyebrow mb-4">Privacidade</h2>
            <div className="panel flex items-center justify-between gap-4 p-4">
              <div><p className="font-medium">Mascarar dados sensíveis</p><p className="text-sm text-steel">Oculta número, CIN e nascimento em Dados cadastrais.</p></div>
              <button role="switch" aria-checked={mask} aria-label="Mascarar dados sensíveis" onClick={() => setMask(!mask)} className={`relative h-7 w-12 shrink-0 transition ${mask ? "bg-brand" : "bg-graphite-2"}`}>
                <span className={`absolute top-1 h-5 w-5 bg-white transition-all ${mask ? "left-6" : "left-1"}`} />
              </button>
            </div>
          </section>
          <section>
            <div className="mb-4 flex items-center justify-between"><h2 className="eyebrow">Perfis demonstrativos</h2><button className="btn-ghost h-9 px-3" onClick={() => setCreating(true)}><Plus size={15} />Novo</button></div>
            <ul className="divide-y divide-white/10 border border-white/10">
              {students.map((s) => (
                <li key={s.id}><button onClick={() => setActiveId(s.id)} className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-white/5">
                  <span><span className="block">{s.name}</span><span className="font-mono text-[11px] text-steel">{s.card ? "carteirinha vinculada" : "sem carteirinha"}</span></span>
                  {s.id === student.id && <Check size={16} className="text-brand-soft" />}
                </button></li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <Modal open={creating} onClose={() => !busy && setCreating(false)} title="Novo perfil demonstrativo">
        <label className="block"><span className="mb-1.5 block text-sm text-steel">Nome completo</span><input autoFocus className="field" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && newName.trim().length >= 3 && create()} /></label>
        <p className="mt-3 text-xs text-steel">O perfil nasce vazio, com pasta de arquivos própria. Nenhum dado é inventado.</p>
        <div className="mt-6 grid grid-cols-2 gap-2"><button className="btn-ghost" onClick={() => setCreating(false)} disabled={busy}>Cancelar</button><button className="btn-primary" onClick={create} disabled={busy || newName.trim().length < 3}>{busy && <Loader2 size={16} className="animate-spin" />}Criar perfil</button></div>
      </Modal>
    </>
  );
}
