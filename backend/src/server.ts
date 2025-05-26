import fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { authRoutes } from './routes/auth';
import { projectRoutes } from './routes/projects';
import { documentRoutes } from './routes/documents';
import { aiRoutes } from './routes/ai';

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
});

// Register plugins
server.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});

server.register(cookie);

// Register routes
server.register(authRoutes);
server.register(projectRoutes, { prefix: '/api/projects' });
server.register(documentRoutes, { prefix: '/api/documents' });
server.register(aiRoutes, { prefix: '/api/ai' });

// Health check
server.get('/health', async () => {
  return { status: 'ok' };
});

// Start server
const start = async () => {
  try {
    await server.listen({
      port: parseInt(process.env.PORT || '3001'),
      host: '0.0.0.0',
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start(); 