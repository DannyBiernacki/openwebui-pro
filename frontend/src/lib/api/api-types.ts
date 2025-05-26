// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface SessionResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
  };
}

export interface ErrorResponse {
  error: string;
  details?: unknown;
}

// Project Types
export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectListResponse {
  projects: Project[];
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  settings?: Record<string, unknown>;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  settings?: Record<string, unknown>;
}

// Document Types
export interface Document {
  id: string;
  projectId: string;
  name: string;
  type: string;
  status: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentListResponse {
  documents: Document[];
}

export interface UploadDocumentRequest {
  projectId: string;
  file: File;
  metadata?: Record<string, unknown>;
}

export interface ProcessDocumentRequest {
  documentId: string;
  options?: Record<string, unknown>;
}

// AI Types
export interface AIRequest {
  prompt: string;
  model: string;
  options?: Record<string, unknown>;
}

export interface AIResponse {
  response: string;
  metrics?: Record<string, unknown>;
}

export interface ModelHealthResponse {
  status: string;
  models: string[];
}

export interface AIHistoryResponse {
  requests: Array<{
    id: string;
    prompt: string;
    model: string;
    status: string;
    response?: string;
    createdAt: string;
  }>;
} 