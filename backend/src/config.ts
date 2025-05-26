import { z } from 'zod';

const envSchema = z.object({
  // Server
  PORT: z.string().transform(Number).default('3001'),
  HOST: z.string().default('localhost'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  // Database
  DATABASE_URL: z.string().url(),

  // AI Services
  OLLAMA_URL: z.string().url().default('http://localhost:11434'),
  OPENAI_API_KEY: z.string().min(1),

  // Vector Database
  QDRANT_URL: z.string().url().default('http://localhost:6333'),
  QDRANT_API_KEY: z.string().min(1),

  // Security
  JWT_SECRET: z.string().min(32),
  COOKIE_SECRET: z.string().min(32),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export const config = envSchema.parse(process.env); 