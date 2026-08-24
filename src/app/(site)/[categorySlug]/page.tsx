import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getArticlesByCategory } from "@/lib/articles";
import { ArticleCard } from "@/components/content/ArticleCard";
import { FaqAccordion } from "@/components/content/FaqAccordion";
import { BackLink } from "@/components/ui/BackLink";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;

  const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) notFound();

  const articles = await getArticlesByCategory(categorySlug);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <BackLink href="/" label="Início" className="mb-6" />
      <div className="animate-fade-in-up mb-10">
        <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-taking-orange">
          <span className="h-px w-6 bg-taking-orange" aria-hidden="true" />
          Categoria
        </p>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-taking-black">
          {category.name}
        </h1>
        {category.description && (
          <p className="max-w-2xl text-sm text-taking-text-muted">{category.description}</p>
        )}
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-taking-text-muted">Nenhum artigo publicado ainda.</p>
      ) : category.layout === "FAQ" ? (
        <div className="animate-fade-in-up">
          <FaqAccordion
            items={articles.map((article) => ({
              slug: article.slug,
              title: article.title,
              content: article.content,
            }))}
          />
        </div>
      ) : (
        <div className="animate-fade-in-up grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              categorySlug={category.slug}
              categoryName={category.name}
              slug={article.slug}
              title={article.title}
              readingTimeMinutes={article.readingTimeMinutes}
              highlighted={article.highlighted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
