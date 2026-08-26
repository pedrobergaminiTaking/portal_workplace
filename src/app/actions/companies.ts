"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { requireManager } from "@/lib/admin-auth";
import { toActionError } from "@/lib/errors";

export type CompanyActionState = { error?: string };

// Formato básico de domínio (ex: davita.com, taking.com.br) — não valida
// existência real, só evita erros óbvios de digitação.
const DOMAIN_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/;

export async function createCompanyAction(
  _prevState: CompanyActionState,
  formData: FormData,
): Promise<CompanyActionState> {
  try {
    await requireManager();

    const name = (formData.get("name") as string)?.trim();
    if (!name) {
      return { error: "Nome da empresa é obrigatório." };
    }

    const domainInput = (formData.get("domain") as string)?.trim().toLowerCase();
    const domain = domainInput || null;
    if (domain && !DOMAIN_PATTERN.test(domain)) {
      return { error: "Domínio inválido. Use o formato empresa.com." };
    }

    await prisma.company.create({ data: { name, slug: slugify(name), domain } });

    revalidatePath("/admin/empresas");
    return {};
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = error.meta?.target;
      if (Array.isArray(target) && target.includes("domain")) {
        return { error: "Já existe uma empresa cadastrada com esse domínio." };
      }
      return { error: "Já existe uma empresa com esse nome." };
    }
    return toActionError(error, "Não foi possível salvar a empresa. Tente novamente.", "createCompanyAction");
  }
}

export async function deleteCompanyAction(formData: FormData) {
  await requireManager();

  const companyId = formData.get("companyId") as string;
  await prisma.company.delete({ where: { id: companyId } });

  revalidatePath("/admin/empresas");
}
