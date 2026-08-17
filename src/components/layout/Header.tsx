import Link from "next/link";
import { auth } from "@/auth";
import { getNavCategories } from "@/lib/categories";
import { logoutAction } from "@/app/actions/auth";
import { Logo } from "@/components/brand/Logo";
import { NavLink } from "@/components/layout/NavLink";

export async function Header() {
  const [session, categories] = await Promise.all([auth(), getNavCategories()]);

  return (
    <header className="sticky top-0 z-50 bg-taking-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
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

        <div className="flex items-center gap-4">
          <Link
            href="/buscar"
            className="text-[13px] text-[#cccccc] transition-colors hover:text-taking-white"
          >
            Buscar
          </Link>
          {session?.user && (
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-[13px] text-[#cccccc] transition-colors hover:text-taking-white"
              >
                Sair
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
