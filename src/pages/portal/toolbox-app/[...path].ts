import type { APIRoute } from 'astro';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

const TOOLBOX_ROOT = path.resolve(process.cwd(), 'private-toolbox');

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.pdf': 'application/pdf',
};

function notFound() {
  return new Response('Not Found', { status: 404 });
}

export const GET: APIRoute = async ({ params }) => {
  const rawPath = params.path ?? '';
  const normalized = rawPath.replace(/\\/g, '/');

  if (normalized.includes('..')) return notFound();

  const segments = normalized.split('/').filter(Boolean).map((s) => decodeURIComponent(s));
  let target = path.join(TOOLBOX_ROOT, ...segments);

  if (!target.startsWith(TOOLBOX_ROOT)) return notFound();

  try {
    let info = await stat(target);
    if (info.isDirectory()) {
      target = path.join(target, 'index.html');
      info = await stat(target);
    }
    if (!info.isFile()) return notFound();

    const ext = path.extname(target).toLowerCase();
    const mime = MIME[ext] ?? 'application/octet-stream';
    const data = await readFile(target);
    return new Response(data, {
      status: 200,
      headers: {
        'content-type': mime,
        'cache-control': 'private, max-age=300',
        'x-robots-tag': 'noindex,nofollow',
      },
    });
  } catch {
    return notFound();
  }
};
