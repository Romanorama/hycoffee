import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import betaUsers from '../data/beta-users.json';

export const SESSION_COOKIE = 'hy_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;

export interface BetaUser {
  email: string;
  name: string;
  passwordHash: string;
}

export interface SessionPayload {
  email: string;
  name: string;
}

function secretKey(): Uint8Array {
  const raw = import.meta.env.JWT_SECRET ?? process.env.JWT_SECRET;
  if (!raw) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(raw);
}

export function findUser(email: string): BetaUser | null {
  const normalized = email.trim().toLowerCase();
  const list = betaUsers as BetaUser[];
  return list.find((u) => u.email.toLowerCase() === normalized) ?? null;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: BetaUser): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function readSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (typeof payload.email !== 'string' || typeof payload.name !== 'string') return null;
    return { email: payload.email, name: payload.name };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: import.meta.env.PROD,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
};
