import { NutritionChat, NutritionMessage, MealPlan, NutritionAssessment, DietType } from '../types';
import { authService } from './authService';
import { aiRouter } from '../ai/aiProvider';

const CHATS_STORAGE_KEY = 'hellodoc_nutrition_chats';
const MEAL_PLANS_STORAGE_KEY = 'hellodoc_nutrition_meal_plans';

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `nut-${Date.now()}`;

const getStoredChats = (): NutritionChat[] => {
  const raw = localStorage.getItem(CHATS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as NutritionChat[];
  } catch {
    return [];
  }
};

const saveStoredChats = (chats: NutritionChat[]) => {
  localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
};

const getStoredMealPlans = (): MealPlan[] => {
  const raw = localStorage.getItem(MEAL_PLANS_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as MealPlan[];
  } catch {
    return [];
  }
};

const saveMealPlans = (plans: MealPlan[]) => {
  localStorage.setItem(MEAL_PLANS_STORAGE_KEY, JSON.stringify(plans));
};

export const nutritionService = {
  // Chat management
  async createNewChat(dietType?: DietType): Promise<NutritionChat> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) throw new Error('Unauthenticated activity detected.');

    const newChat: NutritionChat = {
      id: createId(),
      userId,
      messages: [],
      dietType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const chats = getStoredChats();
    chats.push(newChat);
    saveStoredChats(chats);

    return newChat;
  },

  async sendMessage(chatId: string, userMessage: string, dietType?: DietType): Promise<NutritionMessage> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) throw new Error('Unauthenticated activity detected.');

    const chats = getStoredChats();
    const chat = chats.find(c => c.id === chatId && c.userId === userId);
    if (!chat) throw new Error('Chat not found.');

    // Add user message
    const userMsg: NutritionMessage = {
      id: createId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    chat.messages.push(userMsg);

    // Build system prompt based on diet type
    const dietContext = dietType ? `\nDiet Type: ${dietType.replace('-', ' ')} diet.` : '';
    const systemPrompt = `You are a knowledgeable, friendly Bengali nutrition advisor for HelloDoc.

Your role:
- Provide personalized nutrition guidance based on user preferences
- Recommend Bengali local foods and traditional recipes
- Focus on practical, affordable, healthy eating
- Suggest meal combinations using common Bengali ingredients
- Consider health conditions and dietary preferences${dietContext}

Bengali Foods Knowledge:
- Vegetables: ঝিংগা (ridge gourd), করলা (bitter gourd), চিঙ্গি (spinach), পুদিনা (mint)
- Proteins: মাছ (fish), চিকেন (chicken), ডাল (lentils), ডিম (eggs)
- Grains: চাল (rice), ডাল (pulses), আটা (wheat flour)
- Traditional dishes: খিচুড়ি, পায়েস, সবজি রান্না, ভাত-মাছ
- Budget options: ডাল, আলু (potato), বাঁধাকপি (cabbage)

Guidelines:
- Always prioritize Bengali/local foods
- Consider Bengali cooking methods (তেল, মশলা)
- Mention approximate calories/nutrients when relevant
- Be encouraging and non-judgmental about eating habits
- Suggest practical meal combinations for busy lifestyles`;

    try {
      const response = await aiRouter.chat(
        chat.messages.map(m => ({ role: m.role, content: m.content })),
        {
          systemPrompt,
          maxTokens: 1200,
          temperature: 0.6,
        }
      );

      const assistantMsg: NutritionMessage = {
        id: createId(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toISOString(),
      };

      chat.messages.push(assistantMsg);
      chat.updatedAt = new Date().toISOString();
      if (dietType) {
        chat.dietType = dietType;
      }

      saveStoredChats(chats);
      return userMsg;
    } catch (error) {
      chat.messages.pop();
      saveStoredChats(chats);
      throw new Error('Failed to get nutrition advice: ' + (error as Error).message);
    }
  },

  async getChat(chatId: string): Promise<NutritionChat | null> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) return null;

    const chats = getStoredChats();
    return chats.find(c => c.id === chatId && c.userId === userId) || null;
  },

  async getRecentChats(days: number = 7): Promise<NutritionChat[]> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) return [];

    const chats = getStoredChats();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return chats
      .filter(c => c.userId === userId && new Date(c.updatedAt) >= cutoff)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  // Meal planning
  async generateMealPlan(dietType: DietType, duration: 'weekly' | 'monthly', goals: string[]): Promise<MealPlan> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) throw new Error('Unauthenticated activity detected.');

    const prompt = `Create a detailed ${duration} meal plan for a ${dietType.replace('-', ' ')} diet.

Goals: ${goals.join(', ')}

Use ONLY Bengali foods and local ingredients. Include:
1. Breakfast, lunch, dinner, and snacks for each day
2. Include traditional Bengali recipes and home-cooked meals
3. Approximate daily calories/macros
4. Shopping list friendly names in Bengali
5. Practical cooking methods (সিদ্ধ, ভাজা, রান্না)

Return valid JSON:
{
  "mealPlan": [
    {
      "day": "Monday",
      "breakfast": ["item1", "item2"],
      "lunch": ["item1", "item2"],
      "dinner": ["item1", "item2"],
      "snacks": ["item1", "item2"]
    }
  ],
  "avgCalories": number,
  "avgProtein": number,
  "avgCarbs": number,
  "avgFats": number,
  "bengaliRecipes": ["রেসিপি name", ...],
  "recommendations": ["suggestion1", "suggestion2"]
}`;

    try {
      const response = await aiRouter.chat(
        [{ role: 'user', content: prompt }],
        {
          systemPrompt:
            'You are a Bengali nutrition expert. Return only valid JSON without markdown. Focus exclusively on Bengali local foods.',
          maxTokens: 2000,
          temperature: 0.3,
        }
      );

      const parsed = JSON.parse(response.text.trim());

      const mealPlan: MealPlan = {
        id: createId(),
        userId,
        dietType,
        duration,
        meals: parsed.mealPlan || [],
        nutritionSummary: {
          avgCalories: parsed.avgCalories || 2000,
          avgProtein: parsed.avgProtein || 60,
          avgCarbs: parsed.avgCarbs || 250,
          avgFats: parsed.avgFats || 65,
        },
        bengaliRecipes: parsed.bengaliRecipes || [],
        recommendations: parsed.recommendations || [],
        createdAt: new Date().toISOString(),
      };

      const plans = getStoredMealPlans();
      plans.push(mealPlan);
      saveMealPlans(plans);

      return mealPlan;
    } catch (error) {
      throw new Error('Failed to generate meal plan: ' + (error as Error).message);
    }
  },

  async getLatestMealPlan(): Promise<MealPlan | null> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) return null;

    const plans = getStoredMealPlans();
    const userPlans = plans.filter(p => p.userId === userId);

    if (userPlans.length === 0) return null;

    return userPlans.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  },

  async getMealPlanHistory(days: number = 30): Promise<MealPlan[]> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) return [];

    const plans = getStoredMealPlans();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return plans
      .filter(p => p.userId === userId && new Date(p.createdAt) >= cutoff)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async deleteMealPlan(planId: string): Promise<void> {
    const userId = authService.getCurrentUser()?.uid;
    if (!userId) throw new Error('Unauthenticated activity detected.');

    let plans = getStoredMealPlans();
    plans = plans.filter(p => !(p.id === planId && p.userId === userId));
    saveMealPlans(plans);
  },

  // Diet preferences
  getDietTypes(): { id: DietType; label: string; description: string }[] {
    return [
      {
        id: 'vegetarian',
        label: 'Vegetarian',
        description: 'No meat, includes fish, eggs, dairy',
      },
      {
        id: 'vegan',
        label: 'Vegan',
        description: 'No animal products, plant-based only',
      },
      {
        id: 'diabetic',
        label: 'Diabetic',
        description: 'Low sugar, controlled carbs',
      },
      {
        id: 'weight-loss',
        label: 'Weight Loss',
        description: 'Calorie-controlled, nutrient-dense',
      },
      {
        id: 'muscle-gain',
        label: 'Muscle Building',
        description: 'High protein, strength training support',
      },
      {
        id: 'gluten-free',
        label: 'Gluten-Free',
        description: 'No wheat, rye, barley',
      },
      {
        id: 'dairy-free',
        label: 'Dairy-Free',
        description: 'No milk, cheese, yogurt',
      },
      {
        id: 'budget-friendly',
        label: 'Budget-Friendly',
        description: 'Affordable Bengali staples',
      },
    ];
  },
};
