import Link from "next/link";
import { Logo } from "../Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-steel">Instituto Nacional de Identificação Acadêmica. Projeto fictício e independente para demonstração de portal estudantil.</p>
        </div>
        <div><p className="eyebrow">Site</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[["Instituição", "#instituicao"], ["Serviços", "#servicos"], ["Identificação digital", "#identificacao"], ["Plataforma", "#plataforma"]].map(([l, h]) => (<li key={h}><a className="text-steel hover:text-white" href={h}>{l}</a></li>))}
          </ul></div>
        <div><p className="eyebrow">Portal</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[["Painel", "/portal"], ["Minha Carteirinha", "/portal/carteirinha"], ["Central de informações", "/portal/central"]].map(([l, h]) => (<li key={h}><Link className="text-steel hover:text-white" href={h}>{l}</Link></li>))}
          </ul></div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-5 py-6 text-xs leading-relaxed text-steel md:px-8">© 2026 INIA — projeto demonstrativo. Sem validade oficial. Não emite, autentica ou reconhece documentos estudantis e não possui vínculo com órgãos governamentais ou instituições de ensino.</p>
      </div>
    </footer>
  );
}
