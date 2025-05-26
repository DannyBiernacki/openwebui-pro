import { ollamaService } from './ollama-service.js';
import { openAIService } from './openai-service.js';

interface AIRequest {
  prompt: string;
  model: string;
  options?: Record<string, unknown>;
}

interface AIResponse {
  text: string;
  model: string;
  provider: 'ollama' | 'openai';
  metrics?: {
    tokens?: number;
    cost?: number;
    latency?: number;
  };
}

class AIService {
  private async processWithOllama(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const response = await ollamaService.processRequest(request.prompt, request.model, request.options);
    const latency = Date.now() - startTime;

    return {
      text: response,
      model: request.model,
      provider: 'ollama',
      metrics: {
        latency,
      },
    };
  }

  private async processWithOpenAI(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const response = await openAIService.processRequest(request.prompt, request.model, request.options);
    const latency = Date.now() - startTime;

    return {
      text: response,
      model: request.model,
      provider: 'openai',
      metrics: {
        latency,
      },
    };
  }

  async processRequest(request: AIRequest): Promise<AIResponse> {
    try {
      // Najpierw próbujemy z Ollamą
      const ollamaHealth = await ollamaService.healthCheck();
      if (ollamaHealth.status === 'healthy') {
        return this.processWithOllama(request);
      }
    } catch (error) {
      console.warn('Ollama service unavailable, falling back to OpenAI:', error);
    }

    // Fallback do OpenAI
    return this.processWithOpenAI(request);
  }

  async getAvailableModels(): Promise<Array<{ id: string; provider: 'ollama' | 'openai' }>> {
    const [ollamaModels, openAIModels] = await Promise.all([
      ollamaService.getAvailableModels(),
      ['gpt-3.5-turbo', 'gpt-4'], // Przykładowe modele OpenAI
    ]);

    return [
      ...ollamaModels.map((model: string) => ({ id: model, provider: 'ollama' as const })),
      ...openAIModels.map((model: string) => ({ id: model, provider: 'openai' as const })),
    ];
  }

  async getCosts(): Promise<Record<string, number>> {
    return openAIService.getCosts();
  }
}

export const aiService = new AIService(); 