// Google Gemini chat provider
// This module handles all Gemini-specific logic and keeps it isolated from other providers

import { getApiBaseUrl } from '../config/apiConfig';

export interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiResponse {
  text: string;
  requestId?: string;
}

// Create a reusable Gemini chat function
export async function chatWithGemini(
  messages: GeminiMessage[],
  systemPrompt?: string,
  maxTokens: number = 1400,
  temperature: number = 0.2
): Promise<GeminiResponse> {
  try {
    // Call the backend API endpoint instead of directly calling Gemini
    const apiUrl = getApiBaseUrl();
    const response = await fetch(`${apiUrl}/api/ai/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'gemini',
        messages: messages.map((msg) => ({
          role: msg.role,
          content: [{ type: 'text', text: msg.content }],
        })),
        systemPrompt,
        maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Gemini request failed');
    }

    const data = (await response.json()) as { text: string };
    return {
      text: data.text,
      requestId: response.headers.get('x-request-id') || undefined,
    };
  } catch (error) {
    console.error('Gemini chat error:', error);
    throw new Error('Failed to chat with Gemini: ' + (error as Error).message);
  }
}

// Support streaming response from Gemini if available (future enhancement)
export async function* streamGeminiChat(
  messages: GeminiMessage[],
  systemPrompt?: string
): AsyncGenerator<string, void, unknown> {
  try {
    const apiUrl = getApiBaseUrl();
    const response = await fetch(`${apiUrl}/api/ai/message/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'gemini',
        messages: messages.map((msg) => ({
          role: msg.role,
          content: [{ type: 'text', text: msg.content }],
        })),
        systemPrompt,
      }),
    });

    if (!response.ok) {
      throw new Error('Streaming not available');
    }

    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value);
    }
  } catch (error) {
    console.error('Gemini streaming error:', error);
  }
}
