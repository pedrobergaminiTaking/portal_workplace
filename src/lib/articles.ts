import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildCompanyVisibilityWhere } from "@/lib/visibility";

export async function getMostAccessedArticles(limit = 3) {
  const session = await auth();
  const visibilityWhere = buildCompanyVisibilityWhere(session);

  return prisma.article.findMany({
    where: { status: "PUBLISHED", ...visibilityWhere },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      readingTimeMinutes: true,
      category: { select: { slug: true, name: true } },
    },
    orderBy: { viewCount: "desc" },
    take: limit,
  });
}

// A página de categoria já busca a categoria (nome/slug/layout) separadamente,
// então o include aqui só duplicaria essa mesma consulta por linha de artigo.
export async function getArticlesByCategory(categorySlug: string) {
  const session = await auth();
  const visibilityWhere = buildCompanyVisibilityWhere(session);

  return prisma.article.findMany({
    where: { status: "PUBLISHED", category: { slug: categorySlug }, ...visibilityWhere },
    orderBy: [{ highlighted: "desc" }, { publishedAt: "desc" }],
  });
}

export async function incrementArticleViewCount(articleId: string) {
  await prisma.article.update({
    where: { id: articleId },
    data: { viewCount: { increment: 1 } },
  });
}

export async function getArticleById(articleId: string) {
  return prisma.article.findUnique({
    where: { id: articleId },
    include: { companies: true },
  });
}

export async function getAllArticlesForAdmin() {
  return prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      category: { select: { name: true, slug: true } },
      companies: { include: { company: { select: { name: true } } } },
    },
  });
}

export async function getArticleBySlug(categorySlug: string, articleSlug: string) {
  const session = await auth();
  const visibilityWhere = buildCompanyVisibilityWhere(session);

  return prisma.article.findFirst({
    where: {
      slug: articleSlug,
      status: "PUBLISHED",
      category: { slug: categorySlug },
      ...visibilityWhere,
    },
    include: { category: { select: { slug: true, name: true } } },
  });
}

export async function getAllPublishedArticlesForSearch() {
  const session = await auth();
  const visibilityWhere = buildCompanyVisibilityWhere(session);

  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", ...visibilityWhere },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      category: { select: { slug: true, name: true } },
    },
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
