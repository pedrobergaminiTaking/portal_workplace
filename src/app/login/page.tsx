import { Suspense } from "react";
import Link from "next/link";
import { RingsPattern } from "@/components/brand/RingsPattern";
import { Logo } from "@/components/brand/Logo";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 items-center justify-center lg:flex">
        <div className="absolute inset-0">
          <RingsPattern variant="hero" />
        </div>
        <div className="relative z-10 max-w-xs px-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-taking-orange">
            Portal de conhecimento
          </p>
          <p className="text-2xl font-bold leading-tight tracking-tight text-taking-white">
            Take over your knowledge.
          </p>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center bg-taking-white px-6 py-16 lg:w-1/2">
        <Link
          href="/"
          className="absolute left-6 top-6 inline-flex items-center gap-1.5 text-sm font-bold text-taking-text-muted transition-colors hover:text-taking-black"
        >
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
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Voltar
        </Link>
        <div className="w-full max-w-sm">
          <Logo className="mb-8" />
          <h1 className="mb-1 text-xl font-bold text-taking-black">Acesso administrativo</h1>
          <p className="mb-6 text-sm text-taking-text-muted">
            Login restrito à equipe editorial. Use o e-mail e senha fornecidos pelo administrador do portal.
          </p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
