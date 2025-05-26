import Fastify from 'fastify';
import cors from '@fastify/cors';
import { aiRoutes } from './routes/ai.js';
import { vectorRoutes } from './routes/vector.js';

const app = Fastify({
  logger: true,
});

// Konfiguracja CORS
await app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});

// Rejestracja routów
app.register(aiRoutes, { prefix: '/api/ai' });
app.register(vectorRoutes, { prefix: '/api/vector' });

// Endpoint health check
app.get('/health', async () => {
  return { status: 'ok' };
});

// Obsługa błędów
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  reply.status(500).send({
    error: 'Internal Server Error',
    message: error.message,
  });
});

export default app; 