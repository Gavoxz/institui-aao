export type Crop = { x: number; y: number; w: number; h: number; iw: number; ih: number };

export type CardMeta = {
  key: string; // chave interna no storage (nunca exposta pela API)
  mime: "image/png" | "image/jpeg";
  bytes: number;
  originalName: string;
  source: "seed" | "upload";
  updatedAt: string;
};

export type Student = {
  id: string;
  name: string;
  idNumber?: string;
  cin?: string;
  birthDate?: string;
  state?: string;
  institution?: string;
  grade?: string;
  shift?: string;
  photoCrop?: Crop;
  card: CardMeta | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicStudent = Omit<Student, "card"> & {
  card: Omit<CardMeta, "key"> | null;
};
