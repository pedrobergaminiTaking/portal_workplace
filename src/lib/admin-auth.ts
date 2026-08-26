import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserFacingError } from "@/lib/errors";
import { isManagerRole } from "@/lib/roles";

/**
 * Verifica a sessão E revalida papel/isActive direto no banco antes de
 * qualquer mutação — evita que uma sessão JWT (válida por vários dias)
 * continue autorizando alguém que foi desativado ou rebaixado nesse meio
 * tempo. Só roda em Server Actions (Node runtime), nunca no middleware.
 */
export async function requireManager() {
  const session = await auth();
  if (!isManagerRole(session?.user.role)) {
    throw new UserFacingError("Não autorizado.");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, isActive: true },
  });
  if (!user || !user.isActive || !isManagerRole(user.role)) {
    throw new UserFacingError("Não autorizado.");
  }

  return session;
}
