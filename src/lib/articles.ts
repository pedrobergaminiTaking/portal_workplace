import { prisma } from "@/lib/prisma";

export async function getMostAccessedArticles(limit = 3) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: { category: { select: { slug: true, name: true } } },
    orderBy: { viewCount: "desc" },
    take: limit,
  });
}

export async function getArticlesByCategory(categorySlug: string) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", category: { slug: categorySlug } },
    include: { category: { select: { slug: true, name: true, layout: true } } },
    orderBy: [{ highlighted: "desc" }, { publishedAt: "desc" }],
  });
}

export async function getArticleBySlug(categorySlug: string, articleSlug: string) {
  return prisma.article.findFirst({
    where: {
      slug: articleSlug,
      status: "PUBLISHED",
      category: { slug: categorySlug },
    },
    include: { category: { select: { slug: true, name: true } } },
  });
}

export async function getAllPublishedArticlesForSearch() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: { category: { select: { slug: true, name: true } } },
    orderBy: { publishedAt: "desc" },
  });

  return articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt ?? "",
    categorySlug: article.category.slug,
    categoryName: article.category.name,
  }));
}
