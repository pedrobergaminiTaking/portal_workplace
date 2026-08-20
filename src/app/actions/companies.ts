"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { requireManager } from "@/lib/admin-auth";
import { UserFacingError } from "@/lib/errors";

export type CompanyActionState = { error?: string };

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

    await prisma.company.create({ data: { name, slug: slugify(name) } });

    revalidatePath("/admin/empresas");
    return {};
  } catch (error) {
    if (error instanceof UserFacingError) {
      return { error: error.message };
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Já existe uma empresa com esse nome." };
    }
    console.error("createCompanyAction failed:", error);
    return { error: "Não foi possível salvar a empresa. Tente novamente." };
  }
}

export async function deleteCompanyAction(formData: FormData) {
  await requireManager();

  const companyId = formData.get("companyId") as string;
  await prisma.company.delete({ where: { id: companyId } });

  revalidatePath("/admin/empresas");
}
