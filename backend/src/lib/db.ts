import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { config } from '../config.js';
import * as schema from './schema.js';

// Create connection pool
const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

// Create Drizzle instance
export const db = drizzle(pool, { schema });

// Export types
export type Database = typeof db;

// Funkcja pomocnicza do wykonywania transakcji
export async function withTransaction<T>(callback: (db: typeof db) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(drizzle(client, { schema }));
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
} 