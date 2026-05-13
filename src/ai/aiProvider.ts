// Unified AI Provider Interface
// This module creates a single interface that supports multiple AI providers like Gemini and Bedrock
// Routes requests to the appropriate provider based on configuration

import { chatWithGemini, streamGeminiChat, type GeminiMessage, type GeminiResponse } from './gemini';
import { chatWithBedrock, streamBedrockChat, type BedrockMessage, type BedrockResponse } from './bedrock';

export type AIProvider = 'gemini' | 'bedrock';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  text: string;
  requestId?: string;
  provider: AIProvider;
}

export interface ChatOptions {
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  provider?: AIProvider;
}

class AIRouter {
  private defaultProvider: AIProvider = 'gemini';

  constructor(provider?: AIProvider) {
    if (provider) {
      this.defaultProvider = provider;
    }
  }

  setProvider(provider: AIProvider) {
    this.defaultProvider = provider;
  }

  getProvider(): AIProvider {
    return this.defaultProvider;
  }

  // Main chat function that routes to the appropriate provider
  async chat(messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResponse> {
    const provider = options.provider || this.defaultProvider;
    const { systemPrompt, maxTokens = 1400, temperature = 0.2 } = options;

    try {
      if (provider === 'bedrock') {
        const response = await chatWithBedrock(
          messages as BedrockMessage[],
          systemPrompt,
          maxTokens,
          temperature
        );
        return { ...response, provider: 'bedrock' };
      }

      // Default to Gemini
      const response = await chatWithGemini(
        messages as GeminiMessage[],
        systemPrompt,
        maxTokens,
        temperature
      );
      return { ...response, provider: 'gemini' };
    } catch (error) {
      console.error(`Chat error with ${provider}:`, error);
      throw error;
    }
  }

  // Stream chat function for real-time responses
  async *stream(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    const provider = options.provider || this.defaultProvider;
    const { systemPrompt } = options;

    try {
      if (provider === 'bedrock') {
        yield* streamBedrockChat(messages as BedrockMessage[], systemPrompt);
      } else {
        yield* streamGeminiChat(messages as GeminiMessage[], systemPrompt);
      }
    } catch (error) {
      console.error(`Stream error with ${provider}:`, error);
      throw error;
    }
  }

  // Health check to verify provider is working
  async healthCheck(): Promise<{ provider: AIProvider; ok: boolean; message: string }> {
    try {
      const testMessages: ChatMessage[] = [
        { role: 'user', content: 'respond with "ok"' },
      ];

      await this.chat(testMessages, { maxTokens: 10 });

      return {
        provider: this.defaultProvider,
        ok: true,
        message: `${this.defaultProvider} provider is healthy`,
      };
    } catch (error) {
      return {
        provider: this.defaultProvider,
        ok: false,
        message: `${this.defaultProvider} provider check failed: ${(error as Error).message}`,
      };
    }
  }
}

// Export singleton instance
export const aiRouter = new AIRouter();

// Export for testing/custom initialization
export { AIRouter };
