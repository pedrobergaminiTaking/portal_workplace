import Link from "next/link";
import { RingsPattern } from "@/components/brand/RingsPattern";
import { CategoryIcon } from "@/components/brand/CategoryIcon";
import { FeaturedCarousel } from "@/components/content/FeaturedCarousel";
import { getMostAccessedArticles } from "@/lib/articles";
import { getNavCategories } from "@/lib/categories";

export default async function HomePage() {
  const [mostAccessed, categories] = await Promise.all([
    getMostAccessedArticles(3),
    getNavCategories(),
  ]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <RingsPattern variant="hero" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-center px-6 py-24">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-taking-orange">
            Portal de conhecimento
          </p>
          <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-tight text-taking-white">
            Take over your knowledge.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-taking-black">Mais acessados</h2>
        </div>
        {mostAccessed.length > 0 ? (
          <div className="overflow-hidden rounded-xl">
            <FeaturedCarousel
              articles={mostAccessed.map((article) => ({
                id: article.id,
                categorySlug: article.category.slug,
                categoryName: article.category.name,
                slug: article.slug,
                title: article.title,
                excerpt: article.excerpt,
                readingTimeMinutes: article.readingTimeMinutes,
              }))}
            />
          </div>
        ) : (
          <p className="text-sm text-taking-text-muted">Nenhum artigo em destaque ainda.</p>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-6 text-lg font-bold text-taking-black">Categorias</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="rounded-lg border border-taking-gray-border bg-taking-white p-5 transition-colors hover:border-taking-orange"
            >
              <div
                className={`mb-3 flex h-8 w-8 items-center justify-center rounded-md ${index % 2 === 0 ? "bg-taking-black" : "bg-taking-orange"}`}
              >
                <CategoryIcon slug={category.slug} className="h-5 w-5 text-taking-white" />
              </div>
              <span className="font-bold text-taking-black">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
