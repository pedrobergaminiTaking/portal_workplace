"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/brand/Button";

type Company = { id: string; name: string; domain: string };

export function SignupForm({ companies }: { companies: Company[] }) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const emailRef = useRef<HTMLInputElement>(null);

  function handleCompanyChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const domain = event.target.value;
    const emailInput = emailRef.current;
    if (!domain || !emailInput) return;

    // Deixa só a parte antes do "@" pra pessoa preencher — cursor no início.
    emailInput.value = `@${domain}`;
    emailInput.focus();
    emailInput.setSelectionRange(0, 0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const result = await registerAction({}, formData);

    if (result.error) {
      setStatus("idle");
      setError(result.error);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (signInResult?.error) {
      setStatus("idle");
      setError("Conta criada, mas não foi possível entrar automaticamente. Tente fazer login.");
      return;
    }

    setStatus("success");
    window.setTimeout(() => {
      window.location.href = callbackUrl;
    }, 700);
  }

  const isSubmitting = status === "submitting" || status === "success";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-bold text-taking-black">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          disabled={isSubmitting}
          className="rounded-md border border-taking-gray-border px-3 py-2 text-sm text-taking-black outline-none transition-colors focus:border-taking-black disabled:bg-taking-gray"
        />
      </div>
      {companies.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-sm font-bold text-taking-black">
            Empresa
          </label>
          <select
            id="company"
            defaultValue=""
            onChange={handleCompanyChange}
            disabled={isSubmitting}
            className="rounded-md border border-taking-gray-border bg-taking-white px-3 py-2 text-sm text-taking-black outline-none transition-colors focus:border-taking-black disabled:bg-taking-gray"
          >
            <option value="">Selecione sua empresa</option>
            {companies.map((company) => (
              <option key={company.id} value={company.domain}>
                {company.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-taking-text-faint">
            Não achou sua empresa? Sem problema, é só digitar seu e-mail abaixo.
          </p>
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-bold text-taking-black">
          E-mail corporativo
        </label>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={isSubmitting}
          className="rounded-md border border-taking-gray-border px-3 py-2 text-sm text-taking-black outline-none transition-colors focus:border-taking-black disabled:bg-taking-gray"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-bold text-taking-black">
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          disabled={isSubmitting}
          className="rounded-md border border-taking-gray-border px-3 py-2 text-sm text-taking-black outline-none transition-colors focus:border-taking-black disabled:bg-taking-gray"
        />
        <p className="text-xs text-taking-text-faint">Mínimo de 8 caracteres.</p>
      </div>

      {error && (
        <div className="animate-fade-in-up flex items-center gap-2 rounded-md bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="13" />
            <line x1="12" y1="16" x2="12" y2="16.01" />
          </svg>
          {error}
        </div>
      )}

      {status === "success" && (
        <div className="animate-fade-in-up flex items-center gap-2 rounded-md bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          Conta criada com sucesso! Entrando...
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {status === "submitting" ? "Criando conta..." : status === "success" ? "Entrando..." : "Criar conta"}
      </Button>
    </form>
  );
}
