import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCategoriesForSelect } from "@/lib/categories";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { BackLink } from "@/components/ui/BackLink";

export default async function EditarArtigoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [article, categories] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    getCategoriesForSelect(),
  ]);

  if (!article) notFound();

  return (
    <div className="max-w-lg">
      <BackLink href="/admin" label="Voltar à lista" className="mb-6" />
      <h1 className="mb-1 text-xl font-bold text-taking-black">Editar conteúdo</h1>
      <p className="mb-6 text-sm text-taking-text-muted">
        Altere os campos abaixo e salve para atualizar o artigo publicado.
      </p>
      <ArticleForm
        categories={categories}
        article={{
          id: article.id,
          categoryId: article.categoryId,
          title: article.title,
          content: article.content,
          attachmentName: article.attachmentName,
        }}
      />
    </div>
  );
}
