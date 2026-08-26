import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import { RingsPattern } from "@/components/brand/RingsPattern";
import { CategoryIcon } from "@/components/brand/CategoryIcon";
import { Button } from "@/components/brand/Button";
import { FeaturedCarousel } from "@/components/content/FeaturedCarousel";
import { getMostAccessedArticles } from "@/lib/articles";
import { getNavCategories } from "@/lib/categories";
import { getCategoryImage } from "@/lib/category-images";

// Fundo com foto real (banco gratuito, Unsplash) + gradiente e textura de
// anéis da marca por cima — mesmo hero usado pra visitante anônimo e pra
// quem está logado; eyebrow/título/texto explicativo ficam fixos aqui,
// `children` é só a parte que muda (CTA de cadastro/login pro anônimo).
function Hero({ children }: { children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-team-meeting.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-taking-black via-taking-black/75 to-taking-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-taking-black/70 via-taking-black/20 to-transparent" />
      <div className="absolute inset-0 opacity-20 mix-blend-overlay">
        <RingsPattern variant="hero" />
      </div>
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col justify-center px-6 py-28 sm:py-36">
        <div className="animate-fade-in-up">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-taking-orange">
            <span className="h-px w-6 bg-taking-orange" aria-hidden="true" />
            Portal de conhecimento
          </p>
          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-taking-white sm:text-5xl">
            Take over your knowledge.
          </h1>
          <p className="mt-4 max-w-lg text-sm text-taking-white/80">
            O portal de conhecimento do Grupo Taking reúne processos, políticas e guias
            internos em um só lugar, organizados por empresa para você achar rápido o que
            precisa no dia a dia.
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}

// Visitante anônimo: landing institucional, sem nenhum conteúdo real —
// categorias e artigos exigem login (ver src/middleware.ts).
function AnonymousLanding() {
  return (
    <div>
      <Hero>
        <p className="mt-2 max-w-md text-sm text-taking-white/80">
          Entre com seu e-mail corporativo para ver o conteúdo liberado para você.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/cadastro">
            <Button variant="primary">Criar conta</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="border-taking-white text-taking-white hover:bg-taking-white/10">
              Entrar
            </Button>
          </Link>
        </div>
      </Hero>

      <section className="animate-fade-in-up mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-taking-orange">
              <span className="h-px w-6 bg-taking-orange" aria-hidden="true" />
              Sobre o portal
            </p>
            <h2 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-taking-black sm:text-3xl">
              Feito pra quem faz o dia a dia acontecer
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-taking-text-body">
              <p>
                O Portal de Conhecimento reúne, num só lugar, os processos, políticas e
                guias que a Taking usa, e que os clientes atendidos pela Taking usam
                também.
              </p>
              <p>
                Se você é um <strong className="text-taking-black">Taker</strong>,
                alocado pela Taking em um cliente, é aqui que você encontra as
                políticas da empresa em que está atuando, os guias práticos do seu dia
                a dia e as respostas pras dúvidas mais comuns, tudo separado por
                empresa. Se você faz parte da equipe Taking, tem acesso a tudo, de
                todos os clientes atendidos.
              </p>
              <p>
                Pra ver o conteúdo liberado pra você, crie uma conta com o seu e-mail
                corporativo. O sistema identifica automaticamente a empresa certa pelo
                domínio do e-mail.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="/images/sobre-portal.jpg"
              alt=""
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-taking-black/30 via-transparent to-transparent" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function HomePage() {
  const session = await auth();
  if (!session?.user) return <AnonymousLanding />;

  const [mostAccessed, categories] = await Promise.all([
    getMostAccessedArticles(3),
    getNavCategories(),
  ]);

  return (
    <div>
      <Hero />

      <section className="animate-fade-in-up mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-taking-orange">
              Destaques
            </p>
            <h2 className="text-lg font-bold text-taking-black">Mais acessados</h2>
          </div>
        </div>
        {mostAccessed.length > 0 ? (
          <div className="overflow-hidden rounded-xl">
            <FeaturedCarousel
              articles={mostAccessed.map((article) => ({
                id: article.id,
                categorySlug: article.category.slug,
                categoryName: article.category.name,
                slug: article.slug,
                title: article.title,
                excerpt: article.excerpt,
                readingTimeMinutes: article.readingTimeMinutes,
              }))}
            />
          </div>
        ) : (
          <p className="text-sm text-taking-text-muted">Nenhum artigo em destaque ainda.</p>
        )}
      </section>

      <section className="animate-fade-in-up mx-auto max-w-6xl px-6 py-12">
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-taking-orange">
          Explore
        </p>
        <h2 className="mb-6 text-lg font-bold text-taking-black">Categorias</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg"
            >
              <Image
                src={getCategoryImage(category.slug)}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-taking-black/90 via-taking-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <div
                  className={`mb-2 flex h-8 w-8 items-center justify-center rounded-md ${index % 2 === 0 ? "bg-taking-orange" : "bg-taking-white"}`}
                >
                  <CategoryIcon
                    slug={category.slug}
                    className={`h-4 w-4 ${index % 2 === 0 ? "text-taking-black" : "text-taking-black"}`}
                  />
                </div>
                <span className="font-bold text-taking-white">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
