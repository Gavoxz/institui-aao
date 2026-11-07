# INIA — Instituto Nacional de Identificação Acadêmica

Projeto **fictício, independente e demonstrativo**: site institucional + portal do estudante para enviar, exibir e imprimir uma carteirinha estudantil **já existente**. Não emite, valida nem simula reconhecimento de documentos. O arquivo enviado nunca é modificado.

**Stack:** Next.js 14 (App Router) · React · TypeScript · Tailwind CSS · Framer Motion · Lucide · Zod. Front e API no mesmo projeto (rotas `/api`).

## Rodar localmente
```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # checagem de tipos
npm run build && npm start
```
Rotas: `/` (site) e `/portal` (Painel, `/carteirinha`, `/dados`, `/central`, `/configuracoes`).

## Estrutura
```
data/students.seed.json     perfil demonstrativo inicial (Livia Vitória Cavalcanti Maia)
storage/seed/livia.jpeg     carteirinha original (fora de /public, servida só pela API)
src/app/api/students/...    GET/POST estudantes · GET/PATCH [id] · GET/POST/DELETE [id]/card
src/lib/storage.ts          interface StorageDriver + driver local
src/lib/students.ts         repositório (JSON) com fila de escrita
src/lib/validation.ts       Zod, limite de 4 MB e verificação dos bytes (PNG/JPEG)
src/components/site|portal  site institucional e portal
middleware.ts               Basic Auth opcional
```

## API
| Método | Rota | Função |
|---|---|---|
| GET / POST | `/api/students` | listar / criar perfil |
| GET / PATCH | `/api/students/:id` | ler / editar perfil |
| GET | `/api/students/:id/card` | entrega o arquivo original |
| POST | `/api/students/:id/card` | upload (`multipart`, campo `file`) |
| DELETE | `/api/students/:id/card` | remove o arquivo |

Cada estudante tem sua própria chave de armazenamento (`<id>/card-<timestamp>.png|jpg`); a chave interna nunca é exposta.

## Deploy na Vercel
1. Suba o repositório no GitHub e importe na Vercel (preset Next.js, sem configuração extra).
2. **Armazenamento:** na Vercel o disco é efêmero (`/tmp`), então uploads e perfis criados **não persistem** entre execuções. Para persistir, implemente `StorageDriver` com Vercel Blob/S3/R2 (3 métodos) e troque o export em `src/lib/storage.ts`; troque também o repositório JSON por um banco (Postgres/KV). A carteirinha de demonstração continua disponível porque vem do repositório.
3. Funções da Vercel aceitam corpo de ~4,5 MB; por isso o limite de 4 MB. Para arquivos maiores, use upload direto ao Blob/S3 com URL assinada.

## Privacidade — leia antes de publicar
A carteirinha de demonstração contém foto, número de identificação, CIN e data de nascimento de uma estudante que é menor de idade. Antes de publicar:
- Ative **Deployment Protection / Password Protection** da Vercel **ou** defina a variável `PORTAL_BASIC_AUTH=usuario:senha` (protege `/portal` e `/api`).
- A imagem fica em `storage/seed` (não é pública) e todas as páginas têm `noindex`. Se o repositório for público, remova a imagem do Git e use outro arquivo de demonstração.

## Variáveis de ambiente (opcionais)
`PORTAL_BASIC_AUTH` · `INIA_STORAGE_DIR` (pasta de dados local; padrão `.data/`).
Para restaurar o estado inicial local, apague a pasta `.data/`.
