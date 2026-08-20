/**
 * Erro cuja mensagem é segura para mostrar ao usuário final. Qualquer outro
 * erro (Prisma, Supabase, etc.) deve ser logado no servidor e substituído
 * por uma mensagem genérica antes de chegar no cliente.
 */
export class UserFacingError extends Error {}
