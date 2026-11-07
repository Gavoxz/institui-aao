"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Avatar } from "@/components/portal/Avatar";
import { usePortal } from "@/components/portal/Providers";

const hide = (v: string) => v.replace(/[0-9A-Za-zÀ-ú]/g, (c, i: number) => (i >= v.length - 2 ? c : "•"));

export default function DadosPage() {
  const { student, mask } = usePortal();
  const [reveal, setReveal] = useState(false);
  if (!student) return null;
  const show = !mask || reveal;
  const rows: [string, string | undefined, boolean][] = [
    ["Número de identificação", student.idNumber, true], ["CIN", student.cin, true], ["Nascimento", student.birthDate, true],
    ["Estado", student.state, false], ["Instituição", student.institution, false], ["Série ou curso", student.grade, false], ["Turno", student.shift, false],
  ];
  return (
    <>
      <p className="eyebrow">Módulo 03</p>
      <h1 className="mb-8 mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Dados cadastrais</h1>
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <div><Avatar student={student} size={200} variant="portrait" /></div>
        <div>
          <p className="eyebrow">Nome completo</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">{student.name}</p>
          <button className="btn-ghost mt-5 h-10" onClick={() => setReveal((v) => !v)} aria-pressed={show}>{show ? <EyeOff size={16} /> : <Eye size={16} />}{show ? "Ocultar dados sensíveis" : "Exibir dados sensíveis"}</button>
          <dl className="mt-8 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
            {rows.map(([k, v, sensitive]) => (
              <div key={k} className="bg-ink p-5"><dt className="eyebrow text-[10px]">{k}</dt><dd className="mt-1.5 break-words font-mono text-lg">{v ? (sensitive && !show ? hide(v) : v) : <span className="font-sans text-steel">Não informado</span>}</dd></div>
            ))}
          </dl>
          <p className="mt-6 text-xs leading-relaxed text-steel">Informações transcritas da imagem da carteirinha enviada. Não são verificadas nem validadas por nenhuma instituição. Alterações editáveis ficam em Configurações.</p>
        </div>
      </div>
    </>
  );
}
