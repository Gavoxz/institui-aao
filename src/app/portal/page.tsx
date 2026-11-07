/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, LifeBuoy, Settings2, UserRound } from "lucide-react";
import { cardUrl, usePortal } from "@/components/portal/Providers";
import { formatDate } from "@/lib/format";

export default function Dashboard() {
  const { student } = usePortal();
  if (!student) return null;
  const src = cardUrl(student);
  const first = student.name.split(" ")[0];
  const rows = [["Instituição", student.institution], ["Série ou curso", student.grade], ["Turno", student.shift], ["Estado", student.state]];

  return (
    <>
      <p className="eyebrow">Painel</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Olá, {first}.</h1>
      <p className="mt-3 max-w-xl text-steel">Seu espaço de identificação acadêmica. Tudo aqui é demonstrativo.</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Link href="/portal/carteirinha" className="group panel block p-5 transition hover:border-brand/60">
          <div className="flex items-center justify-between"><span className="eyebrow">Carteirinha</span><ArrowUpRight size={18} className="text-steel transition group-hover:text-white" /></div>
          {src ? (
            <>
              <div className="bg-grid mt-4 p-4 sm:p-6"><img src={src} alt="" className="mx-auto block h-auto w-full max-w-xl bg-white shadow-2xl" draggable={false} /></div>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-steel">Vinculada · atualizada em {formatDate(student.card!.updatedAt)}</p>
            </>
          ) : (
            <div className="mt-4 border border-dashed border-white/20 py-14 text-center text-sm text-steel">Nenhuma carteirinha enviada ainda.<span className="mt-3 flex items-center justify-center gap-2 text-brand-soft">Enviar agora <ArrowRight size={14} /></span></div>
          )}
        </Link>

        <div className="space-y-6">
          <dl className="panel divide-y divide-white/10">
            <p className="eyebrow px-5 py-4">Registro</p>
            {rows.map(([k, v]) => (<div key={k} className="px-5 py-4"><dt className="eyebrow text-[10px]">{k}</dt><dd className="mt-1 text-lg">{v || "Não informado"}</dd></div>))}
          </dl>
          <ul className="grid grid-cols-3 gap-px border border-white/10 bg-white/10">
            {[["Dados", "/portal/dados", UserRound], ["Central", "/portal/central", LifeBuoy], ["Ajustes", "/portal/configuracoes", Settings2]].map(([l, h, I]) => {
              const Icon = I as typeof UserRound;
              return (<li key={h as string} className="bg-ink"><Link href={h as string} className="flex flex-col items-center gap-2 py-5 text-xs text-steel transition hover:bg-white/5 hover:text-white active:scale-95"><Icon size={20} />{l as string}</Link></li>);
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
