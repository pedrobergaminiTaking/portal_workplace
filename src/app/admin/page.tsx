import Link from "next/link";
import { getAllArticlesForAdmin } from "@/lib/articles";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";
import { EditArticleLink } from "@/components/admin/EditArticleLink";

export default async function AdminDashboardPage() {
  const articles = await getAllArticlesForAdmin();

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
                {article.companies.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {article.companies.map(({ company }) => (
                      <span
                        key={company.name}
                        className="rounded-full bg-taking-gray px-2 py-0.5 text-[11px] font-bold text-taking-text-muted"
                      >
                        {company.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <EditArticleLink articleId={article.id} />
                <DeleteArticleButton articleId={article.id} redirectTo="/admin" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
