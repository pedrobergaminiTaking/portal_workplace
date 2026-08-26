"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button, Card, type ButtonProps } from "@heroui/react";
import { RingsPattern } from "@/components/brand/RingsPattern";
import { getArticleImage } from "@/lib/category-images";
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

type SlideStyle = {
  /** Gradient over the category photo — keeps text legible and gives each slide its own tone. */
  overlayClassName: string;
  badgeClassName: string;
  buttonVariant: ButtonProps["variant"];
  buttonClassName: string;
};

// 3 alternating overlay tones cycled by `index % SLIDE_STYLES.length`, so consecutive
// slides never look identical even when their photos are similar. Title/excerpt/button
// stay left-aligned in the same spot, and text is always white — every slide is a photo
// with a dark-ish gradient, so a single legible treatment is safer than 3 different ones.
const SLIDE_STYLES: SlideStyle[] = [
  {
    overlayClassName: "bg-gradient-to-t from-taking-black/95 via-taking-black/50 to-taking-black/10",
    badgeClassName: "bg-taking-orange text-taking-black",
    buttonVariant: "primary",
    buttonClassName: "bg-taking-orange text-taking-black transition-all duration-200 hover:scale-105 hover:brightness-95",
  },
  {
    overlayClassName: "bg-gradient-to-t from-taking-black/95 via-taking-orange/25 to-transparent",
    badgeClassName: "bg-taking-white text-taking-black",
    buttonVariant: "secondary",
    buttonClassName:
      "bg-taking-white text-taking-black transition-all duration-200 hover:scale-105 hover:bg-taking-orange",
  },
  {
    overlayClassName: "bg-gradient-to-br from-taking-black/95 via-taking-black/60 to-taking-black/20",
    badgeClassName: "border border-taking-white/40 bg-taking-black/40 text-taking-white",
    buttonVariant: "outline",
    buttonClassName:
      "border-taking-white text-taking-white transition-all duration-200 hover:scale-105 hover:bg-taking-white hover:text-taking-black",
  },
];

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
    // Volta pro início ao passar do último slide (e vice-versa) em vez de
    // travar sem fazer nada — o carrossel é um ciclo, não uma lista finita.
    const nextIndex = (activeIndex + direction + articles.length) % articles.length;
    scrollToIndex(nextIndex);
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
        {articles.map((article, index) => {
          const style = SLIDE_STYLES[index % SLIDE_STYLES.length];

          return (
            <Link
              key={article.id}
              href={`/${article.categorySlug}/${article.slug}`}
              className="relative flex h-80 w-full shrink-0 snap-center flex-col justify-center overflow-hidden px-8 sm:px-16"
            >
              <div className="absolute inset-0">
                <Image
                  src={getArticleImage(article.categorySlug, article.id)}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 opacity-15 mix-blend-overlay">
                <RingsPattern variant="hero" />
              </div>
              <div className={cn("absolute inset-0", style.overlayClassName)} />

              <Card variant="transparent" className="relative z-10 max-w-md gap-0 p-0">
                <span
                  className={cn(
                    "mb-3 w-fit rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest",
                    style.badgeClassName,
                  )}
                >
                  {article.categoryName}
                </span>
                <h3 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-taking-white">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="mb-6 line-clamp-2 text-sm text-taking-white/85">{article.excerpt}</p>
                )}
                <Button variant={style.buttonVariant} className={cn("w-fit", style.buttonClassName)}>
                  Ler mais
                </Button>
              </Card>
            </Link>
          );
        })}
      </div>

      {articles.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Destaque anterior"
            onClick={() => scrollByOne(-1)}
            className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-taking-white p-2.5 text-taking-black shadow-lg transition-all duration-200 hover:scale-110 hover:bg-taking-orange hover:shadow-xl active:scale-95 sm:flex"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Próximo destaque"
            onClick={() => scrollByOne(1)}
            className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-taking-white p-2.5 text-taking-black shadow-lg transition-all duration-200 hover:scale-110 hover:bg-taking-orange hover:shadow-xl active:scale-95 sm:flex"
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
