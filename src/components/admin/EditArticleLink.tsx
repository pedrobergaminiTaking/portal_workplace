import Link from "next/link";

export function EditArticleLink({ articleId }: { articleId: string }) {
  return (
    <Link
      href={`/admin/${articleId}/editar`}
      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-taking-text-faint transition-colors hover:text-taking-orange"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
      Editar
    </Link>
  );
}
