import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/api-client';
import { AIRequest } from '../api/api-types';

export const useAIProcess = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AIRequest) => apiClient.processAI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiHistory'] });
    },
  });
};

export const useModelHealth = () => {
  return useQuery({
    queryKey: ['modelHealth'],
    queryFn: () => apiClient.getModelHealth(),
  });
};

export const useAIHistory = () => {
  return useQuery({
    queryKey: ['aiHistory'],
    queryFn: () => apiClient.getAIHistory(),
  });
};

// Streaming hook (przykład z fetch)
export const useStreamingResponse = (data: AIRequest) => {
  return useQuery({
    queryKey: ['streamingResponse', data],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Streaming failed');
      return response.body;
    },
    enabled: !!data.prompt,
  });
}; 