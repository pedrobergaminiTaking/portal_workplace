"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createArticleAction, updateArticleAction, type ArticleActionState } from "@/app/actions/articles";
import { Button } from "@/components/brand/Button";

type ArticleFormProps = {
  categories: { id: string; name: string }[];
  companies: { id: string; name: string }[];
  article?: {
    id: string;
    categoryId: string;
    title: string;
    content: string;
    attachmentName: string | null;
    companyIds: string[];
  };
};

const initialState: ArticleActionState = {};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="mt-2 w-full">
      {pending ? "Salvando..." : isEditing ? "Salvar alterações" : "Publicar"}
    </Button>
  );
}

export function ArticleForm({ categories, companies, article }: ArticleFormProps) {
  const isEditing = !!article;
  const action = isEditing ? updateArticleAction : createArticleAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEditing && <input type="hidden" name="articleId" value={article.id} />}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="categoryId" className="text-sm font-bold text-taking-black">
          Categoria:
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={article?.categoryId ?? ""}
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
          defaultValue={article?.title}
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
          defaultValue={article?.content}
          className="rounded-md border border-taking-gray-border px-3 py-2 text-sm text-taking-black outline-none focus:border-taking-black"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="attachment" className="text-sm font-bold text-taking-black">
          Anexo em PDF (opcional):
        </label>
        {article?.attachmentName && (
          <p className="text-xs text-taking-text-muted">
            Anexo atual: {article.attachmentName}. Envie um novo arquivo para substituí-lo.
          </p>
        )}
        <input
          id="attachment"
          name="attachment"
          type="file"
          accept="application/pdf"
          className="rounded-md border border-taking-gray-border px-3 py-2 text-sm text-taking-black outline-none focus:border-taking-black"
        />
        <p className="text-xs text-taking-text-faint">Máximo de 10MB.</p>
      </div>

      {companies.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-taking-black">Empresas (opcional):</label>
          <p className="text-xs text-taking-text-faint">
            Controla quem vê este conteúdo: se marcado, só usuários vinculados a uma dessas
            empresas (pelo domínio do e-mail) conseguem acessá-lo. Sem nenhuma marcação, o
            artigo fica visível a qualquer usuário logado.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 rounded-md border border-taking-gray-border p-3">
            {companies.map((company) => (
              <label key={company.id} className="flex items-center gap-2 text-sm text-taking-black">
                <input
                  type="checkbox"
                  name="companyIds"
                  value={company.id}
                  defaultChecked={article?.companyIds.includes(company.id)}
                />
                {company.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}

      <SubmitButton isEditing={isEditing} />
    </form>
  );
}
