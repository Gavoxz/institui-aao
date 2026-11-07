import { promises as fs } from "fs";
import path from "path";

/** Raiz de dados de execução. Na Vercel o disco é efêmero (/tmp): use um driver de nuvem em produção. */
export const DATA_ROOT =
  process.env.INIA_STORAGE_DIR ||
  (process.env.VERCEL ? "/tmp/inia" : path.join(process.cwd(), ".data"));

const UPLOADS = path.join(DATA_ROOT, "uploads");
const SEED = path.join(process.cwd(), "storage", "seed");

/**
 * Contrato de armazenamento. Para migrar para nuvem (Vercel Blob, S3, R2...),
 * implemente esta interface e troque o export `storage` abaixo.
 */
export interface StorageDriver {
  put(key: string, data: Buffer): Promise<void>;
  get(key: string): Promise<Buffer | null>;
  remove(key: string): Promise<void>;
}

function resolveKey(key: string) {
  const isSeed = key.startsWith("seed/");
  const base = path.resolve(isSeed ? SEED : UPLOADS);
  const full = path.resolve(base, isSeed ? key.slice(5) : key);
  if (!full.startsWith(base + path.sep)) throw new Error("Chave de armazenamento inválida");
  return { full, isSeed };
}

class LocalStorageDriver implements StorageDriver {
  async put(key: string, data: Buffer) {
    const { full, isSeed } = resolveKey(key);
    if (isSeed) throw new Error("Área de demonstração é somente leitura");
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, data);
  }
  async get(key: string) {
    try {
      return await fs.readFile(resolveKey(key).full);
    } catch {
      return null;
    }
  }
  async remove(key: string) {
    const { full, isSeed } = resolveKey(key);
    if (isSeed) return;
    await fs.rm(full, { force: true });
  }
}

export const storage: StorageDriver = new LocalStorageDriver();
