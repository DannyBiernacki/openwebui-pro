import { Ollama } from 'ollama';
import OpenAI from 'openai';
import { logger } from './logger';
import { type AIResponse, type AIRequest, type ModelConfig } from '../types';

/**
 * Konfiguracja modeli AI
 */
const MODELS: Record<string, ModelConfig> = {
  'llama2': {
    provider: 'ollama',
    contextWindow: 4096,
    maxTokens: 2048,
    temperature: 0.7,
  },
  'mistral': {
    provider: 'ollama',
    contextWindow: 8192,
    maxTokens: 4096,
    temperature: 0.7,
  },
  'gpt-4': {
    provider: 'openai',
    contextWindow: 8192,
    maxTokens: 4096,
    temperature: 0.7,
  },
  'gpt-3.5-turbo': {
    provider: 'openai',
    contextWindow: 4096,
    maxTokens: 2048,
    temperature: 0.7,
  },
};

/**
 * Inicjalizacja klientów AI
 */
const ollama = new Ollama({
  host: process.env.OLLAMA_HOST || 'http://localhost:11434',
  // Optymalizacje dla M4 Pro
  timeout: 30000,
  maxRetries: 3,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Optymalizacje dla M4 Pro
  timeout: 30000,
  maxRetries: 3,
});

/**
 * Sprawdzenie dostępności modeli
 */
export async function checkModelHealth(): Promise<Record<string, boolean>> {
  const health: Record<string, boolean> = {};

  try {
    // Sprawdzenie Ollama
    const ollamaModels = await ollama.list();
    for (const model of ollamaModels.models) {
      health[model.name] = true;
    }
  } catch (error) {
    logger.error('Ollama health check failed:', error);
  }

  try {
    // Sprawdzenie OpenAI
    const openaiModels = await openai.models.list();
    for (const model of openaiModels.data) {
      health[model.id] = true;
    }
  } catch (error) {
    logger.error('OpenAI health check failed:', error);
  }

  return health;
}

/**
 * Wybór najlepszego modelu na podstawie dostępności i kosztów
 */
function selectModel(request: AIRequest): string {
  const { model, fallback } = request;
  const modelConfig = MODELS[model];

  if (!modelConfig) {
    throw new Error(`Model ${model} not found`);
  }

  // Sprawdzenie dostępności modelu
  if (modelConfig.provider === 'ollama') {
    return model;
  }

  // Fallback do Ollama jeśli OpenAI niedostępne
  if (fallback && MODELS[fallback]?.provider === 'ollama') {
    return fallback;
  }

  return model;
}

/**
 * Przetwarzanie requestu AI
 */
export async function processAIRequest(request: AIRequest): Promise<AIResponse> {
  const model = selectModel(request);
  const modelConfig = MODELS[model];
  const startTime = Date.now();

  try {
    if (modelConfig.provider === 'ollama') {
      const response = await ollama.chat({
        model,
        messages: request.messages,
        stream: request.stream,
        options: {
          temperature: modelConfig.temperature,
          num_predict: modelConfig.maxTokens,
        },
      });

      return {
        model,
        content: response.message.content,
        usage: {
          promptTokens: response.prompt_eval_count,
          completionTokens: response.eval_count,
          totalTokens: response.prompt_eval_count + response.eval_count,
        },
        latency: Date.now() - startTime,
      };
    } else {
      const response = await openai.chat.completions.create({
        model,
        messages: request.messages,
        stream: request.stream,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens,
      });

      return {
        model,
        content: response.choices[0].message.content,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
        latency: Date.now() - startTime,
      };
    }
  } catch (error) {
    logger.error('AI request failed:', error);
    throw error;
  }
}

/**
 * Streaming response
 */
export async function* streamAIResponse(request: AIRequest) {
  const model = selectModel(request);
  const modelConfig = MODELS[model];
  const startTime = Date.now();

  try {
    if (modelConfig.provider === 'ollama') {
      const stream = await ollama.chat({
        model,
        messages: request.messages,
        stream: true,
        options: {
          temperature: modelConfig.temperature,
          num_predict: modelConfig.maxTokens,
        },
      });

      for await (const chunk of stream) {
        yield {
          model,
          content: chunk.message.content,
          done: false,
          latency: Date.now() - startTime,
        };
      }
    } else {
      const stream = await openai.chat.completions.create({
        model,
        messages: request.messages,
        stream: true,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens,
      });

      for await (const chunk of stream) {
        yield {
          model,
          content: chunk.choices[0]?.delta?.content || '',
          done: chunk.choices[0]?.finish_reason === 'stop',
          latency: Date.now() - startTime,
        };
      }
    }
  } catch (error) {
    logger.error('AI streaming failed:', error);
    throw error;
  }
}

// Eksport typów
export type { AIResponse, AIRequest, ModelConfig } from '../types'; 