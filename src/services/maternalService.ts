import { GoogleGenAI, Type } from "@google/genai";
import { PregnancyProgress } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const maternalService = {
  async getWeeklyInsights(week: number, language: 'EN' | 'BN' = 'EN'): Promise<PregnancyProgress> {
    const prompt = `Provide specialized maternal health guidance for week ${week} of pregnancy in ${language === 'BN' ? 'Bengali' : 'English'}.
    Include baby growth status, size description (compared to a fruit), health guidance, nutrition (localized for Bangladesh if language is Bengali), safe exercises, medicine reminders (folic acid, etc), vaccination reminders (TT, etc), and emergency warnings.
    
    STRICT JSON SCHEMA:
    {
      "week": number,
      "babyGrowth": string,
      "babySizeDesc": string,
      "guidance": [string],
      "nutrition": [string],
      "exercise": [string],
      "warnings": [string],
      "medicineReminders": [string],
      "vaccinationReminders": [string]
    }`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              week: { type: Type.NUMBER },
              babyGrowth: { type: Type.STRING },
              babySizeDesc: { type: Type.STRING },
              guidance: { type: Type.ARRAY, items: { type: Type.STRING } },
              nutrition: { type: Type.ARRAY, items: { type: Type.STRING } },
              exercise: { type: Type.ARRAY, items: { type: Type.STRING } },
              warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
              medicineReminders: { type: Type.ARRAY, items: { type: Type.STRING } },
              vaccinationReminders: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["week", "babyGrowth", "babySizeDesc", "guidance", "nutrition", "exercise", "warnings", "medicineReminders", "vaccinationReminders"]
          }
        }
      });

      return JSON.parse(response.text) as PregnancyProgress;
    } catch (error) {
      console.error("Maternal Insights Failure:", error);
      // Fallback data
      return {
        week,
        babyGrowth: "Developing heartbeat and major organs.",
        babySizeDesc: "Size of an Olive",
        guidance: ["Rest well", "Stay hydrated"],
        nutrition: ["Iron-rich foods", "Folic acid"],
        exercise: ["Walking", "Gentle stretching"],
        warnings: ["Severe abdominal pain", "Heavy bleeding"],
        medicineReminders: ["Folic Acid - 400mcg daily"],
        vaccinationReminders: ["TT Vaccination (Consult Doctor)"]
      };
    }
  },

  async askMaternalAI(question: string, context: { week: number, healthData: any }, language: 'EN' | 'BN' = 'EN') {
    const prompt = `You are a specialized Maternal Health AI assistant. 
    Context: Patient is at week ${context.week} of pregnancy.
    Health State: ${JSON.stringify(context.healthData)}
    Language: ${language === 'BN' ? 'Bengali' : 'English'}
    
    Question: ${question}
    
    Rules:
    1. Provide empathetic, scientifically accurate advice.
    2. If symptoms sound critical (high BP, bleeding, no movement), MANDATE an immediate clinic visit.
    3. Keep responses concise and formatted for mobile view.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      return response.text;
    } catch (error) {
      return "I'm having trouble connecting to my clinical database. If you feel any discomfort, please see a doctor immediately.";
    }
  }
};
