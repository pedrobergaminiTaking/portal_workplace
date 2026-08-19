import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";

export default async function AdminDashboardPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { name: true, slug: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="mb-1 text-xl font-bold text-taking-black">Conteúdo publicado</h1>
          <p className="text-sm text-taking-text-muted">
            {articles.length} {articles.length === 1 ? "artigo" : "artigos"} no portal.
          </p>
        </div>
        <Link
          href="/admin/novo"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-taking-orange px-4 py-2 text-sm font-bold text-taking-black transition-colors hover:brightness-95"
        >
          + Novo conteúdo
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="rounded-md border border-taking-gray-border bg-taking-gray px-4 py-6 text-center text-sm text-taking-text-muted">
          Nenhum conteúdo publicado ainda.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-taking-gray-border rounded-md border border-taking-gray-border">
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-taking-orange">
                  {article.category.name}
                </p>
                <Link
                  href={`/${article.category.slug}/${article.slug}`}
                  className="truncate font-bold text-taking-black hover:underline"
                >
                  {article.title}
                </Link>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <Link
                  href={`/admin/${article.id}/editar`}
                  className="text-xs font-bold uppercase tracking-widest text-taking-text-faint transition-colors hover:text-taking-orange"
                >
                  Editar
                </Link>
                <DeleteArticleButton articleId={article.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
