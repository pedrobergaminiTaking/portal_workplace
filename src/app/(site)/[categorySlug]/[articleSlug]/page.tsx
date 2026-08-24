import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getArticleBySlug } from "@/lib/articles";
import { prisma } from "@/lib/prisma";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";
import { EditArticleLink } from "@/components/admin/EditArticleLink";
import { BackLink } from "@/components/ui/BackLink";
import { DownloadPdfButton } from "@/components/content/DownloadPdfButton";

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
      <BackLink
        href={`/${article.category.slug}`}
        label={`Voltar para ${article.category.name}`}
        className="mb-4"
      />
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href={`/${article.category.slug}`}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-taking-orange"
        >
          <span className="h-px w-4 bg-taking-orange" aria-hidden="true" />
          {article.category.name}
        </Link>
        {canManageContent && (
          <div className="flex items-center gap-4">
            <EditArticleLink articleId={article.id} />
            <DeleteArticleButton articleId={article.id} redirectTo={`/${article.category.slug}`} />
          </div>
        )}
      </div>
      <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-taking-black">
        {article.title}
      </h1>
      {article.readingTimeMinutes != null && (
        <p className="mb-8 text-sm text-taking-text-faint">
          {article.readingTimeMinutes} min de leitura
        </p>
      )}
      <div className="animate-fade-in-up whitespace-pre-line text-[15px] leading-relaxed text-taking-text-body">
        {article.content}
      </div>

      {article.attachmentUrl && (
        <div className="mt-10 border-t border-taking-gray-border pt-6">
          <DownloadPdfButton articleId={article.id} attachmentName={article.attachmentName} />
        </div>
      )}
    </article>
  );
}
