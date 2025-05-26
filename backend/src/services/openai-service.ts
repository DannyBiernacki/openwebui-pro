import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1';

class OpenAIService {
  private client = axios.create({
    baseURL: OPENAI_URL,
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  private costTracker: Record<string, number> = {};

  async processRequest(prompt: string, model: string, options?: Record<string, unknown>): Promise<string> {
    try {
      const response = await this.client.post('/chat/completions', {
        model,
        messages: [{ role: 'user', content: prompt }],
        ...options,
      });
      const cost = this.calculateCost(response.data, model);
      this.trackCost(model, cost);
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI request failed:', error);
      throw new Error('Failed to process AI request');
    }
  }

  private calculateCost(data: any, model: string): number {
    // Przykładowa logika obliczania kosztów (do dostosowania)
    const tokens = data.usage.total_tokens;
    const costPerToken = model.includes('gpt-4') ? 0.03 : 0.002;
    return tokens * costPerToken;
  }

  private trackCost(model: string, cost: number): void {
    this.costTracker[model] = (this.costTracker[model] || 0) + cost;
  }

  getCosts(): Record<string, number> {
    return this.costTracker;
  }
}

export const openAIService = new OpenAIService(); 