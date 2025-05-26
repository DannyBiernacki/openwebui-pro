import { type FastifyRequest } from 'fastify';
import { type Pool } from 'pg';

/**
 * Typy dla AI
 */
export interface ModelConfig {
  provider: 'ollama' | 'openai';
  contextWindow: number;
  maxTokens: number;
  temperature: number;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIRequest {
  model: string;
  messages: AIMessage[];
  stream?: boolean;
  fallback?: string;
}

export interface AIUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AIResponse {
  model: string;
  content: string;
  usage: AIUsage;
  latency: number;
}

export interface AIStreamChunk {
  model: string;
  content: string;
  done: boolean;
  latency: number;
}

/**
 * Typy dla bazy danych
 */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  content: string;
  embedding: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

/**
 * Typy dla API
 */
export interface ApiError extends Error {
  statusCode: number;
  code: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

/**
 * Typy dla autoryzacji
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthRequest extends FastifyRequest {
  user?: AuthUser;
}

/**
 * Typy dla loggera
 */
export interface LogContext {
  [key: string]: unknown;
}

export interface Logger {
  info(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
}

/**
 * Typy dla konfiguracji
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  pool: Pool;
}

export interface AIConfig {
  ollama: {
    host: string;
    timeout: number;
    maxRetries: number;
  };
  openai: {
    apiKey: string;
    timeout: number;
    maxRetries: number;
  };
}

export interface ServerConfig {
  port: number;
  host: string;
  cors: {
    origin: string[];
    methods: string[];
    credentials: boolean;
    maxAge: number;
  };
  rateLimit: {
    max: number;
    timeWindow: number;
  };
}

/**
 * Typy dla migracji
 */
export interface Migration {
  name: string;
  up: string;
  down: string;
}

/**
 * Typy dla testów
 */
export interface TestContext {
  db: Pool;
  server: any;
  user: AuthUser;
  token: string;
}

// Eksport wszystkich typów
export type {
  Pool,
  FastifyRequest,
}; 