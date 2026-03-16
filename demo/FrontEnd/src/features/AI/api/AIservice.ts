import { apiFetch } from '@/lib/apiClient';

export type AIRequest = {
  prompt: string;
};

export type AIResponse = {
  id: number;
  response: string;
};

export const getAIResponse = async (data: AIRequest) => {
  return apiFetch<AIResponse>('/AIsuggestion', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
