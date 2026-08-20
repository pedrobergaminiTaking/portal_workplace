import { getCategoriesForSelect } from "@/lib/categories";
import { getCompanies } from "@/lib/companies";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { BackLink } from "@/components/ui/BackLink";

export default async function NovoArtigoPage() {
  const [categories, companies] = await Promise.all([getCategoriesForSelect(), getCompanies()]);

  return (
    <div className="max-w-lg">
      <BackLink href="/admin" label="Voltar à lista" className="mb-6" />
      <h1 className="mb-1 text-xl font-bold text-taking-black">Novo conteúdo</h1>
      <p className="mb-6 text-sm text-taking-text-muted">
        Preencha os campos abaixo para publicar um novo artigo no portal.
      </p>
      <ArticleForm categories={categories} companies={companies} />
    </div>
  );
}
