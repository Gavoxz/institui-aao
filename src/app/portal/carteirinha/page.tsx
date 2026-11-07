"use client";
import { CardManager } from "@/components/portal/CardManager";
import { usePortal } from "@/components/portal/Providers";

export default function CarteirinhaPage() {
  const { student } = usePortal();
  if (!student) return null;
  return (
    <>
      <p className="eyebrow">Módulo 02</p>
      <h1 className="mb-8 mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Minha Carteirinha</h1>
      <CardManager key={student.id} student={student} />
    </>
  );
}
