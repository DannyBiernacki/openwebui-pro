import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';

export async function up(db: any) {
  // Enable pgvector extension
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector;`);

  // Create users table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      avatar TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // Create projects table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      description TEXT,
      settings JSONB DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // Create documents table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      project_id UUID NOT NULL REFERENCES projects(id),
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // Create document chunks table with vector support
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS document_chunks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      document_id UUID NOT NULL REFERENCES documents(id),
      content TEXT NOT NULL,
      embedding vector(1536),
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // Create AI requests table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ai_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id),
      project_id UUID REFERENCES projects(id),
      prompt TEXT NOT NULL,
      model TEXT NOT NULL,
      status TEXT NOT NULL,
      response TEXT,
      metrics JSONB DEFAULT '{}',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  // Create indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
    CREATE INDEX IF NOT EXISTS idx_documents_project_id ON documents(project_id);
    CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON document_chunks(document_id);
    CREATE INDEX IF NOT EXISTS idx_ai_requests_user_id ON ai_requests(user_id);
    CREATE INDEX IF NOT EXISTS idx_ai_requests_project_id ON ai_requests(project_id);
  `);
}

export async function down(db: any) {
  // Drop tables in reverse order
  await db.execute(sql`DROP TABLE IF EXISTS ai_requests;`);
  await db.execute(sql`DROP TABLE IF EXISTS document_chunks;`);
  await db.execute(sql`DROP TABLE IF EXISTS documents;`);
  await db.execute(sql`DROP TABLE IF EXISTS projects;`);
  await db.execute(sql`DROP TABLE IF EXISTS users;`);
  await db.execute(sql`DROP EXTENSION IF EXISTS vector;`);
} 