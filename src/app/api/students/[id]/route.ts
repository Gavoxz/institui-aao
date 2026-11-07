import { NextResponse } from "next/server";
import { getStudent, toPublic, updateStudent } from "@/lib/students";
import { idSchema, updateStudentSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return bad("Identificador inválido");
  const s = await getStudent(id);
  return s ? NextResponse.json({ student: toPublic(s) }) : bad("Estudante não encontrado", 404);
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return bad("Identificador inválido");
  const parsed = updateStudentSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return bad(parsed.error.issues[0]?.message ?? "Dados inválidos");
  const s = await updateStudent(id, parsed.data);
  return s ? NextResponse.json({ student: toPublic(s) }) : bad("Estudante não encontrado", 404);
}
