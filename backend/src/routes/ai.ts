import { FastifyInstance } from 'fastify';
import { aiService } from '../services/ai-service.js';
import { z } from 'zod';

const processRequestSchema = z.object({
  prompt: z.string().min(1),
  model: z.string(),
  options: z.record(z.unknown()).optional(),
});

export async function aiRoutes(fastify: FastifyInstance) {
  // Endpoint do przetwarzania zapytań AI
  fastify.post('/process', {
    schema: {
      body: processRequestSchema,
    },
    handler: async (request, reply) => {
      const { prompt, model, options } = processRequestSchema.parse(request.body);
      const response = await aiService.processRequest({ prompt, model, options });
      return reply.send(response);
    },
  });

  // Endpoint do pobierania dostępnych modeli
  fastify.get('/models', async (request, reply) => {
    const models = await aiService.getAvailableModels();
    return reply.send(models);
  });

  // Endpoint do pobierania kosztów
  fastify.get('/costs', async (request, reply) => {
    const costs = await aiService.getCosts();
    return reply.send(costs);
  });
} 