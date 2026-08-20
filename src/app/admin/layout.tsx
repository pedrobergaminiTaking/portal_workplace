import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Logo } from "@/components/brand/Logo";

// Reforço de defesa em profundidade: o middleware (src/middleware.ts) já
// protege /admin/*, mas cada página aqui não fazia sua própria checagem —
// isso garante que uma falha futura no middleware não deixe as telas de
// admin acessíveis sem autorização.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user.role !== "EDITOR" && session?.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-taking-white">
      <header className="bg-taking-charcoal">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Link href="/admin">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/empresas"
              className="text-[13px] text-[#cccccc] transition-colors hover:text-taking-white"
            >
              Empresas
            </Link>
            <Link
              href="/"
              className="text-[13px] text-[#cccccc] transition-colors hover:text-taking-white"
            >
              Voltar ao portal
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  );
}
