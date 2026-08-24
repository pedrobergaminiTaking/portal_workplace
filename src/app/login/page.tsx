import { Suspense } from "react";
import { RingsPattern } from "@/components/brand/RingsPattern";
import { Logo } from "@/components/brand/Logo";
import { LoginForm } from "@/components/auth/LoginForm";
import { BackLink } from "@/components/ui/BackLink";

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
        <BackLink href="/" className="absolute left-6 top-6" />
        <div className="animate-fade-in-up w-full max-w-sm">
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
