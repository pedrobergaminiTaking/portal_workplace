import { createArticleAction } from "@/app/actions/articles";
import { Button } from "@/components/brand/Button";

export function ArticleForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  return (
    <form action={createArticleAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="categoryId" className="text-sm font-bold text-taking-black">
          Categoria:
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue=""
          className="rounded-md border border-taking-gray-border px-3 py-2 text-sm text-taking-black outline-none focus:border-taking-black"
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-bold text-taking-black">
          Título:
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="rounded-md border border-taking-gray-border px-3 py-2 text-sm text-taking-black outline-none focus:border-taking-black"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="content" className="text-sm font-bold text-taking-black">
          Corpo do texto:
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={10}
          className="rounded-md border border-taking-gray-border px-3 py-2 text-sm text-taking-black outline-none focus:border-taking-black"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="attachment" className="text-sm font-bold text-taking-black">
          Anexo em PDF (opcional):
        </label>
        <input
          id="attachment"
          name="attachment"
          type="file"
          accept="application/pdf"
          className="rounded-md border border-taking-gray-border px-3 py-2 text-sm text-taking-black outline-none focus:border-taking-black"
        />
        <p className="text-xs text-taking-text-faint">Máximo de 10MB.</p>
      </div>

      <Button type="submit" className="mt-2 w-full">
        Publicar
      </Button>
    </form>
  );
}
