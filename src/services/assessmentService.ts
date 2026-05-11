import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { GoogleGenAI, Type } from "@google/genai";
import { db, auth } from '../lib/firebase';
import { HealthAssessment, HealthReport, StoredAssessment } from '../types';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const assessmentService = {
  async saveAssessment(data: HealthAssessment): Promise<string> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('Unauthenticated activity detected.');

    try {
      const docRef = await addDoc(collection(db, 'assessments'), {
        userId,
        status: 'pending',
        data,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'assessments');
      throw error;
    }
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
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              healthScore: { type: Type.NUMBER },
              risks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    level: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
                    description: { type: Type.STRING },
                    confidence: { type: Type.NUMBER }
                  },
                  required: ["category", "level", "description", "confidence"]
                }
              },
              recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedTests: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedSpecialists: { type: Type.ARRAY, items: { type: Type.STRING } },
              lifestylePlan: { type: Type.ARRAY, items: { type: Type.STRING } },
              medicalReasoning: { type: Type.STRING }
            },
            required: ["healthScore", "risks", "recommendations", "suggestedTests", "suggestedSpecialists", "lifestylePlan", "medicalReasoning"]
          }
        }
      });

      const report = JSON.parse(response.text);
      return report as HealthReport;
    } catch (error) {
      console.error("AI Analysis Engine Failure:", error);
      throw new Error("Failed to generate AI clinical report.");
    }
  },

  async updateAssessmentWithReport(id: string, report: HealthReport): Promise<void> {
    try {
      await updateDoc(doc(db, 'assessments', id), {
        report,
        status: 'completed',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `assessments/${id}`);
      throw error;
    }
  },

  async getLatestAssessment(): Promise<StoredAssessment | null> {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;

    try {
      const q = query(
        collection(db, 'assessments'),
        where('userId', '==', userId),
        where('status', '==', 'completed'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      
      const docData = querySnapshot.docs[0];
      return { id: docData.id, ...docData.data() } as StoredAssessment;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'assessments');
      return null;
    }
  }
};
