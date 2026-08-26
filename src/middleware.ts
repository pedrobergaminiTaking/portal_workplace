import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { isManagerRole } from "@/lib/roles";

const { auth } = NextAuth(authConfig);

// Únicas rotas que não exigem login: home institucional e as telas de
// autenticação. Todo o resto (categorias, artigos, busca, anexos) passa a
// exigir sessão — o portal deixou de ser 100% público.
const PUBLIC_PATHS = ["/login", "/cadastro"];

function isPublicPath(pathname: string) {
  if (pathname === "/") return true;
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isManagerRole(req.auth.user.role)) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    return;
  }

  if (isPublicPath(pathname)) return;

  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  // Além de `_next/*`/`api/auth`, exclui qualquer caminho com extensão de
  // arquivo estático (imagens da marca em `/brand/**`, ícones, etc.) — a
  // otimização de imagem do Next.js (`next/image`) faz uma requisição
  // interna que passa pelo middleware inteiro, então sem essa exclusão o
  // próprio logo/texturas da home ficavam bloqueados para quem não está
  // logado.
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpe?g|gif|svg|webp|ico|css|js|map)$).*)",
  ],
};
