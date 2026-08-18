"use client";

import { useState } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";

export function MobileNav({
  categories,
  canManageContent,
  isLoggedIn,
}: {
  categories: { slug: string; name: string }[];
  canManageContent: boolean;
  isLoggedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        className="flex text-[#cccccc] transition-colors hover:text-taking-white"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {open ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </>
          ) : (
            <>
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full flex flex-col gap-1 border-t border-white/10 bg-taking-charcoal px-6 py-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              onClick={close}
              className="py-2 text-sm text-[#cccccc] transition-colors hover:text-taking-white"
            >
              {category.name}
            </Link>
          ))}

          <div className="my-2 h-px bg-white/10" />

          <Link
            href="/buscar"
            onClick={close}
            className="py-2 text-sm text-[#cccccc] transition-colors hover:text-taking-white"
          >
            Buscar
          </Link>

          {canManageContent && (
            <Link
              href="/admin/novo"
              onClick={close}
              className="py-2 text-sm font-bold text-taking-orange"
            >
              + Novo conteúdo
            </Link>
          )}

          {isLoggedIn ? (
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full py-2 text-left text-sm text-[#cccccc] transition-colors hover:text-taking-white"
              >
                Sair
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              onClick={close}
              className="py-2 text-sm text-[#cccccc] transition-colors hover:text-taking-white"
            >
              Acesso administrativo
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
