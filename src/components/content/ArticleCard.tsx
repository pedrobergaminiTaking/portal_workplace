import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/brand/Badge";
import { CategoryIcon } from "@/components/brand/CategoryIcon";

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
        "group flex flex-1 flex-col gap-2 rounded-lg bg-taking-gray p-4 transition-all hover:-translate-y-0.5 hover:shadow-md",
        highlighted && "border-[1.5px] border-taking-orange",
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-transform group-hover:scale-105",
          highlighted ? "bg-taking-orange" : "bg-taking-black",
        )}
      >
        <CategoryIcon
          slug={categorySlug}
          className={cn("h-4 w-4", highlighted ? "text-taking-black" : "text-taking-white")}
        />
      </div>
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
