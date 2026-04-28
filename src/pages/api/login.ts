import type { APIRoute } from 'astro';

const COOKIE_NAME = 'hy_auth';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function safeRedirectTarget(raw: string): string {
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/';
  return raw;
}

export const POST: APIRoute = async ({ request, redirect, cookies }) => {
  const form = await request.formData();
  const password = String(form.get('password') ?? '');
  const requested = safeRedirectTarget(String(form.get('redirect') ?? '/'));

  const expected = import.meta.env.SITE_PASSWORD ?? '';
  if (!expected || password !== expected) {
    const target = `/password?error=1&redirect=${encodeURIComponent(requested)}`;
    return redirect(target, 303);
  }

  const token = await sha256Hex(expected);
  cookies.set(COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: MAX_AGE_SECONDS,
  });

  return redirect(requested, 303);
};
