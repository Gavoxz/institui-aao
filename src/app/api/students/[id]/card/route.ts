import { NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { getStudent, setCard, toPublic } from "@/lib/students";
import { idSchema, MAX_CARD_BYTES, sniffImage } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };
const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

/** Entrega o arquivo exatamente como foi armazenado (sem reprocessar). */
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return new NextResponse(null, { status: 400 });
  const s = await getStudent(id);
  if (!s?.card) return new NextResponse(null, { status: 404 });
  const buf = await storage.get(s.card.key);
  if (!buf) return new NextResponse(null, { status: 404 });
  return new NextResponse(buf as unknown as BodyInit, {
    headers: {
      "Content-Type": s.card.mime,
      "Content-Length": String(buf.length),
      "Content-Disposition": "inline",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function POST(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return bad("Identificador inválido");
  if (!(await getStudent(id))) return bad("Estudante não encontrado", 404);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return bad("Envio inválido");
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return bad("Nenhum arquivo enviado");
  if (file.size > MAX_CARD_BYTES) return bad("O arquivo excede 4 MB", 413);

  const buf = Buffer.from(await file.arrayBuffer());
  const mime = sniffImage(buf);
  if (!mime) return bad("Formato inválido. Envie PNG, JPG ou JPEG.", 415);

  const key = `${id}/card-${Date.now()}.${mime === "image/png" ? "png" : "jpg"}`;
  await storage.put(key, buf);
  const out = await setCard(id, {
    key,
    mime,
    bytes: buf.length,
    originalName: file.name.slice(0, 120),
    source: "upload",
    updatedAt: new Date().toISOString(),
  });
  if (!out) return bad("Estudante não encontrado", 404);
  if (out.previous) await storage.remove(out.previous.key);
  return NextResponse.json({ student: toPublic(out.student) });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) return bad("Identificador inválido");
  const out = await setCard(id, null);
  if (!out) return bad("Estudante não encontrado", 404);
  if (out.previous) await storage.remove(out.previous.key);
  return NextResponse.json({ student: toPublic(out.student) });
}
