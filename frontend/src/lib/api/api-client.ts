import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { LoginRequest, LoginResponse, RegisterRequest, SessionResponse, ErrorResponse, ProjectListResponse, CreateProjectRequest, UpdateProjectRequest, Project, DocumentListResponse, UploadDocumentRequest, ProcessDocumentRequest, Document, AIRequest, AIResponse, ModelHealthResponse, AIHistoryResponse } from './api-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // Możesz dodać token autoryzacyjny, jeśli jest dostępny
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error: unknown) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 401) {
          // Obsługa wygaśnięcia sesji
          // localStorage.removeItem('token');
          // window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/api/auth/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<SessionResponse> {
    const response = await this.client.post<SessionResponse>('/api/auth/register', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.client.post('/api/auth/logout');
  }

  async getSession(): Promise<SessionResponse> {
    const response = await this.client.get<SessionResponse>('/api/auth/session');
    return response.data;
  }

  // Project endpoints
  async getProjects(): Promise<ProjectListResponse> {
    const response = await this.client.get<ProjectListResponse>('/api/projects');
    return response.data;
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await this.client.post<Project>('/api/projects', data);
    return response.data;
  }

  async updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
    const response = await this.client.put<Project>(`/api/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.client.delete(`/api/projects/${id}`);
  }

  // Document endpoints
  async getDocuments(projectId: string): Promise<DocumentListResponse> {
    const response = await this.client.get<DocumentListResponse>(`/api/documents?projectId=${projectId}`);
    return response.data;
  }

  async uploadDocument(data: UploadDocumentRequest): Promise<Document> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('projectId', data.projectId);
    if (data.metadata) {
      formData.append('metadata', JSON.stringify(data.metadata));
    }
    const response = await this.client.post<Document>('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async processDocument(data: ProcessDocumentRequest): Promise<Document> {
    const response = await this.client.post<Document>(`/api/documents/${data.documentId}/process`, data.options);
    return response.data;
  }

  async deleteDocument(id: string): Promise<void> {
    await this.client.delete(`/api/documents/${id}`);
  }

  // AI endpoints
  async processAI(data: AIRequest): Promise<AIResponse> {
    const response = await this.client.post<AIResponse>('/api/ai/process', data);
    return response.data;
  }

  async getModelHealth(): Promise<ModelHealthResponse> {
    const response = await this.client.get<ModelHealthResponse>('/api/ai/health');
    return response.data;
  }

  async getAIHistory(): Promise<AIHistoryResponse> {
    const response = await this.client.get<AIHistoryResponse>('/api/ai/history');
    return response.data;
  }
}

export const apiClient = new ApiClient(); 