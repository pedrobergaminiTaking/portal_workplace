import { prisma } from "@/lib/prisma";

export async function getCompanies() {
  return prisma.company.findMany({
    orderBy: { name: "asc" },
  });
}
