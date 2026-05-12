type BedrockRole = 'user' | 'assistant';

export interface BedrockMessage {
  role: BedrockRole;
  content: { type: 'text'; text: string }[];
}

const requestBedrock = async (payload: {
  systemPrompt?: string;
  messages: BedrockMessage[];
  maxTokens?: number;
  temperature?: number;
}) => {
  const response = await fetch('/api/ai/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as { text?: string; error?: string };
  if (!response.ok || !data.text) {
    throw new Error(data.error || 'Bedrock request failed.');
  }

  return data.text;
};

const extractJson = <T>(text: string): T => {
  const cleaned = text.trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new Error('Model did not return valid JSON.');
  }
};

export const bedrockApiService = {
  async completeText(payload: {
    systemPrompt?: string;
    messages: BedrockMessage[];
    maxTokens?: number;
    temperature?: number;
  }) {
    return requestBedrock(payload);
  },

  async completeJson<T>(payload: {
    systemPrompt?: string;
    messages: BedrockMessage[];
    maxTokens?: number;
    temperature?: number;
  }) {
    const text = await requestBedrock(payload);
    return extractJson<T>(text);
  },
};
