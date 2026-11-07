import { NextRequest, NextResponse } from "next/server";

/**
 * Proteção opcional por Basic Auth. Defina PORTAL_BASIC_AUTH="usuario:senha"
 * nas variáveis de ambiente para exigir login em /portal e /api.
 * Recomendado antes de publicar com dados reais.
 */
export function middleware(req: NextRequest) {
  const cred = process.env.PORTAL_BASIC_AUTH;
  if (!cred) return NextResponse.next();
  const header = req.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    try {
      if (atob(header.slice(6)) === cred) return NextResponse.next();
    } catch {}
  }
  return new NextResponse("Autenticação necessária", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="INIA demonstrativo"' },
  });
}

export const config = { matcher: ["/portal/:path*", "/api/:path*"] };
