/* eslint-disable @next/next/no-img-element */
import type { PublicStudent } from "@/lib/types";
import { cardUrl } from "./Providers";

/** Exibe a foto da própria carteirinha por recorte CSS — o arquivo original não é alterado. */
export function Avatar({ student, size = 40, variant = "square" }: { student: PublicStudent | null; size?: number; variant?: "square" | "portrait" }) {
  const src = student ? cardUrl(student) : null;
  const base = student?.photoCrop;
  if (student && src && base) {
    const c = variant === "square" ? { ...base, y: base.y + base.h * 0.1, h: base.w } : base;
    return (
      <div className="relative shrink-0 overflow-hidden bg-graphite" style={{ width: size, height: (size * c.h) / c.w }}>
        <img src={src} alt="" className="absolute max-w-none" draggable={false}
          style={{ width: `${(c.iw / c.w) * 100}%`, left: `${(-c.x / c.w) * 100}%`, top: `${(-c.y / c.h) * 100}%` }} />
      </div>
    );
  }
  const initials = (student?.name ?? "?").split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return (
    <div className="grid shrink-0 place-items-center bg-graphite-2 font-mono text-sm text-steel" style={{ width: size, height: variant === "portrait" ? size * 1.33 : size }}>{initials}</div>
  );
}
