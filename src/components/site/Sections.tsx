import Link from "next/link";
import { ArrowUpRight, Ban, Contact, FileCheck2, Layers, Printer, UploadCloud } from "lucide-react";
import { Reveal } from "./Reveal";

const STATS = [
  ["1 : 1", "estudante e arquivo"],
  ["PNG · JPG", "formatos aceitos"],
  ["0", "alterações no original"],
  ["100%", "demonstrativo"],
];

const SERVICES = [
  { icon: UploadCloud, t: "Envio de carteirinha", d: "Selecione ou arraste a imagem, confira a prévia e confirme. Substituir ou remover é imediato." },
  { icon: Contact, t: "Exibição preservada", d: "A imagem aparece no perfil com proporção e identidade visual originais, sem recortes ou filtros." },
  { icon: Printer, t: "Ampliação, tela cheia e impressão", d: "Visualização ampliada, modo imersivo e impressão — com versão adaptada para o celular." },
  { icon: Layers, t: "Perfis independentes", d: "Cada estudante tem pasta e vínculo próprios. Arquivos nunca se misturam entre perfis." },
];

const STEPS = ["Enviar o arquivo", "Conferir a prévia", "Confirmar o vínculo", "Exibir no portal"];
const NOT = ["Não emite carteirinhas", "Não valida documentos", "Não altera o arquivo enviado", "Não simula reconhecimento institucional"];
const MODULES = [
  ["Painel", "/portal"],
  ["Minha Carteirinha", "/portal/carteirinha"],
  ["Dados cadastrais", "/portal/dados"],
  ["Central de informações", "/portal/central"],
  ["Configurações", "/portal/configuracoes"],
];

export function Stats() {
  return (
    <div className="border-y border-white/10 bg-navy/40">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {STATS.map(([n, l], i) => (
          <div key={l} className={`px-5 py-8 md:px-8 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t md:border-t-0" : ""} ${i > 0 ? "md:border-l" : ""} border-white/10`}>
            <dt className="font-mono text-2xl font-medium sm:text-3xl">{n}</dt>
            <dd className="eyebrow mt-2">{l}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Institution() {
  return (
    <section id="instituicao" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <Reveal><p className="eyebrow">01 — Instituição</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">Uma instituição fictícia, construída com rigor real.</h2></Reveal>
        <Reveal delay={0.1} className="space-y-6 text-lg leading-relaxed text-steel">
          <p>O INIA é um projeto independente. Ele existe para demonstrar como um portal acadêmico pode tratar a identificação estudantil com clareza, organização e respeito ao documento original.</p>
          <p>Não somos uma autoridade educacional e não nos relacionamos com órgãos oficiais. O que fazemos é simples: receber a carteirinha que o estudante já possui e apresentá-la bem.</p>
          <ul className="grid gap-px border border-white/10 bg-white/10 text-white sm:grid-cols-3">
            {[["Preservação", "O arquivo nunca é editado."], ["Independência", "Sem vínculo oficial."], ["Clareza", "Aviso demonstrativo sempre visível."]].map(([t, d]) => (
              <li key={t} className="bg-ink p-5"><p className="font-medium">{t}</p><p className="mt-1 text-sm text-steel">{d}</p></li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="servicos" className="scroll-mt-20 border-t border-white/10 bg-navy/30">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <Reveal><p className="eyebrow">02 — Serviços demonstrativos</p>
          <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">Quatro funções. Todas funcionam de verdade.</h2></Reveal>
        <ol className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {SERVICES.map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 0.05}>
              <li className="grid items-start gap-4 py-8 md:grid-cols-[80px_1fr_1.2fr_40px] md:items-center md:gap-8">
                <span className="font-mono text-sm text-brand-soft">0{i + 1}</span>
                <h3 className="text-2xl font-medium tracking-tight">{t}</h3>
                <p className="text-steel">{d}</p>
                <Icon className="hidden text-white/40 md:block" size={22} />
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Identification() {
  return (
    <section id="identificacao" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
      <Reveal><p className="eyebrow">03 — Identificação acadêmica digital</p>
        <h2 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">Seu documento, do jeito que ele é.</h2></Reveal>
      <div className="mt-14 grid gap-px border border-white/10 bg-white/10 lg:grid-cols-2">
        <Reveal className="bg-ink p-8 md:p-10">
          <p className="eyebrow">Fluxo</p>
          <ol className="mt-6 space-y-5">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-5"><span className="grid h-9 w-9 place-items-center border border-brand font-mono text-sm text-brand-soft">{i + 1}</span><span className="text-xl">{s}</span></li>
            ))}
          </ol>
        </Reveal>
        <Reveal delay={0.08} className="bg-navy p-8 md:p-10">
          <p className="eyebrow">Limites declarados</p>
          <ul className="mt-6 space-y-4">
            {NOT.map((s) => (<li key={s} className="flex items-center gap-4 text-lg"><Ban size={18} className="shrink-0 text-steel" />{s}</li>))}
          </ul>
          <p className="mt-8 flex items-start gap-3 border-t border-white/10 pt-6 text-sm text-steel"><FileCheck2 size={18} className="mt-0.5 shrink-0" />O envio não representa emissão, reconhecimento ou validação oficial de documentos estudantis.</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Platform() {
  return (
    <section id="plataforma" className="scroll-mt-20 border-t border-white/10 bg-navy/30">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-[1fr_1fr]">
        <Reveal><p className="eyebrow">04 — Plataforma</p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">Um portal com cinco módulos.</h2>
          <p className="mt-6 max-w-md text-lg text-steel">No celular, a navegação vira uma barra de abas, como em um aplicativo. No desktop, um menu lateral.</p>
          <Link href="/portal" className="btn-primary mt-9 h-12 px-6">Entrar no portal demonstrativo <ArrowUpRight size={16} /></Link></Reveal>
        <Reveal delay={0.1}>
          <ul className="divide-y divide-white/10 border border-white/10">
            {MODULES.map(([t, href], i) => (
              <li key={href}><Link href={href} className="group flex items-center justify-between gap-4 px-6 py-5 transition hover:bg-white/5">
                <span className="flex items-center gap-5"><span className="font-mono text-xs text-steel">0{i + 1}</span><span className="text-lg">{t}</span></span>
                <ArrowUpRight size={18} className="text-steel transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </Link></li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
