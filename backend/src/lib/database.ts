import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { logger } from './logger';

/**
 * Konfiguracja połączenia z PostgreSQL
 */
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  // Optymalizacje dla M4 Pro
  max: 20, // Maksymalna liczba połączeń
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // Wykorzystanie wszystkich rdzeni
  maxUses: 7500,
  // Optymalizacja pamięci
  statement_timeout: 30000,
  query_timeout: 30000,
});

// Inicjalizacja Drizzle ORM
export const db = drizzle(pool);

/**
 * Inicjalizacja bazy danych
 */
export async function initDatabase() {
  try {
    // Sprawdzenie połączenia
    const client = await pool.connect();
    logger.info('Connected to PostgreSQL');

    // Włączenie rozszerzenia pgvector
    await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
    logger.info('pgvector extension enabled');

    // Migracje
    await migrate(db, { migrationsFolder: './drizzle' });
    logger.info('Database migrations completed');

    client.release();
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}

/**
 * Zamknięcie połączenia z bazą danych
 */
export async function closeDatabase() {
  try {
    await pool.end();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
}

// Typy dla pgvector
export type Vector = number[];

// Helper do tworzenia wektorów
export function createVector(dimensions: number): Vector {
  return new Array(dimensions).fill(0);
}

// Helper do normalizacji wektorów
export function normalizeVector(vector: Vector): Vector {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / magnitude);
}

// Helper do obliczania podobieństwa kosinusowego
export function cosineSimilarity(a: Vector, b: Vector): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same dimensions');
  }

  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  return dotProduct / (magnitudeA * magnitudeB);
}

// Eksport typów
export type { Pool } from 'pg'; 