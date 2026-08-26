import type { Session } from "next-auth";
import type { Prisma } from "@prisma/client";
import { isManagerRole } from "@/lib/roles";

// E-mails desse domínio são a equipe interna da Taking: sempre enxergam
// todo o conteúdo, independente de empresa.
export const INTERNAL_EMAIL_DOMAIN = "taking.com.br";

export function isInternalEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.trim().toLowerCase().endsWith(`@${INTERNAL_EMAIL_DOMAIN}`);
}

// ADMIN/EDITOR (equipe editorial) e e-mails internos sempre veem tudo,
// igual já acontecia hoje para o admin.
export function hasFullVisibility(session: Session | null): boolean {
  return isManagerRole(session?.user?.role) || isInternalEmail(session?.user?.email);
}

export function getViewerCompanyId(session: Session | null): string | null {
  return session?.user?.companyId ?? null;
}

/**
 * Filtro Prisma de visibilidade por empresa: `undefined` quando o usuário
 * enxerga tudo (sem filtro nenhum); senão, artigos sem empresa nenhuma
 * (visíveis a qualquer logado) OU marcados para a empresa do usuário.
 */
export function buildCompanyVisibilityWhere(
  session: Session | null,
): Prisma.ArticleWhereInput | undefined {
  if (hasFullVisibility(session)) return undefined;

  const companyId = getViewerCompanyId(session);
  const or: Prisma.ArticleWhereInput[] = [{ companies: { none: {} } }];
  if (companyId) {
    or.push({ companies: { some: { companyId } } });
  }

  return { OR: or };
}
