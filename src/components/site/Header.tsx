"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "../Logo";

const NAV = [
  ["Instituição", "#instituicao"],
  ["Serviços", "#servicos"],
  ["Identificação digital", "#identificacao"],
  ["Plataforma", "#plataforma"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${scrolled || open ? "border-b border-white/10 bg-ink/85 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="INIA — início"><Logo /></Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className="text-sm text-steel transition hover:text-white">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/portal" className="btn-primary hidden h-10 md:inline-flex">Acessar portal <ArrowUpRight size={16} /></Link>
          <button className="grid h-10 w-10 place-items-center border border-white/15 md:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden md:hidden" aria-label="Mobile">
            <div className="flex flex-col px-5 pb-6 pt-2">
              {NAV.map(([label, href]) => (
                <a key={href} href={href} onClick={() => setOpen(false)} className="border-b border-white/10 py-4 text-lg">{label}</a>
              ))}
              <Link href="/portal" className="btn-primary mt-5">Acessar portal <ArrowUpRight size={16} /></Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
