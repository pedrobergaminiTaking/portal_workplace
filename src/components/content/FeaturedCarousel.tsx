"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { RingsPattern } from "@/components/brand/RingsPattern";
import { Button } from "@/components/brand/Button";
import { cn } from "@/lib/utils";

type FeaturedArticle = {
  id: string;
  categorySlug: string;
  categoryName: string;
  slug: string;
  title: string;
  excerpt: string | null;
  readingTimeMinutes: number | null;
};

export function FeaturedCarousel({ articles }: { articles: FeaturedArticle[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function handleScroll(event: Event) {
      const el = event.currentTarget as HTMLDivElement;
      if (!el.clientWidth) return;
      setActiveIndex(Math.round(el.scrollLeft / el.clientWidth));
    }

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollByOne(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth, behavior: "smooth" });
  }

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/${article.categorySlug}/${article.slug}`}
            className="relative flex h-80 w-full shrink-0 snap-center flex-col justify-center overflow-hidden px-8 sm:px-16"
          >
            <div className="absolute inset-0">
              <RingsPattern variant="orange" />
            </div>

            <div className="relative z-10 max-w-md">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-taking-black">
                {article.categoryName}
              </p>
              <h3 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-taking-black">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="mb-6 line-clamp-2 text-sm text-taking-black/70">{article.excerpt}</p>
              )}
              <Button
                variant="secondary"
                className="text-taking-orange transition-all duration-200 hover:scale-105 hover:text-taking-white"
              >
                Ler mais
              </Button>
            </div>
          </Link>
        ))}
      </div>

      {articles.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Destaque anterior"
            onClick={() => scrollByOne(-1)}
            className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-taking-white/90 p-2 text-taking-black shadow-md transition-colors hover:bg-taking-white sm:flex"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Próximo destaque"
            onClick={() => scrollByOne(1)}
            className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-taking-white/90 p-2 text-taking-black shadow-md transition-colors hover:bg-taking-white sm:flex"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="mt-4 flex items-center justify-center gap-2">
            {articles.map((article, index) => (
              <button
                key={article.id}
                type="button"
                aria-label={`Ir para o destaque ${index + 1}`}
                aria-current={index === activeIndex}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  index === activeIndex ? "bg-taking-orange" : "bg-taking-gray-border hover:bg-taking-orange",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
