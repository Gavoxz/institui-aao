export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}
export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "medium", timeStyle: "short" });
}
