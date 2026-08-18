import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getArticleBySlug } from "@/lib/articles";
import { prisma } from "@/lib/prisma";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ categorySlug: string; articleSlug: string }>;
}) {
  const { categorySlug, articleSlug } = await params;

  const [article, session] = await Promise.all([
    getArticleBySlug(categorySlug, articleSlug),
    auth(),
  ]);
  if (!article) notFound();

  await prisma.article.update({
    where: { id: article.id },
    data: { viewCount: { increment: 1 } },
  });

  const canManageContent = session?.user.role === "EDITOR" || session?.user.role === "ADMIN";

  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href={`/${article.category.slug}`}
          className="inline-block text-xs font-bold uppercase tracking-widest text-taking-orange"
        >
          {article.category.name}
        </Link>
        {canManageContent && <DeleteArticleButton articleId={article.id} />}
      </div>
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

      {article.attachmentUrl && (
        <a
          href={article.attachmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-taking-gray-border px-4 py-2.5 text-sm font-bold text-taking-black transition-colors hover:border-taking-orange"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v12" />
            <path d="M7 10l5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          Baixar PDF{article.attachmentName ? `: ${article.attachmentName}` : ""}
        </a>
      )}
    </article>
  );
}
