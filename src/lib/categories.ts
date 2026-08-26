import { cache } from "react";
import { prisma } from "@/lib/prisma";

// cache() deduplica dentro do mesmo request: Header e a home chamam essa
// função de forma independente, mas devem compartilhar uma única query.
export const getNavCategories = cache(async () => {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, name: true },
  });
});

export async function getCategoriesForSelect() {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { id: true, name: true },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}
