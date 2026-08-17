import { prisma } from "@/lib/prisma";

export async function getNavCategories() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, name: true },
  });
}
