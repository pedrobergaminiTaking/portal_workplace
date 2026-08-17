import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/articles";
import { prisma } from "@/lib/prisma";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ categorySlug: string; articleSlug: string }>;
}) {
  const { categorySlug, articleSlug } = await params;

  const article = await getArticleBySlug(categorySlug, articleSlug);
  if (!article) notFound();

  await prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  });

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href={`/${article.category.slug}`}
        className="mb-6 inline-block text-xs font-bold uppercase tracking-widest text-taking-orange"
      >
        {article.category.name}
      </Link>
      <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-taking-black">
        {article.title}
      </h1>
      {article.readingTimeMinutes != null && (
        <p className="mb-8 text-sm text-taking-text-faint">
          {article.readingTimeMinutes} min de leitura
        </p>
      )}
      <div className="whitespace-pre-line text-[15px] leading-relaxed text-taking-text-body">
        {article.content}
      </div>
    </article>
  );
}
