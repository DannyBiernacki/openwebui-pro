import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ModelType = 'ollama' | 'openai';
export type ModelStatus = 'healthy' | 'unhealthy' | 'loading';

interface ModelMetrics {
  responseTime: number;
  tokensPerSecond: number;
  cost: number;
  lastUsed: Date;
}

interface ModelState {
  status: ModelStatus;
  metrics: ModelMetrics;
}

interface AIResponse {
  id: string;
  model: ModelType;
  prompt: string;
  response: string;
  timestamp: Date;
  metrics: ModelMetrics;
}

interface AIState {
  // Model Status
  ollamaStatus: ModelStatus;
  openAIStatus: ModelStatus;
  setModelStatus: (model: ModelType, status: ModelStatus) => void;

  // Model Metrics
  modelMetrics: Record<ModelType, ModelMetrics>;
  updateModelMetrics: (model: ModelType, metrics: Partial<ModelMetrics>) => void;

  // Active Requests
  activeRequests: string[];
  addActiveRequest: (requestId: string) => void;
  removeActiveRequest: (requestId: string) => void;

  // Response History
  responseHistory: AIResponse[];
  addResponse: (response: AIResponse) => void;
  clearHistory: () => void;

  // Streaming
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;

  // Cost Tracking
  totalCost: number;
  updateCost: (cost: number) => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      // Model Status
      ollamaStatus: 'loading',
      openAIStatus: 'loading',
      setModelStatus: (model, status) =>
        set((state) => ({
          ollamaStatus: model === 'ollama' ? status : state.ollamaStatus,
          openAIStatus: model === 'openai' ? status : state.openAIStatus,
        })),

      // Model Metrics
      modelMetrics: {
        ollama: {
          responseTime: 0,
          tokensPerSecond: 0,
          cost: 0,
          lastUsed: new Date(),
        },
        openai: {
          responseTime: 0,
          tokensPerSecond: 0,
          cost: 0,
          lastUsed: new Date(),
        },
      },
      updateModelMetrics: (model, metrics) =>
        set((state) => ({
          modelMetrics: {
            ...state.modelMetrics,
            [model]: {
              ...state.modelMetrics[model],
              ...metrics,
            },
          },
        })),

      // Active Requests
      activeRequests: [],
      addActiveRequest: (requestId) =>
        set((state) => ({
          activeRequests: [...state.activeRequests, requestId],
        })),
      removeActiveRequest: (requestId) =>
        set((state) => ({
          activeRequests: state.activeRequests.filter((id) => id !== requestId),
        })),

      // Response History
      responseHistory: [],
      addResponse: (response) =>
        set((state) => ({
          responseHistory: [...state.responseHistory, response],
        })),
      clearHistory: () => set({ responseHistory: [] }),

      // Streaming
      isStreaming: false,
      setIsStreaming: (isStreaming) => set({ isStreaming }),

      // Cost Tracking
      totalCost: 0,
      updateCost: (cost) =>
        set((state) => ({ totalCost: state.totalCost + cost })),
    }),
    {
      name: 'ai-storage',
    }
  )
); 