"use client";

import Fuse from "fuse.js";
import Link from "next/link";
import { useMemo, useState } from "react";

type SearchItem = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  categoryName: string;
};

export function SearchClient({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () => new Fuse(items, { keys: ["title", "excerpt", "categoryName"], threshold: 0.35 }),
    [items],
  );

  const results = query.trim() ? fuse.search(query).map((result) => result.item) : items;

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar artigos, processos, políticas..."
        className="mb-8 w-full rounded-md border border-taking-gray-border px-4 py-3 text-sm text-taking-black outline-none focus:border-taking-black"
        autoFocus
      />

      {results.length === 0 ? (
        <p className="text-sm text-taking-text-muted">Nenhum resultado encontrado.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {results.map((item) => (
            <li key={`${item.categorySlug}-${item.slug}`}>
              <Link
                href={`/${item.categorySlug}/${item.slug}`}
                className="block rounded-lg border border-taking-gray-border p-4 transition-colors hover:border-taking-orange"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-taking-orange">
                  {item.categoryName}
                </p>
                <p className="mt-1 font-bold text-taking-black">{item.title}</p>
                {item.excerpt && (
                  <p className="mt-1 text-sm text-taking-text-muted">{item.excerpt}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
