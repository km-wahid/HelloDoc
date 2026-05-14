import { HealthAssessment, HealthReport, StoredAssessment } from '../types';
import { authService } from './authService';
import { aiRouter } from '../ai/aiProvider';

const ASSESSMENTS_STORAGE_KEY = 'hellodoc_assessments';

type StoredAssessmentRecord = StoredAssessment & {
  updatedAt?: string;
  createdAt: string;
};

const getStoredAssessments = (): StoredAssessmentRecord[] => {
  const raw = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredAssessmentRecord[];
  } catch {
    return [];
  }
};

const saveStoredAssessments = (assessments: StoredAssessmentRecord[]) => {
  localStorage.setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(assessments));
};

const createId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `assessment-${Date.now()}`);

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

export const assessmentService = {
  async saveAssessment(data: HealthAssessment): Promise<string> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) throw new Error('Unauthenticated activity detected.');

    const id = createId();
    const assessments = getStoredAssessments();
    assessments.push({
      id,
      userId,
      status: 'pending',
      data,
      createdAt: new Date().toISOString(),
    });
    saveStoredAssessments(assessments);
    return id;
  },

  async generateAIReport(data: HealthAssessment): Promise<HealthReport> {
    const prompt = `Analyze this comprehensive health profile and provide a clinical-grade assessment in JSON format.
    
    PATIENT DATA:
    ${JSON.stringify(data, null, 2)}
    
    REQUIREMENTS:
    1. Calculate a healthScore (0-100).
    2. Identify specific risks (Lifestyle, BMI, Diabetes, Hypertension, Heart, Mental Stress, Nutrition, Sleep).
    3. Categorize each risk level (Low, Medium, High).
    4. Provide personalized recommendations and suggested medical tests.
    5. Suggest appropriate specialists.
    6. Include a lifestyle improvement plan.
    7. Provide medical reasoning and confidence level (0-1).
    
    STRICT JSON SCHEMA:
    {
      "healthScore": number,
      "risks": [{"category": string, "level": "Low"|"Medium"|"High", "description": string, "confidence": number}],
      "recommendations": [string],
      "suggestedTests": [string],
      "suggestedSpecialists": [string],
      "lifestylePlan": [string],
      "medicalReasoning": string
    }`;

    try {
      const response = await aiRouter.chat(
        [{ role: 'user', content: prompt }],
        {
          systemPrompt: `You are a medical health assessment AI. Return only valid JSON without markdown code fences or explanations. 
Be specific, actionable, and user-friendly in descriptions. Use clear language, not medical jargon.`,
          maxTokens: 2000,
          temperature: 0.3,
        }
      );
      return extractJson<HealthReport>(response.text);
    } catch (error) {
      console.error("AI Analysis Engine Failure:", error);
      throw new Error("Failed to generate AI clinical report.");
    }
  },

  async updateAssessmentWithReport(id: string, report: HealthReport): Promise<void> {
    const assessments = getStoredAssessments();
    const index = assessments.findIndex((assessment) => assessment.id === id);
    if (index === -1) {
      throw new Error('Assessment not found.');
    }
    assessments[index] = {
      ...assessments[index],
      report,
      status: 'completed',
      updatedAt: new Date().toISOString()
    };
    saveStoredAssessments(assessments);
  },

  async getLatestAssessment(): Promise<StoredAssessment | null> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) return null;

    const latest = getStoredAssessments()
      .filter((assessment) => assessment.userId === userId && assessment.status === 'completed')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    return latest ?? null;
  }
};
