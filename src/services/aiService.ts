import { StoredAssessment, Language } from '../types';
import { bedrockApiService } from './bedrockApiService';

export const aiService = {
  async chat(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[], language: Language, latestAssessment?: StoredAssessment | null) {
    try {
      const response = await bedrockApiService.completeText({
        systemPrompt: `You are a helpful and professional Medical AI Assistant.
Your goal is to provide accurate, empathetic, and clinical-grade information for users in Bangladesh.

User Profile Context:
${latestAssessment ? JSON.stringify(latestAssessment.data) : 'No health profile available yet.'}

Language: ${language === 'BN' ? 'Bengali' : 'English'}

Guidelines:
1. Always provide a health disclaimer: "I am an AI, not a doctor. Please consult a professional for critical issues."
2. If you detect emergency symptoms (chest pain, stroke signs, severe trauma), suggest immediate ER visit.
3. Use the user's health profile (if provided) to personalize recommendations.
4. Keep responses structured and easy to read on mobile.
5. Support both English and Bengali seamlessly.`,
        messages: [
          ...history.map((item) => ({
            role: item.role === 'model' ? 'assistant' as const : 'user' as const,
            content: [{ type: 'text' as const, text: item.parts[0]?.text || '' }],
          })),
          { role: 'user', content: [{ type: 'text', text: message }] },
        ],
      });

      return response;
    } catch (error) {
      console.error("AI Assistant Failure:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.toLowerCase().includes('credential') || errorMessage.toLowerCase().includes('security token')) {
        throw new Error('AI is not responding because AWS Bedrock credentials are missing or invalid.');
      }
      throw new Error('AI request failed. Please try again.');
    }
  }
};
