// Banco de 10 fotos por categoria (Unsplash, uso livre) — existe pra dar
// variedade quando o "mais acessados" muda: dois artigos da mesma categoria
// não ficam sempre com a mesma imagem única.
function buildCategoryImages(slug: string, count = 10): string[] {
  return Array.from({ length: count }, (_, i) => `/images/categories/${slug}/img-${String(i + 1).padStart(2, "0")}.jpg`);
}

const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  processos: buildCategoryImages("processos"),
  politicas: buildCategoryImages("politicas"),
  guias: buildCategoryImages("guias"),
  faq: buildCategoryImages("faq"),
};

const DEFAULT_CATEGORY_IMAGE_POOL = ["/images/hero-team-meeting.jpg"];

export function getCategoryImagePool(categorySlug: string): string[] {
  return CATEGORY_IMAGE_POOLS[categorySlug] ?? DEFAULT_CATEGORY_IMAGE_POOL;
}

/** Imagem "de capa" da categoria — usada nos cards de "Categorias" da home. */
export function getCategoryImage(categorySlug: string): string {
  return getCategoryImagePool(categorySlug)[0];
}

// Hash simples (FNV-1a) só pra escolher um índice estável dentro do banco —
// não precisa ser criptográfico, só determinístico por artigo.
function hashToIndex(value: string, mod: number): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return Math.abs(hash) % mod;
}

/**
 * Imagem de um artigo específico dentro do banco da sua categoria — estável
 * por `articleId` (o mesmo artigo sempre mostra a mesma foto), mas artigos
 * diferentes da mesma categoria naturalmente pegam fotos diferentes.
 */
export function getArticleImage(categorySlug: string, articleId: string): string {
  const pool = getCategoryImagePool(categorySlug);
  return pool[hashToIndex(articleId, pool.length)];
}
