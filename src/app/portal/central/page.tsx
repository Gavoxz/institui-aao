"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

const FAQ = [
  ["O que é o INIA?", "Um projeto fictício, independente e demonstrativo: um portal para guardar, exibir e imprimir a imagem de uma carteirinha estudantil que o próprio estudante já possui."],
  ["A carteirinha enviada passa a ter validade oficial?", "Não. O INIA não emite, autentica, valida nem reconhece documentos. O envio apenas guarda o arquivo e o exibe no perfil."],
  ["Quais arquivos posso enviar?", "Imagens PNG, JPG ou JPEG de até 4 MB. O conteúdo do arquivo é conferido no servidor, não apenas a extensão."],
  ["O arquivo é modificado?", "Nunca. A imagem é armazenada e entregue exatamente como foi enviada, sem recorte, compressão ou filtro."],
  ["Como os arquivos são guardados?", "Cada estudante tem uma pasta própria, acessada somente pela API. Nesta versão o armazenamento é local de demonstração, com uma camada preparada para trocar por nuvem."],
  ["Posso ter mais de um perfil?", "Sim. Em Configurações é possível criar perfis demonstrativos independentes, cada um com a sua carteirinha."],
  ["Como imprimo?", "Em Minha Carteirinha, use Imprimir. A página de impressão contém apenas a imagem e o aviso demonstrativo."],
];

export default function CentralPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <p className="eyebrow">Módulo 04</p>
      <h1 className="mb-8 mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Central de informações</h1>
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {FAQ.map(([q, a], i) => (
          <li key={q}>
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg transition hover:text-brand-soft">
              {q}<Plus size={18} className={`shrink-0 transition ${open === i ? "rotate-45" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="max-w-2xl pb-6 leading-relaxed text-steel">{a}</p></motion.div>)}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </>
  );
}
