import type { FastifyRequest } from 'fastify';
import { AUTH_COOKIE_NAME } from '../auth.constants';

export function readSessionToken(request: FastifyRequest): string | undefined {
  const rawCookie = request.cookies[AUTH_COOKIE_NAME];
  const unsigned = rawCookie ? request.unsignCookie(rawCookie) : null;
  return unsigned?.valid ? unsigned.value : undefined;
}
