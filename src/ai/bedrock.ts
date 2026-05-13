// AWS Bedrock chat provider using Claude model
// This module handles all Bedrock-specific logic and keeps it isolated from other providers

import { getApiBaseUrl } from '../config/apiConfig';

export interface BedrockMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface BedrockResponse {
  text: string;
  requestId?: string;
}

// Initialize AWS Bedrock runtime client using environment variables
async function initializeBedrockClient() {
  try {
    // This will be called on the backend (server/bedrock-server.mjs)
    // Frontend should use the API endpoint instead
    return {
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      modelId: process.env.AWS_BEDROCK_MODEL_ID || 'anthropic.claude-opus-4-6-v1',
    };
  } catch (error) {
    throw new Error('Failed to initialize Bedrock client: ' + (error as Error).message);
  }
}

// Create a reusable AWS Bedrock chat function using Claude model
export async function chatWithBedrock(
  messages: BedrockMessage[],
  systemPrompt?: string,
  maxTokens: number = 1400,
  temperature: number = 0.2
): Promise<BedrockResponse> {
  try {
    // Call the backend API endpoint instead of directly calling Bedrock
    const apiUrl = getApiBaseUrl();
    const response = await fetch(`${apiUrl}/api/ai/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'bedrock',
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
      throw new Error(error.error || 'Bedrock request failed');
    }

    const data = (await response.json()) as { text: string };
    return {
      text: data.text,
      requestId: response.headers.get('x-request-id') || undefined,
    };
  } catch (error) {
    console.error('Bedrock chat error:', error);
    throw new Error('Failed to chat with Bedrock: ' + (error as Error).message);
  }
}

// Support streaming response from Bedrock if available (future enhancement)
export async function* streamBedrockChat(
  messages: BedrockMessage[],
  systemPrompt?: string
): AsyncGenerator<string, void, unknown> {
  try {
    const apiUrl = getApiBaseUrl();
    const response = await fetch(`${apiUrl}/api/ai/message/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'bedrock',
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
    console.error('Bedrock streaming error:', error);
  }
}

export { initializeBedrockClient };
