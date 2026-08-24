import Link from "next/link";
import { Button } from "@/components/brand/Button";
import { Logo } from "@/components/brand/Logo";
import { RingsPattern } from "@/components/brand/RingsPattern";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-taking-white px-6 text-center">
      <div className="absolute inset-0 z-0 opacity-[0.05]" aria-hidden="true">
        <RingsPattern variant="dark" />
      </div>
      <div className="animate-fade-in-up relative z-10 flex flex-col items-center gap-6">
        <Logo />
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-taking-orange">
            Erro 404
          </p>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-taking-black">
            Página não encontrada
          </h1>
          <p className="max-w-sm text-sm text-taking-text-muted">
            O conteúdo que você procura não existe ou foi movido.
          </p>
        </div>
        <Link href="/">
          <Button variant="primary">Voltar para o início</Button>
        </Link>
      </div>
    </div>
  );
}
