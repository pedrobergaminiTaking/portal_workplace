"use client";

import { useFormStatus } from "react-dom";
import { deleteArticleAction } from "@/app/actions/articles";

function DeleteLoadingOverlay() {
  const { pending } = useFormStatus();
  if (!pending) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-taking-gray-border border-t-taking-orange" />
        <p className="text-sm font-bold text-taking-black">Excluindo conteúdo...</p>
      </div>
    </div>
  );
}

function DeleteSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-taking-text-faint transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
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
      {pending ? "Excluindo..." : "Excluir"}
    </button>
  );
}

export function DeleteArticleButton({
  articleId,
  redirectTo,
}: {
  articleId: string;
  redirectTo: string;
}) {
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
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <DeleteSubmitButton />
      <DeleteLoadingOverlay />
    </form>
  );
}
