import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/brand/Badge";

export function ArticleCard({
  categorySlug,
  categoryName,
  slug,
  title,
  readingTimeMinutes,
  highlighted,
}: {
  categorySlug: string;
  categoryName: string;
  slug: string;
  title: string;
  readingTimeMinutes: number | null;
  highlighted: boolean;
}) {
  return (
    <Link
      href={`/${categorySlug}/${slug}`}
      className={cn(
        "flex flex-1 flex-col gap-2 rounded-lg bg-taking-gray p-4 transition-shadow hover:shadow-sm",
        highlighted && "border-[1.5px] border-taking-orange",
      )}
    >
      <div className={cn("h-6 w-6 rounded-md", highlighted ? "bg-taking-orange" : "bg-taking-black")} />
      <p className="text-xs font-bold uppercase tracking-wide text-taking-orange">{categoryName}</p>
      <p className="text-[15px] font-bold leading-snug text-taking-black">{title}</p>
      <div className="mt-auto flex items-center gap-2">
        {highlighted && <Badge>Mais acessado</Badge>}
        {readingTimeMinutes != null && (
          <span className="text-xs text-taking-text-faint">{readingTimeMinutes} min de leitura</span>
        )}
      </div>
    </Link>
  );
}
