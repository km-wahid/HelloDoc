import { GoogleGenAI } from "@google/genai";
import { StoredAssessment, Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const aiService = {
  async chat(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[], language: Language, latestAssessment?: StoredAssessment | null) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...history, { role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: `You are a helpful and professional Medical AI Assistant. 
          Your goal is to provide accurate, empathetic, and clinical-grade information for users in Bangladesh.
          
          User Profile Context:
          ${latestAssessment ? JSON.stringify(latestAssessment.data) : 'No health profile available yet.'}
          
          Language: ${language === 'BN' ? 'Bengali' : 'English'}
          
          Guidelines:
          1. Always provide a health disclaimer: "I am an AI, not a doctor. Please consult a professional for critical issues."
          2. If you detect emergency symptoms (chest pain, stroke signs, severe trauma), suggest immediate ER visit.
          3. Use the user's health profile (if provided) to personalize recommendations.
          4. Keep responses structured and easy to read on mobile.
          5. Support both English and Bengali seamlessly.`
        }
      });

      return response.text;
    } catch (error) {
      console.error("AI Assistant Failure:", error);
      throw new Error("I'm having trouble thinking right now. Please try again in a moment.");
    }
  }
};
