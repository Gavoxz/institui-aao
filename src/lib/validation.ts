import { z } from "zod";

export const MAX_CARD_BYTES = 4 * 1024 * 1024; // limite de corpo das funções da Vercel é ~4,5 MB

export const idSchema = z.string().regex(/^[a-z0-9-]{3,80}$/);

export const createStudentSchema = z.object({
  name: z.string().trim().min(3, "Informe o nome completo").max(120, "Nome muito longo"),
});

export const updateStudentSchema = z
  .object({
    name: z.string().trim().min(3, "Informe o nome completo").max(120).optional(),
    institution: z.string().trim().max(120).optional(),
    grade: z.string().trim().max(60).optional(),
    shift: z.string().trim().max(30).optional(),
    state: z.string().trim().max(40).optional(),
  })
  .strict();

/** Confere os bytes do arquivo (não confia apenas na extensão ou no MIME enviado). */
export function sniffImage(buf: Buffer): "image/png" | "image/jpeg" | null {
  const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buf.length > 8 && buf.subarray(0, 8).equals(png)) return "image/png";
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  return null;
}

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
