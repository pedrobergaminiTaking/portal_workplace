import type { NextAuthConfig } from "next-auth";

/**
 * Config compartilhada entre o middleware (Edge runtime) e o auth.ts completo
 * (Node runtime). Fica sem providers aqui de propósito — Credentials usa
 * bcrypt + Prisma/pg, que não rodam no Edge, então só entram em auth.ts.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as "VIEWER" | "EDITOR" | "ADMIN";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
