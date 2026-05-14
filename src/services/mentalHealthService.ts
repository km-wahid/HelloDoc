import { MentalHealthChat, MentalHealthMessage, MentalHealthAssessment, EmotionLevel } from '../types';
import { authService } from './authService';
import { aiRouter } from '../ai/aiProvider';

const CHATS_STORAGE_KEY = 'hellodoc_mental_health_chats';
const ASSESSMENTS_STORAGE_KEY = 'hellodoc_mental_health_assessments';

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `mh-${Date.now()}`;

const getStoredChats = (): MentalHealthChat[] => {
  const raw = localStorage.getItem(CHATS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MentalHealthChat[];
  } catch {
    return [];
  }
};

const saveStoredChats = (chats: MentalHealthChat[]) => {
  localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
};

const getStoredAssessments = (): MentalHealthAssessment[] => {
  const raw = localStorage.getItem(ASSESSMENTS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MentalHealthAssessment[];
  } catch {
    return [];
  }
};

const saveStoredAssessments = (assessments: MentalHealthAssessment[]) => {
  localStorage.setItem(ASSESSMENTS_STORAGE_KEY, JSON.stringify(assessments));
};

// Detect emotion from user message using AI
const detectEmotion = async (userMessage: string): Promise<EmotionLevel | undefined> => {
  try {
    const response = await aiRouter.chat(
      [{ role: 'user', content: userMessage }],
      {
        systemPrompt: `Analyze the emotional tone of the message and respond with ONLY one of these words: calm, anxious, stressed, sad, overwhelmed, hopeful, or neutral. No explanation.`,
        maxTokens: 10,
        temperature: 0.1,
      }
    );

    const emotion = response.text.trim().toLowerCase();
    const validEmotions: EmotionLevel[] = ['calm', 'anxious', 'stressed', 'sad', 'overwhelmed', 'hopeful', 'neutral'];
    return validEmotions.includes(emotion as EmotionLevel) ? (emotion as EmotionLevel) : undefined;
  } catch {
    return undefined;
  }
};

// Detect crisis indicators in user message
const detectCrisisIndicators = async (userMessage: string): Promise<string[]> => {
  try {
    const response = await aiRouter.chat(
      [{ role: 'user', content: userMessage }],
      {
        systemPrompt: `Check if the message contains any concerning phrases indicating:
- Self-harm thoughts
- Suicidal ideation
- Severe hopelessness
- Immediate danger

List ONLY the detected risks (one per line) or respond with "none" if safe. No explanations.`,
        maxTokens: 100,
        temperature: 0.1,
      }
    );

    const text = response.text.trim();
    if (text.toLowerCase() === 'none') return [];
    return text.split('\n').filter(line => line.trim().length > 0);
  } catch {
    return [];
  }
};

export const mentalHealthService = {
  // Chat management
  async createNewChat(): Promise<MentalHealthChat> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) throw new Error('Unauthenticated activity detected.');

    const newChat: MentalHealthChat = {
      id: createId(),
      userId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const chats = getStoredChats();
    chats.push(newChat);
    saveStoredChats(chats);

    return newChat;
  },

  async sendMessage(chatId: string, userMessage: string): Promise<MentalHealthMessage> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) throw new Error('Unauthenticated activity detected.');

    const chats = getStoredChats();
    const chat = chats.find(c => c.id === chatId && c.userId === userId);
    if (!chat) throw new Error('Chat not found.');

    // Detect emotion and crisis indicators
    const [emotion, crisisIndicators] = await Promise.all([
      detectEmotion(userMessage),
      detectCrisisIndicators(userMessage),
    ]);

    // Add user message to chat
    const userMsg: MentalHealthMessage = {
      id: createId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
      detectedEmotion: emotion,
      crisisIndicators: crisisIndicators.length > 0 ? crisisIndicators : undefined,
    };

    chat.messages.push(userMsg);

    // Get AI response
    const systemPrompt = `You are a compassionate, supportive mental health and emotional well-being assistant for HelloDoc.

Your role:
- Provide empathetic listening and validation of emotions
- Offer evidence-based coping techniques (breathing exercises, grounding, mindfulness)
- Suggest healthy routines (sleep, hydration, movement)
- Support maternal mental health when relevant
- Recognize when professional help is needed

IMPORTANT - Responsible AI:
- You are NOT a therapist or mental health professional
- Do NOT diagnose mental health conditions
- Do NOT replace professional treatment
- If you detect severe distress, suicidal thoughts, or self-harm intent, STRONGLY encourage immediate professional help

Tone: Warm, empathetic, non-judgmental, encouraging.`;

    try {
      const response = await aiRouter.chat(
        chat.messages.map(m => ({ role: m.role, content: m.content })),
        {
          systemPrompt,
          maxTokens: 1000,
          temperature: 0.6,
        }
      );

      const assistantMsg: MentalHealthMessage = {
        id: createId(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toISOString(),
      };

      chat.messages.push(assistantMsg);

      // Update chat metadata
      chat.updatedAt = new Date().toISOString();
      
      // Update emotional trend
      if (emotion) {
        chat.emotionalTrend = emotion;
      }

      saveStoredChats(chats);
      return userMsg;
    } catch (error) {
      chat.messages.pop(); // Remove user message if AI fails
      saveStoredChats(chats);
      throw new Error('Failed to get AI response: ' + (error as Error).message);
    }
  },

  async getChat(chatId: string): Promise<MentalHealthChat | null> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) return null;

    const chats = getStoredChats();
    return chats.find(c => c.id === chatId && c.userId === userId) || null;
  },

  async getRecentChats(days: number = 7): Promise<MentalHealthChat[]> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) return [];

    const chats = getStoredChats();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return chats
      .filter(c => c.userId === userId && new Date(c.updatedAt) >= cutoff)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async deleteChat(chatId: string): Promise<void> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) throw new Error('Unauthenticated activity detected.');

    let chats = getStoredChats();
    chats = chats.filter(c => !(c.id === chatId && c.userId === userId));
    saveStoredChats(chats);
  },

  // Assessment management
  async createAssessment(answers: Record<string, number>): Promise<MentalHealthAssessment> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) throw new Error('Unauthenticated activity detected.');

    const prompt = `Based on these mental health assessment responses, provide a JSON score:
${JSON.stringify(answers, null, 2)}

Calculate:
1. Overall wellness score (0-100)
2. Dimension scores (0-100): mood, anxiety, sleep, stress, socialConnection
3. Wellness level: Excellent (90+), Good (70-89), Fair (50-69), Poor (30-49), Critical (<30)
4. 3-5 personalized recommendations
5. Any identified risk factors
6. If score < 40, set needsProfessionalHelp to true

Return valid JSON only:
{
  "overallScore": number,
  "dimensions": {"mood": number, "anxiety": number, "sleep": number, "stress": number, "socialConnection": number},
  "wellnessLevel": "Excellent"|"Good"|"Fair"|"Poor"|"Critical",
  "recommendations": [string],
  "riskFactors": [string],
  "needsProfessionalHelp": boolean
}`;

    try {
      const response = await aiRouter.chat(
        [{ role: 'user', content: prompt }],
        {
          systemPrompt:
            'You are a mental health assessment AI. Return only valid JSON without markdown code fences or explanations.',
          maxTokens: 1000,
          temperature: 0.2,
        }
      );

      const parsed = JSON.parse(response.text.trim());

      const assessment: MentalHealthAssessment = {
        id: createId(),
        userId,
        timestamp: new Date().toISOString(),
        score: parsed.overallScore,
        wellnessLevel: parsed.wellnessLevel,
        dimensions: parsed.dimensions,
        recommendations: parsed.recommendations,
        riskFactors: parsed.riskFactors,
        needsProfessionalHelp: parsed.needsProfessionalHelp,
      };

      const assessments = getStoredAssessments();
      assessments.push(assessment);
      saveStoredAssessments(assessments);

      return assessment;
    } catch (error) {
      throw new Error('Failed to create assessment: ' + (error as Error).message);
    }
  },

  async getLatestAssessment(): Promise<MentalHealthAssessment | null> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) return null;

    const assessments = getStoredAssessments();
    const userAssessments = assessments.filter(a => a.userId === userId);

    if (userAssessments.length === 0) return null;

    return userAssessments.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
  },

  async getAssessmentHistory(days: number = 30): Promise<MentalHealthAssessment[]> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) return [];

    const assessments = getStoredAssessments();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return assessments
      .filter(a => a.userId === userId && new Date(a.timestamp) >= cutoff)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
};
