import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { logger } from './lib/logger';
import { registerRoutes } from './routes';
import { registerPlugins } from './plugins';

/**
 * Konfiguracja serwera Fastify z optymalizacjami dla M4 Pro
 */
export async function createServer(): Promise<FastifyInstance> {
  const server = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    // Optymalizacje dla M4 Pro
    bodyLimit: 30 * 1024 * 1024, // 30MB
    maxParamLength: 1000,
    trustProxy: true,
    // Wykorzystanie wszystkich rdzeni M4 Pro
    workers: 10,
    // Optymalizacja pamięci
    maxRequestsPerSocket: 1000,
    keepAliveTimeout: 60000,
  });

  // Rejestracja pluginów
  await registerPlugins(server);

  // Konfiguracja CORS
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    maxAge: 86400, // 24h
  });

  // Rate limiting
  await server.register(rateLimit, {
    max: 1000,
    timeWindow: '1 minute',
    // Optymalizacja dla M4 Pro
    redis: process.env.REDIS_URL ? {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    } : undefined,
  });

  // Health check endpoint
  server.get('/health', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            uptime: { type: 'number' },
            memory: { type: 'object' },
            cpu: { type: 'object' },
          },
        },
      },
    },
  }, async () => {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      },
      cpu: {
        user: `${Math.round(cpuUsage.user / 1000)}ms`,
        system: `${Math.round(cpuUsage.system / 1000)}ms`,
      },
    };
  });

  // Rejestracja routingu
  await registerRoutes(server);

  // Error handling
  server.setErrorHandler((error, request, reply) => {
    logger.error({
      error: error.message,
      stack: error.stack,
      path: request.url,
      method: request.method,
    });

    reply.status(error.statusCode || 500).send({
      error: {
        message: error.message,
        code: error.code || 'INTERNAL_SERVER_ERROR',
      },
    });
  });

  return server;
}

/**
 * Uruchomienie serwera
 */
export async function startServer() {
  try {
    const server = await createServer();
    const port = parseInt(process.env.PORT || '3000');

    await server.listen({ 
      port,
      host: '0.0.0.0',
    });

    logger.info(`Server listening on port ${port}`);

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'] as const;
    for (const signal of signals) {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, shutting down gracefully`);
        await server.close();
        process.exit(0);
      });
    }
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
} 