// Sem imports de propósito: precisa poder ser usado tanto no middleware
// (Edge runtime) quanto em código Node, sem arrastar Prisma/NextAuth.
export type ManagerRole = "EDITOR" | "ADMIN";

export function isManagerRole(role: string | null | undefined): role is ManagerRole {
  return role === "EDITOR" || role === "ADMIN";
}
