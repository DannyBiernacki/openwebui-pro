import { lucia } from 'lucia';
import { fastify } from 'lucia/middleware';
import { pg } from '@lucia-auth/adapter-postgresql';
import { pool } from './db';

export const auth = lucia({
  env: process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  middleware: fastify(),
  sessionCookie: {
    expires: false,
  },
  adapter: pg(pool, {
    user: 'auth_user',
    session: 'user_session',
    key: 'user_key',
  }),
  getUserAttributes: (data) => {
    return {
      email: data.email,
      name: data.name,
      avatar: data.avatar,
    };
  },
});

export type Auth = typeof auth; 