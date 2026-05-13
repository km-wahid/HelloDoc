import { PregnancyProgress } from '../types';
import { aiRouter } from '../ai/aiProvider';

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
      const response = await aiRouter.chat(
        [{ role: 'user', content: prompt }],
        {
          systemPrompt: 'Return only valid JSON. Do not include markdown code fences.',
          maxTokens: 1500,
        }
      );
      return extractJson<PregnancyProgress>(response.text);
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
      const response = await aiRouter.chat(
        [{ role: 'user', content: prompt }],
        { maxTokens: 800 }
      );
      return response.text;
    } catch (error) {
      return "I'm having trouble connecting to my clinical database. If you feel any discomfort, please see a doctor immediately.";
    }
  }
};
