import { prisma } from "@/lib/prisma";

export async function getNavCategories() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, name: true },
  });
}

export async function getCategoriesForSelect() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });
}
