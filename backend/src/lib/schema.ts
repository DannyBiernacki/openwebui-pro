import { pgTable, text, timestamp, uuid, integer, boolean, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Projects table
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Documents table
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  name: text('name').notNull(),
  type: text('type').notNull(), // pdf, docx, md, etc.
  status: text('status').notNull(), // processing, ready, error
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Document chunks table with vector embeddings
export const documentChunks = pgTable('document_chunks', {
  id: uuid('id').primaryKey().defaultRandom(),
  documentId: uuid('document_id').references(() => documents.id).notNull(),
  content: text('content').notNull(),
  embedding: sql`vector(1536)`, // OpenAI embedding dimension
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI requests table
export const aiRequests = pgTable('ai_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  projectId: uuid('project_id').references(() => projects.id),
  prompt: text('prompt').notNull(),
  model: text('model').notNull(), // ollama, openai
  status: text('status').notNull(), // pending, processing, completed, error
  response: text('response'),
  metrics: jsonb('metrics').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Create Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email(),
  name: z.string().min(2),
});

export const selectUserSchema = createSelectSchema(users);

export const insertProjectSchema = createInsertSchema(projects, {
  name: z.string().min(1),
});

export const selectProjectSchema = createSelectSchema(projects);

export const insertDocumentSchema = createInsertSchema(documents, {
  name: z.string().min(1),
  type: z.enum(['pdf', 'docx', 'md', 'txt']),
  status: z.enum(['processing', 'ready', 'error']),
});

export const selectDocumentSchema = createSelectSchema(documents);

export const insertAIRequestSchema = createInsertSchema(aiRequests, {
  prompt: z.string().min(1),
  model: z.enum(['ollama', 'openai']),
  status: z.enum(['pending', 'processing', 'completed', 'error']),
});

export const selectAIRequestSchema = createSelectSchema(aiRequests);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type DocumentChunk = typeof documentChunks.$inferSelect;
export type NewDocumentChunk = typeof documentChunks.$inferInsert;

export type AIRequest = typeof aiRequests.$inferSelect;
export type NewAIRequest = typeof aiRequests.$inferInsert; 