import axios from 'axios';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

class OllamaService {
  private client = axios.create({
    baseURL: OLLAMA_URL,
  });

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/health');
      return response.status === 200;
    } catch (error) {
      console.error('Ollama connection test failed:', error);
      return false;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await this.client.get('/api/tags');
      return response.data.models.map((model: any) => model.name);
    } catch (error) {
      console.error('Failed to fetch Ollama models:', error);
      return [];
    }
  }

  async healthCheck(): Promise<{ status: string; models: string[] }> {
    const isConnected = await this.testConnection();
    const models = isConnected ? await this.getAvailableModels() : [];
    return {
      status: isConnected ? 'ok' : 'error',
      models,
    };
  }

  async processRequest(prompt: string, model: string, options?: Record<string, unknown>): Promise<string> {
    try {
      const response = await this.client.post('/api/generate', {
        model,
        prompt,
        ...options,
      });
      return response.data.response;
    } catch (error) {
      console.error('Ollama request failed:', error);
      throw new Error('Failed to process AI request');
    }
  }
}

export const ollamaService = new OllamaService(); 