import { NextResponse } from "next/server";
import { createStudent, listStudents, toPublic } from "@/lib/students";
import { createStudentSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ students: await listStudents() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createStudentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos" }, { status: 400 });
  }
  const student = await createStudent(parsed.data.name);
  return NextResponse.json({ student: toPublic(student) }, { status: 201 });
}
