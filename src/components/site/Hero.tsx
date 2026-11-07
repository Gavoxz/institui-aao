"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";

const ROWS = [
  ["ARQUIVO", "PNG · JPG · JPEG"],
  ["VÍNCULO", "1 estudante : 1 carteirinha"],
  ["INTEGRIDADE", "arquivo preservado, sem edição"],
  ["STATUS", "modelo demonstrativo"],
];

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (d: number) => ({ initial: reduce ? false : { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] as const } });
  return (
    <section className="bg-grid relative overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-24 pt-16 md:px-8 md:pt-24 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pb-32">
        <div>
          <motion.p {...fade(0)} className="eyebrow">Instituto Nacional de Identificação Acadêmica</motion.p>
          <motion.h1 {...fade(0.08)} className="mt-6 text-[2.6rem] font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            A identidade acadêmica, <span className="text-brand-soft">organizada</span> com precisão.
          </motion.h1>
          <motion.p {...fade(0.16)} className="mt-7 max-w-xl text-lg leading-relaxed text-steel">
            Uma plataforma para guardar, exibir e imprimir a carteirinha estudantil que você já tem — sem alterar um pixel do arquivo original.
          </motion.p>
          <motion.div {...fade(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/portal" className="btn-primary h-12 px-6">Acessar o portal <ArrowRight size={16} /></Link>
            <a href="#plataforma" className="btn-ghost h-12 px-6">Conhecer a plataforma</a>
          </motion.div>
          <motion.p {...fade(0.32)} className="mt-8 inline-flex items-center gap-2 border border-white/10 px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-steel">
            <Lock size={12} /> Projeto fictício · independente · sem validade oficial
          </motion.p>
        </div>

        <motion.div {...fade(0.2)} className="relative mx-auto w-full max-w-md" aria-hidden="true">
          <div className="absolute -inset-px translate-x-5 translate-y-5 border border-brand/30" />
          <div className="absolute -inset-px translate-x-2.5 translate-y-2.5 border border-white/10 bg-navy-2/40" />
          <div className="relative overflow-hidden border border-white/15 bg-navy p-6">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Cofre do estudante</span>
              <span className="h-2 w-2 rounded-full bg-brand" />
            </div>
            <div className="relative mt-6 aspect-[1179/750] border border-dashed border-white/25">
              {["left-0 top-0", "right-0 top-0", "left-0 bottom-0", "right-0 bottom-0"].map((p) => (
                <span key={p} className={`absolute h-3 w-3 border-brand ${p} ${p.includes("left") ? "border-l-2" : "border-r-2"} ${p.includes("top") ? "border-t-2" : "border-b-2"}`} />
              ))}
              <div className="absolute inset-0 grid place-items-center font-mono text-[11px] uppercase tracking-[0.2em] text-steel">arquivo original</div>
              {!reduce && (
                <motion.span className="absolute inset-x-0 h-px bg-brand shadow-[0_0_18px_2px_#2E6BFF]" initial={{ top: "0%" }} animate={{ top: "100%" }} transition={{ duration: 3.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} />
              )}
            </div>
            <dl className="mt-6 divide-y divide-white/10 font-mono text-[11px] uppercase tracking-wider">
              {ROWS.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-steel">{k}</dt><dd className="text-right">{v}</dd></div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
