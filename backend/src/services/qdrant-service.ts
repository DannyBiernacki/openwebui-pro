import { QdrantClient } from '@qdrant/js-client-rest';

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

interface VectorPoint {
  id: string;
  vector: number[];
  payload: Record<string, unknown>;
}

interface SearchResult {
  id: string;
  score: number;
  payload: Record<string, unknown>;
}

class QdrantService {
  private client: QdrantClient;

  constructor() {
    this.client = new QdrantClient({
      url: QDRANT_URL,
      apiKey: QDRANT_API_KEY,
    });
  }

  async createCollection(collectionName: string, vectorSize: number): Promise<void> {
    try {
      await this.client.createCollection(collectionName, {
        vectors: {
          size: vectorSize,
          distance: 'Cosine',
        },
      });
    } catch (error) {
      console.error('Failed to create collection:', error);
      throw new Error('Failed to create vector collection');
    }
  }

  async upsertVectors(collectionName: string, vectors: VectorPoint[]): Promise<void> {
    try {
      await this.client.upsert(collectionName, { points: vectors });
    } catch (error) {
      console.error('Failed to upsert vectors:', error);
      throw new Error('Failed to store vectors');
    }
  }

  async searchVectors(collectionName: string, queryVector: number[], limit: number = 5): Promise<SearchResult[]> {
    try {
      const response = await this.client.search(collectionName, {
        vector: queryVector,
        limit,
      });
      return response.map(({ id, score, payload }) => ({
        id: id.toString(),
        score,
        payload: payload as Record<string, unknown>,
      }));
    } catch (error) {
      console.error('Failed to search vectors:', error);
      throw new Error('Failed to search vectors');
    }
  }

  async deleteCollection(collectionName: string): Promise<void> {
    try {
      await this.client.deleteCollection(collectionName);
    } catch (error) {
      console.error('Failed to delete collection:', error);
      throw new Error('Failed to delete vector collection');
    }
  }
}

export const qdrantService = new QdrantService(); 