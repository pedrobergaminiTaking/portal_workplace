"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCompanyAction, type CompanyActionState } from "@/app/actions/companies";
import { Button } from "@/components/brand/Button";

const initialState: CompanyActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="shrink-0">
      {pending ? "Salvando..." : "Adicionar"}
    </Button>
  );
}

export function CompanyForm() {
  const [state, formAction] = useActionState(createCompanyAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex items-end gap-3">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-bold text-taking-black">
            Nome da empresa:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="rounded-md border border-taking-gray-border px-3 py-2 text-sm text-taking-black outline-none focus:border-taking-black"
          />
        </div>
        <SubmitButton />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="domain" className="text-sm font-bold text-taking-black">
          Domínio de e-mail (opcional):
        </label>
        <input
          id="domain"
          name="domain"
          type="text"
          placeholder="empresa.com"
          className="rounded-md border border-taking-gray-border px-3 py-2 text-sm text-taking-black outline-none focus:border-taking-black"
        />
        <p className="text-xs text-taking-text-faint">
          Quem se cadastrar com um e-mail desse domínio é vinculado automaticamente a esta
          empresa e passa a ver o conteúdo marcado para ela.
        </p>
      </div>
      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}
