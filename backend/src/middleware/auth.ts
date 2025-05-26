import { FastifyRequest, FastifyReply } from 'fastify';
import { auth } from '@/lib/auth';

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const sessionId = request.cookies[auth.sessionCookieName];

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Nie jesteś zalogowany',
    });
  }

  try {
    const { session, user } = await auth.validateSession(sessionId);

    if (!session) {
      const sessionCookie = auth.createBlankSessionCookie();
      reply.setCookie(sessionCookie.name, sessionCookie.value, {
        path: '/',
        ...sessionCookie.attributes,
      });

      return reply.status(401).send({
        error: 'Nie jesteś zalogowany',
      });
    }

    // Add user to request
    request.user = user;
  } catch (error) {
    return reply.status(401).send({
      error: 'Nie jesteś zalogowany',
    });
  }
}

// Extend FastifyRequest type
declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      name: string;
      avatar: string | null;
    };
  }
} 