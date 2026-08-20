/**
 * Limitador de tentativas de login em memória. Não sobrevive a um restart
 * do processo nem é compartilhado entre múltiplas instâncias — suficiente
 * para o deployment atual (processo único), mas não é uma solução
 * distribuída. Objetivo: tornar brute-force de senha impraticável, sem
 * mudar o contrato de authorize() (continua retornando null em qualquer
 * falha, igual a uma senha errada).
 */
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 5 * 60 * 1000;

type Entry = { count: number; firstAttemptAt: number; lockedUntil?: number };

const attempts = new Map<string, Entry>();

function normalizeKey(email: string) {
  return email.trim().toLowerCase();
}

export function isRateLimited(email: string): boolean {
  const key = normalizeKey(email);
  const entry = attempts.get(key);
  if (!entry) return false;

  const now = Date.now();
  if (entry.lockedUntil) {
    if (entry.lockedUntil > now) return true;
    attempts.delete(key);
    return false;
  }
  if (now - entry.firstAttemptAt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return false;
}

export function recordFailedAttempt(email: string) {
  const key = normalizeKey(email);
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now - entry.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: now });
    return;
  }

  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }
}

export function clearAttempts(email: string) {
  attempts.delete(normalizeKey(email));
}
