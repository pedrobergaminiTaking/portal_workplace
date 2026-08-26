"use client";

import { deleteCompanyAction } from "@/app/actions/companies";
import { TrashIcon } from "@/components/ui/icons";

export function DeleteCompanyButton({ companyId }: { companyId: string }) {
  return (
    <form
      action={deleteCompanyAction}
      onSubmit={(event) => {
        if (!window.confirm("Tem certeza que deseja excluir esta empresa? Ela será desmarcada de todos os conteúdos.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="companyId" value={companyId} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-taking-text-faint transition-colors hover:text-red-600"
      >
        <TrashIcon />
        Excluir
      </button>
    </form>
  );
}
