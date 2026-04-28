import type { Context } from 'https://edge.netlify.com';

const COOKIE_NAME = 'hy_auth';

const PUBLIC_PATHS = new Set<string>([
  '/password',
  '/api/login',
  '/favicon.ico',
  '/favicon.svg',
  '/robots.txt',
]);

const PUBLIC_PREFIXES = ['/_astro/', '/fonts/'];

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

export default async (req: Request, _context: Context): Promise<Response | void> => {
  const url = new URL(req.url);
  const path = url.pathname;

  if (PUBLIC_PATHS.has(path)) return;
  if (PUBLIC_PREFIXES.some((p) => path.startsWith(p))) return;

  const password = Deno.env.get('SITE_PASSWORD') ?? '';
  if (!password) return;

  const expected = await sha256Hex(password);
  const cookies = parseCookies(req.headers.get('cookie'));

  if (cookies[COOKIE_NAME] === expected) return;

  const target = `/password?redirect=${encodeURIComponent(path + url.search)}`;
  return Response.redirect(new URL(target, url.origin), 302);
};

export const config = {
  path: '/*',
};
