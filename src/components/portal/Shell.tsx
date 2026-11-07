"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Contact, LayoutGrid, LifeBuoy, LogOut, Settings2, ShieldAlert, UserRound } from "lucide-react";
import { Logo } from "../Logo";
import { Avatar } from "./Avatar";
import { usePortal } from "./Providers";

const NAV = [
  { href: "/portal", label: "Painel", short: "Painel", icon: LayoutGrid },
  { href: "/portal/carteirinha", label: "Minha Carteirinha", short: "Carteirinha", icon: Contact },
  { href: "/portal/dados", label: "Dados cadastrais", short: "Dados", icon: UserRound },
  { href: "/portal/central", label: "Central de informações", short: "Central", icon: LifeBuoy },
  { href: "/portal/configuracoes", label: "Configurações", short: "Ajustes", icon: Settings2 },
];
const isActive = (p: string, h: string) => (h === "/portal" ? p === h : p.startsWith(h));

function ProfileMenu() {
  const { student, students, setActiveId } = usePortal();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", on);
    return () => document.removeEventListener("mousedown", on);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-haspopup="menu" className="flex items-center gap-3 py-1 pl-1 pr-2 transition hover:bg-white/5">
        <Avatar student={student} size={36} />
        <span className="hidden text-left sm:block"><span className="block max-w-[180px] truncate text-sm font-medium">{student?.name ?? "—"}</span><span className="eyebrow block text-[10px]">Estudante</span></span>
        <ChevronDown size={16} className={`text-steel transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div role="menu" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 top-full z-50 mt-2 w-72 border border-white/15 bg-navy shadow-2xl">
            <p className="eyebrow border-b border-white/10 px-4 py-3">Perfis demonstrativos</p>
            <ul className="max-h-56 overflow-auto">
              {students.map((s) => (
                <li key={s.id}><button onClick={() => { setActiveId(s.id); setOpen(false); }} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-white/5"><span className="truncate">{s.name}</span>{s.id === student?.id && <Check size={15} className="shrink-0 text-brand-soft" />}</button></li>
              ))}
            </ul>
            <div className="border-t border-white/10">
              <Link href="/portal/configuracoes" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5"><Settings2 size={15} />Configurações do perfil</Link>
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5"><LogOut size={15} />Voltar ao site</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { student, loading, error, refresh } = usePortal();
  const current = NAV.find((n) => isActive(pathname, n.href));

  return (
    <div className="min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-navy/40 lg:flex">
        <Link href="/" className="flex h-16 items-center border-b border-white/10 px-6" aria-label="INIA — site"><Logo /></Link>
        <nav className="flex-1 space-y-1 p-3" aria-label="Portal">
          {NAV.map(({ href, label, icon: Icon }) => {
            const on = isActive(pathname, href);
            return (
              <Link key={href} href={href} aria-current={on ? "page" : undefined} className={`relative flex items-center gap-3 px-3 py-3 text-sm transition ${on ? "text-white" : "text-steel hover:bg-white/5 hover:text-white"}`}>
                {on && <motion.span layoutId="nav-active" className="absolute inset-0 border-l-2 border-brand bg-brand/10" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                <Icon size={17} className="relative" /><span className="relative">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="m-3 border border-white/10 p-4 text-xs leading-relaxed text-steel"><ShieldAlert size={15} className="mb-2 text-brand-soft" />Plataforma independente e demonstrativa. Sem validade oficial.</div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-ink/85 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl sm:px-6 lg:px-10">
          <Link href="/" className="lg:hidden" aria-label="INIA — site"><Logo /></Link>
          <p className="eyebrow hidden lg:block">{current?.label ?? "Portal"}</p>
          <ProfileMenu />
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-32 pt-8 sm:px-6 lg:px-10 lg:pb-16 lg:pt-12">
          {loading ? (
            <div className="space-y-4" aria-busy="true"><div className="h-10 w-2/3 animate-pulse bg-white/5" /><div className="h-64 animate-pulse bg-white/5" /></div>
          ) : error || !student ? (
            <div className="panel p-8 text-center"><p>{error ?? "Nenhum perfil encontrado."}</p><button className="btn-primary mt-5" onClick={refresh}>Tentar novamente</button></div>
          ) : children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-white/10 bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden" aria-label="Portal">
        {NAV.map(({ href, short, icon: Icon }) => {
          const on = isActive(pathname, href);
          return (
            <Link key={href} href={href} aria-current={on ? "page" : undefined} className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] transition active:scale-95 ${on ? "text-white" : "text-steel"}`}>
              {on && <motion.span layoutId="tab-active" className="absolute inset-x-4 top-0 h-0.5 bg-brand" />}
              <Icon size={20} />{short}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
