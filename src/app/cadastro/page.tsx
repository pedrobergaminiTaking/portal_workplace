import { Suspense } from "react";
import Link from "next/link";
import { RingsPattern } from "@/components/brand/RingsPattern";
import { Logo } from "@/components/brand/Logo";
import { SignupForm } from "@/components/auth/SignupForm";
import { BackLink } from "@/components/ui/BackLink";
import { getCompanies } from "@/lib/companies";

// Sem isso, o Next tentaria renderizar a lista de empresas de forma
// estática no build e ela ficaria congelada até o próximo deploy — o
// dropdown precisa refletir empresas cadastradas depois pelo admin.
export const dynamic = "force-dynamic";

export default async function CadastroPage() {
  const companies = await getCompanies();
  const companiesWithDomain = companies
    .filter((company): company is typeof company & { domain: string } => Boolean(company.domain))
    .map((company) => ({ id: company.id, name: company.name, domain: company.domain }));

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
          <h1 className="mb-1 text-xl font-bold text-taking-black">Criar conta</h1>
          <p className="mb-6 text-sm text-taking-text-muted">
            Use seu e-mail corporativo. O conteúdo liberado para você depende da empresa
            associada a esse e-mail.
          </p>
          <Suspense>
            <SignupForm companies={companiesWithDomain} />
          </Suspense>
          <p className="mt-6 text-center text-sm text-taking-text-muted">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-bold text-taking-black hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
