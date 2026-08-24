"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/brand/Button";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setStatus("idle");
      setError("E-mail ou senha inválidos.");
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
        <label htmlFor="email" className="text-sm font-bold text-taking-black">
          E-mail
        </label>
        <input
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
          autoComplete="current-password"
          disabled={isSubmitting}
          className="rounded-md border border-taking-gray-border px-3 py-2 text-sm text-taking-black outline-none transition-colors focus:border-taking-black disabled:bg-taking-gray"
        />
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
          Login realizado com sucesso! Redirecionando...
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
        {status === "submitting" ? "Entrando..." : status === "success" ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
