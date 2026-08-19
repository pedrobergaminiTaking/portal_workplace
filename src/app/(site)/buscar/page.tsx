import { getAllPublishedArticlesForSearch } from "@/lib/articles";
import { SearchClient } from "@/components/content/SearchClient";
import { BackLink } from "@/components/ui/BackLink";

export default async function SearchPage() {
  const items = await getAllPublishedArticlesForSearch();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <BackLink href="/" label="Início" className="mb-6" />
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-taking-black">
        Buscar no portal
      </h1>
      <SearchClient items={items} />
    </div>
  );
}
