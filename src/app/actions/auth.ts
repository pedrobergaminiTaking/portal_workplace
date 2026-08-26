"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { toActionError } from "@/lib/errors";
import { isInternalEmail } from "@/lib/visibility";
import { isRateLimited, recordFailedAttempt, clearAttempts } from "@/lib/login-rate-limit";

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}

const MIN_PASSWORD_LENGTH = 8;

export type RegisterActionState = { error?: string };

export async function registerAction(
  _prevState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  try {
    const name = (formData.get("name") as string)?.trim();
    const emailInput = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    if (!name || !emailInput || !password) {
      return { error: "Nome, e-mail e senha são obrigatórios." };
    }

    const email = emailInput.toLowerCase();
    const domain = email.split("@")[1];
    if (!domain) {
      return { error: "Informe um e-mail válido." };
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return { error: `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.` };
    }

    // Mesmo limitador do login: evita cadastro em massa/abuso do formulário
    // público, sem inventar um mecanismo paralelo.
    if (isRateLimited(email)) {
      return { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let companyId: string | null = null;
    if (!isInternalEmail(email)) {
      const company = await prisma.company.upsert({
        where: { domain },
        create: { domain, name: domain, slug: slugify(domain) },
        update: {},
      });
      companyId = company.id;
    }

    await prisma.user.create({
      data: { name, email, passwordHash, role: "VIEWER", companyId },
    });

    clearAttempts(email);
    return {};
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const emailInput = (formData.get("email") as string)?.trim().toLowerCase();
      if (emailInput) recordFailedAttempt(emailInput);
      return { error: "Já existe uma conta com esse e-mail." };
    }
    return toActionError(error, "Não foi possível concluir o cadastro. Tente novamente.", "registerAction");
  }
}
