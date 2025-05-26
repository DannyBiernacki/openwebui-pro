import { type FastifyInstance, type FastifyRequest, type FastifyReply } from 'fastify';
import { z } from 'zod';
import { rateLimit } from '@fastify/rate-limit';
import { authenticate } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { ApiError } from '@/lib/errors';

/**
 * @route POST /api/example
 * @description Przykładowy endpoint API z walidacją i obsługą błędów
 * 
 * @schema
 * ```typescript
 * {
 *   body: {
 *     type: 'object',
 *     required: ['name', 'email'],
 *     properties: {
 *       name: { type: 'string' },
 *       email: { type: 'string', format: 'email' }
 *     }
 *   }
 * }
 * ```
 */
const requestSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  metadata: z.record(z.unknown()).optional(),
});

type RequestBody = z.infer<typeof requestSchema>;

/**
 * @middleware
 * - Rate limiting: 100 requestów na minutę
 * - Authentication: Wymagany token JWT
 * - Validation: Walidacja schematu Zod
 */
export async function exampleRoute(fastify: FastifyInstance) {
  // Rate limiting
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Route handler
  fastify.post<{ Body: RequestBody }>(
    '/api/example',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            metadata: { type: 'object' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: { type: 'object' },
            },
          },
        },
      },
      preHandler: [authenticate],
    },
    async (request: FastifyRequest<{ Body: RequestBody }>, reply: FastifyReply) => {
      try {
        // Walidacja request body
        const validatedData = requestSchema.parse(request.body);

        // Logowanie requestu
        logger.info('Przetwarzanie requestu', {
          path: request.url,
          method: request.method,
          body: validatedData,
        });

        // Przetwarzanie danych
        const result = await processData(validatedData);

        // Wysyłanie odpowiedzi
        return reply.status(200).send({
          success: true,
          data: result,
        });
      } catch (error) {
        // Obsługa błędów
        if (error instanceof z.ZodError) {
          throw new ApiError('Validation Error', 400, error.errors);
        }

        if (error instanceof ApiError) {
          throw error;
        }

        // Logowanie nieoczekiwanych błędów
        logger.error('Nieoczekiwany błąd', {
          error,
          path: request.url,
          method: request.method,
        });

        throw new ApiError('Internal Server Error', 500);
      }
    }
  );
}

/**
 * @function processData
 * @description Przykładowa funkcja przetwarzająca dane
 */
async function processData(data: RequestBody) {
  // Tutaj implementacja przetwarzania danych
  return {
    id: '123',
    ...data,
    processedAt: new Date().toISOString(),
  };
}

// Eksport typów
export type { RequestBody }; 