import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import { isRateLimited, recordFailedAttempt, clearAttempts } from "@/lib/login-rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        if (isRateLimited(email)) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive || !user.passwordHash) {
          recordFailedAttempt(email);
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          recordFailedAttempt(email);
          return null;
        }

        clearAttempts(email);
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
    // Microsoft Entra ID (SSO para EDITOR/ADMIN) entra aqui na Fase 2,
    // assim que o app OAuth for registrado pelo time de TI da Taking.
  ],
});
