import type { NextAuthConfig } from "next-auth";

/**
 * Config compartilhada entre o middleware (Edge runtime) e o auth.ts completo
 * (Node runtime). Fica sem providers aqui de propósito — Credentials usa
 * bcrypt + Prisma/pg, que não rodam no Edge, então só entram em auth.ts.
 */
export const authConfig = {
  session: {
    strategy: "jwt",
    // Padrão do NextAuth é 30 dias; para uma ferramenta interna de
    // admin, 7 dias reduz a janela de exposição de uma sessão roubada
    // ou de um usuário desativado que ainda tenha um token válido.
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.companyId = user.companyId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as "VIEWER" | "EDITOR" | "ADMIN";
        session.user.companyId = (token.companyId as string | null | undefined) ?? null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
