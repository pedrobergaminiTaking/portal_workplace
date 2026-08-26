import Link from "next/link";
import { auth } from "@/auth";
import { getNavCategories } from "@/lib/categories";
import { isManagerRole } from "@/lib/roles";
import { logoutAction } from "@/app/actions/auth";
import { Logo } from "@/components/brand/Logo";
import { NavLink } from "@/components/layout/NavLink";
import { MobileNav } from "@/components/layout/MobileNav";

export async function Header() {
  const [session, categories] = await Promise.all([auth(), getNavCategories()]);
  const canManageContent = isManagerRole(session?.user.role);

  return (
    <header className="sticky top-0 z-50 bg-taking-charcoal shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className="h-[3px] bg-gradient-to-r from-taking-orange via-taking-orange/40 to-transparent" />
      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {categories.map((category) => (
            <NavLink key={category.slug} href={`/${category.slug}`}>
              {category.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/buscar"
            className="text-[13px] leading-none text-[#cccccc] transition-colors hover:text-taking-white"
          >
            Buscar
          </Link>
          {canManageContent && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-md bg-taking-orange px-3 py-1.5 text-[13px] font-bold text-taking-black transition-colors hover:brightness-95"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Gerenciar conteúdo
            </Link>
          )}
          {session?.user ? (
            <form action={logoutAction} className="flex items-center">
              <button
                type="submit"
                className="m-0 inline-block appearance-none border-0 bg-transparent p-0 text-[13px] leading-none text-[#cccccc] transition-colors hover:text-taking-white"
              >
                Sair
              </button>
            </form>
          ) : (
            <>
              <Link
                href="/cadastro"
                className="text-[13px] leading-none text-[#cccccc] transition-colors hover:text-taking-white"
              >
                Criar conta
              </Link>
              <Link
                href="/login"
                aria-label="Entrar"
                className="text-[#cccccc] transition-colors hover:text-taking-white"
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
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
              </Link>
            </>
          )}
        </div>

        <MobileNav
          categories={categories}
          canManageContent={canManageContent}
          isLoggedIn={!!session?.user}
        />
      </div>
    </header>
  );
}
