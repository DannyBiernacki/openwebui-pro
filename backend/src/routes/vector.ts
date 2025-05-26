import { FastifyInstance } from 'fastify';
import { qdrantService } from '../services/qdrant-service.js';
import { z } from 'zod';

const vectorPointSchema = z.object({
  id: z.string(),
  vector: z.array(z.number()),
  payload: z.record(z.unknown()),
});

const createCollectionSchema = z.object({
  name: z.string(),
  vectorSize: z.number().int().positive(),
});

const searchVectorsSchema = z.object({
  collectionName: z.string(),
  queryVector: z.array(z.number()),
  limit: z.number().int().positive().optional(),
});

export async function vectorRoutes(fastify: FastifyInstance) {
  // Endpoint do tworzenia kolekcji
  fastify.post('/collections', {
    schema: {
      body: createCollectionSchema,
    },
    handler: async (request, reply) => {
      const { name, vectorSize } = createCollectionSchema.parse(request.body);
      await qdrantService.createCollection(name, vectorSize);
      return reply.code(201).send({ message: 'Collection created successfully' });
    },
  });

  // Endpoint do dodawania wektorów
  fastify.post('/collections/:collectionName/vectors', {
    schema: {
      params: z.object({
        collectionName: z.string(),
      }),
      body: z.array(vectorPointSchema),
    },
    handler: async (request, reply) => {
      const { collectionName } = request.params as { collectionName: string };
      const vectors = z.array(vectorPointSchema).parse(request.body);
      await qdrantService.upsertVectors(collectionName, vectors);
      return reply.code(201).send({ message: 'Vectors added successfully' });
    },
  });

  // Endpoint do wyszukiwania wektorów
  fastify.post('/collections/:collectionName/search', {
    schema: {
      params: z.object({
        collectionName: z.string(),
      }),
      body: searchVectorsSchema.omit({ collectionName: true }),
    },
    handler: async (request, reply) => {
      const { collectionName } = request.params as { collectionName: string };
      const { queryVector, limit } = searchVectorsSchema.omit({ collectionName: true }).parse(request.body);
      const results = await qdrantService.searchVectors(collectionName, queryVector, limit);
      return reply.send(results);
    },
  });

  // Endpoint do usuwania kolekcji
  fastify.delete('/collections/:collectionName', {
    schema: {
      params: z.object({
        collectionName: z.string(),
      }),
    },
    handler: async (request, reply) => {
      const { collectionName } = request.params as { collectionName: string };
      await qdrantService.deleteCollection(collectionName);
      return reply.send({ message: 'Collection deleted successfully' });
    },
  });
} 