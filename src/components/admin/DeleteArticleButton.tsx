"use client";

import { deleteArticleAction } from "@/app/actions/articles";

export function DeleteArticleButton({ articleId }: { articleId: string }) {
  return (
    <form
      action={deleteArticleAction}
      onSubmit={(event) => {
        if (!window.confirm("Tem certeza que deseja excluir este conteúdo? Essa ação não pode ser desfeita.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="articleId" value={articleId} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-taking-text-faint transition-colors hover:text-red-600"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 7h16" />
          <path d="M9 7V4h6v3" />
          <path d="M6 7l1 13h10l1-13" />
        </svg>
        Excluir
      </button>
    </form>
  );
}
