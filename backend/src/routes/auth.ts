import { FastifyInstance } from 'fastify';
import { lucia } from '@/lib/auth';
import { z } from 'zod';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export async function authRoutes(app: FastifyInstance) {
  // Login
  app.post('/api/auth/login', async (request, reply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);

      // Find user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        return reply.status(401).send({
          error: 'Nieprawidłowy email lub hasło',
        });
      }

      // Verify password
      const validPassword = await new Argon2id().verify(
        user.password,
        password
      );

      if (!validPassword) {
        return reply.status(401).send({
          error: 'Nieprawidłowy email lub hasło',
        });
      }

      // Create session
      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      reply.setCookie(sessionCookie.name, sessionCookie.value, {
        path: '/',
        ...sessionCookie.attributes,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Nieprawidłowe dane wejściowe',
          details: error.errors,
        });
      }

      return reply.status(500).send({
        error: 'Wystąpił błąd podczas logowania',
      });
    }
  });

  // Register
  app.post('/api/auth/register', async (request, reply) => {
    try {
      const { email, password, name } = registerSchema.parse(request.body);

      // Check if user exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingUser) {
        return reply.status(400).send({
          error: 'Użytkownik z tym emailem już istnieje',
        });
      }

      // Hash password
      const hashedPassword = await new Argon2id().hash(password);

      // Create user
      const [user] = await db
        .insert(users)
        .values({
          id: generateId(15),
          email,
          name,
          password: hashedPassword,
        })
        .returning();

      // Create session
      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      reply.setCookie(sessionCookie.name, sessionCookie.value, {
        path: '/',
        ...sessionCookie.attributes,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Nieprawidłowe dane wejściowe',
          details: error.errors,
        });
      }

      return reply.status(500).send({
        error: 'Wystąpił błąd podczas rejestracji',
      });
    }
  });

  // Logout
  app.post('/api/auth/logout', async (request, reply) => {
    try {
      const sessionId = request.cookies[lucia.sessionCookieName];

      if (!sessionId) {
        return reply.status(401).send({
          error: 'Nie jesteś zalogowany',
        });
      }

      await lucia.invalidateSession(sessionId);

      const sessionCookie = lucia.createBlankSessionCookie();
      reply.setCookie(sessionCookie.name, sessionCookie.value, {
        path: '/',
        ...sessionCookie.attributes,
      });

      return { success: true };
    } catch (error) {
      return reply.status(500).send({
        error: 'Wystąpił błąd podczas wylogowywania',
      });
    }
  });

  // Get session
  app.get('/api/auth/session', async (request, reply) => {
    try {
      const sessionId = request.cookies[lucia.sessionCookieName];

      if (!sessionId) {
        return reply.status(401).send({
          error: 'Nie jesteś zalogowany',
        });
      }

      const { session, user } = await lucia.validateSession(sessionId);

      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        reply.setCookie(sessionCookie.name, sessionCookie.value, {
          path: '/',
          ...sessionCookie.attributes,
        });

        return reply.status(401).send({
          error: 'Nie jesteś zalogowany',
        });
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      return reply.status(500).send({
        error: 'Wystąpił błąd podczas pobierania sesji',
      });
    }
  });
} 