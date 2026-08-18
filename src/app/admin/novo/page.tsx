import { getCategoriesForSelect } from "@/lib/categories";
import { ArticleForm } from "@/components/admin/ArticleForm";

export default async function NovoArtigoPage() {
  const categories = await getCategoriesForSelect();

  return (
    <div className="max-w-lg">
      <h1 className="mb-1 text-xl font-bold text-taking-black">Novo conteúdo</h1>
      <p className="mb-6 text-sm text-taking-text-muted">
        Preencha os campos abaixo para publicar um novo artigo no portal.
      </p>
      <ArticleForm categories={categories} />
    </div>
  );
}
