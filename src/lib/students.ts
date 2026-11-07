import { promises as fs } from "fs";
import path from "path";
import seed from "../../data/students.seed.json";
import { DATA_ROOT } from "./storage";
import { slugify } from "./validation";
import type { CardMeta, PublicStudent, Student } from "./types";

const DB = path.join(DATA_ROOT, "students.json");
let queue: Promise<unknown> = Promise.resolve();

async function save(list: Student[]) {
  await fs.mkdir(path.dirname(DB), { recursive: true });
  await fs.writeFile(DB, JSON.stringify(list, null, 2));
}

async function load(): Promise<Student[]> {
  try {
    return JSON.parse(await fs.readFile(DB, "utf8")) as Student[];
  } catch {
    const initial = seed as unknown as Student[];
    await save(initial);
    return initial;
  }
}

/** Serializa leituras/escritas para evitar corrida entre requisições. */
function withDb<T>(fn: (list: Student[]) => Promise<{ list?: Student[]; result: T }>): Promise<T> {
  const run = queue.then(async () => {
    const list = await load();
    const out = await fn(list);
    if (out.list) await save(out.list);
    return out.result;
  });
  queue = run.catch(() => undefined);
  return run;
}

export const toPublic = (s: Student): PublicStudent => ({
  ...s,
  card: s.card
    ? { mime: s.card.mime, bytes: s.card.bytes, originalName: s.card.originalName, source: s.card.source, updatedAt: s.card.updatedAt }
    : null,
});

export const listStudents = () =>
  withDb<PublicStudent[]>(async (l) => ({ result: l.map(toPublic) }));

export const getStudent = (id: string) =>
  withDb<Student | null>(async (l) => ({ result: l.find((s) => s.id === id) ?? null }));

export const createStudent = (name: string) =>
  withDb<Student>(async (l) => {
    let base = slugify(name) || "estudante";
    if (base.length < 3) base += "-aluno";
    let id = base;
    let n = 2;
    while (l.some((s) => s.id === id)) id = `${base}-${n++}`;
    const now = new Date().toISOString();
    const s: Student = { id, name, card: null, createdAt: now, updatedAt: now };
    return { list: [...l, s], result: s };
  });

type Patch = Partial<Pick<Student, "name" | "institution" | "grade" | "shift" | "state">>;

export const updateStudent = (id: string, patch: Patch) =>
  withDb<Student | null>(async (l) => {
    const i = l.findIndex((s) => s.id === id);
    if (i < 0) return { result: null };
    const s: Student = { ...l[i], ...patch, updatedAt: new Date().toISOString() };
    const next = [...l];
    next[i] = s;
    return { list: next, result: s };
  });

/** Vincula (ou remove) a carteirinha. O recorte de foto só vale para a imagem de demonstração. */
export const setCard = (id: string, card: CardMeta | null) =>
  withDb<{ student: Student; previous: CardMeta | null } | null>(async (l) => {
    const i = l.findIndex((s) => s.id === id);
    if (i < 0) return { result: null };
    const previous = l[i].card;
    const s: Student = { ...l[i], card, photoCrop: undefined, updatedAt: new Date().toISOString() };
    const next = [...l];
    next[i] = s;
    return { list: next, result: { student: s, previous } };
  });
