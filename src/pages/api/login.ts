import type { APIRoute } from 'astro';
import {
  SESSION_COOKIE,
  createSession,
  findUser,
  sessionCookieOptions,
  verifyPassword,
} from '../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');

  const fail = () =>
    redirect('/portal/login?error=1', 303);

  if (!email || !password) return fail();

  const user = findUser(email);
  if (!user) return fail();

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return fail();

  const token = await createSession(user);
  cookies.set(SESSION_COOKIE, token, sessionCookieOptions);

  return redirect('/portal/toolbox', 303);
};
