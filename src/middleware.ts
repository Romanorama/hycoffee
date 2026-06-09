import { defineMiddleware } from 'astro:middleware';
import { SESSION_COOKIE, readSession } from './lib/auth';

const PUBLIC_PORTAL_PATHS = new Set(['/portal/login']);

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isPortal = pathname === '/portal' || pathname.startsWith('/portal/');
  const isLoginApi = pathname === '/api/login' || pathname === '/api/logout';

  if (!isPortal && !isLoginApi) return next();

  const token = context.cookies.get(SESSION_COOKIE)?.value;
  const session = await readSession(token);
  context.locals.session = session;

  if (isPortal && !session && !PUBLIC_PORTAL_PATHS.has(pathname)) {
    return context.redirect('/portal/login');
  }

  if ((pathname === '/portal/login' || pathname === '/portal') && session) {
    return context.redirect('/portal/toolbox');
  }

  return next();
});
