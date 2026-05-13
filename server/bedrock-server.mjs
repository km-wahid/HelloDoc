import 'dotenv/config';
import express from 'express';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const readEnv = (key, fallback) => {
  const value = process.env[key];
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const app = express();
const port = Number(readEnv('AI_API_PORT', '8787'));
const resolvedGeminiKey = readEnv('GEMINI_API_KEY', readEnv('API_KEY', ''));
const provider = readEnv('AI_PROVIDER', resolvedGeminiKey ? 'gemini' : 'bedrock');
const region = readEnv('AWS_REGION', 'us-east-1');
const bedrockModelId = readEnv('AWS_BEDROCK_MODEL_ID', 'anthropic.claude-3-5-sonnet-20241022-v2:0');
const geminiApiKey = resolvedGeminiKey;
const geminiModel = readEnv('GEMINI_MODEL', 'gemini-2.5-flash');

const client = new BedrockRuntimeClient({ region });

app.use(express.json({ limit: '1mb' }));

const parseBedrockText = (rawBody) => {
  const parsed = JSON.parse(rawBody);
  const chunks = Array.isArray(parsed.content) ? parsed.content : [];
  return chunks
    .filter((chunk) => chunk?.type === 'text' && typeof chunk.text === 'string')
    .map((chunk) => chunk.text)
    .join('\n')
    .trim();
};

const parseGeminiText = (rawBody) => {
  const candidates = Array.isArray(rawBody?.candidates) ? rawBody.candidates : [];
  const parts = Array.isArray(candidates[0]?.content?.parts) ? candidates[0].content.parts : [];
  return parts
    .filter((part) => typeof part?.text === 'string')
    .map((part) => part.text)
    .join('\n')
    .trim();
};

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    provider,
    region,
    bedrockModelId,
    geminiModel,
  });
});

app.post('/api/ai/message', async (req, res) => {
  try {
    const { systemPrompt, messages, maxTokens = 1400, temperature = 0.2 } = req.body ?? {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    if (provider === 'gemini') {
      if (!geminiApiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is missing.' });
      }

      try {
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
              contents: messages.map((message) => ({
                role: message.role === 'assistant' ? 'model' : 'user',
                parts: (Array.isArray(message.content) ? message.content : []).map((part) => ({ 
                  text: typeof part === 'string' ? part : (part?.text ?? '') 
                })),
              })),
              generationConfig: {
                maxOutputTokens: maxTokens,
                temperature,
              },
            }),
          },
        );

        const geminiRaw = await geminiResponse.json();
        if (!geminiResponse.ok) {
          const err = geminiRaw?.error?.message || 'Gemini request failed.';
          console.error('Gemini error:', err, geminiRaw?.error);
          return res.status(geminiResponse.status).json({ error: err });
        }

        const text = parseGeminiText(geminiRaw);
        if (!text) {
          return res.status(502).json({ error: 'No text response from Gemini model' });
        }

        return res.json({ text });
      } catch (err) {
        console.error('Gemini API error:', err.message);
        return res.status(500).json({ error: err.message || 'Gemini API error' });
      }
    }

    const command = new InvokeModelCommand({
      modelId: bedrockModelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        system: systemPrompt,
        max_tokens: maxTokens,
        temperature,
        messages,
      }),
    });

    const response = await client.send(command);
    const raw = new TextDecoder().decode(response.body);
    const text = parseBedrockText(raw);
    if (!text) {
      return res.status(502).json({ error: 'No text response from Bedrock model' });
    }

    return res.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Bedrock error';
    return res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`AI API (${provider}) listening on http://localhost:${port}`);
});
