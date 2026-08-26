/**
 * Erro cuja mensagem é segura para mostrar ao usuário final. Qualquer outro
 * erro (Prisma, Supabase, etc.) deve ser logado no servidor e substituído
 * por uma mensagem genérica antes de chegar no cliente.
 */
export class UserFacingError extends Error {}

/**
 * Padrão comum das Server Actions: erros de validação (UserFacingError)
 * voltam com sua própria mensagem; qualquer outro erro é logado e trocado
 * por uma mensagem genérica; um redirect do Next.js (NEXT_REDIRECT) precisa
 * ser relançado para o framework continuar tratando a navegação.
 */
export function toActionError(
  error: unknown,
  fallbackMessage: string,
  logLabel: string,
): { error: string } {
  if (error instanceof UserFacingError) {
    return { error: error.message };
  }
  if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
    console.error(`${logLabel} failed:`, error);
    return { error: fallbackMessage };
  }
  throw error;
}
