import { useState, useEffect } from 'react';
import { NutritionChat, MealPlan, DietType } from '../types';
import { nutritionService } from '../services/nutritionService';
import { Send, Plus, MessageSquare, UtensilsCrossed, Loader2 } from 'lucide-react';

interface NutritionPageProps {
  onNavigate: (screen: string) => void;
}

export function NutritionPage({ onNavigate }: NutritionPageProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'meal-plan'>('chat');
  const [currentChat, setCurrentChat] = useState<NutritionChat | null>(null);
  const [recentChats, setRecentChats] = useState<NutritionChat[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDietType, setSelectedDietType] = useState<DietType>('vegetarian');
  const [latestMealPlan, setLatestMealPlan] = useState<MealPlan | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const dietTypes = nutritionService.getDietTypes();

  useEffect(() => {
    loadRecentChats();
    loadLatestMealPlan();
  }, []);

  const loadRecentChats = async () => {
    try {
      const chats = await nutritionService.getRecentChats(7);
      setRecentChats(chats);
      if (chats.length > 0 && !currentChat) {
        setCurrentChat(chats[0]);
        setMessages(chats[0].messages);
        if (chats[0].dietType) setSelectedDietType(chats[0].dietType);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const loadLatestMealPlan = async () => {
    try {
      const plan = await nutritionService.getLatestMealPlan();
      setLatestMealPlan(plan);
    } catch (error) {
      console.error('Failed to load meal plan:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      setIsLoading(true);
      const newChat = await nutritionService.createNewChat(selectedDietType);
      setCurrentChat(newChat);
      setMessages([]);
      setRecentChats([newChat, ...recentChats]);
    } catch (error) {
      alert('Failed to create new chat: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentChat) return;

    try {
      setIsSendingMessage(true);
      await nutritionService.sendMessage(currentChat.id, inputValue, selectedDietType);

      const updatedChat = await nutritionService.getChat(currentChat.id);
      if (updatedChat) {
        setCurrentChat(updatedChat);
        setMessages(updatedChat.messages);
      }

      setInputValue('');
    } catch (error) {
      alert('Failed to send message: ' + (error as Error).message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const selectChat = (chat: NutritionChat) => {
    setCurrentChat(chat);
    setMessages(chat.messages);
    if (chat.dietType) setSelectedDietType(chat.dietType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                🍽️ Nutrition AI Engine
              </h1>
              <p className="text-sm text-gray-600 mt-1">Personalized meal plans & Bengali food guidance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition ${
              activeTab === 'chat'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare size={18} />
            Nutrition Chat
          </button>
          <button
            onClick={() => setActiveTab('meal-plan')}
            className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition ${
              activeTab === 'meal-plan'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <UtensilsCrossed size={18} />
            Meal Planning
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-4">
              <button
                onClick={handleNewChat}
                disabled={isLoading}
                className="w-full mb-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Plus size={18} />
                New Chat
              </button>

              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Diet Type</p>
                <select
                  value={selectedDietType}
                  onChange={e => setSelectedDietType(e.target.value as DietType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {dietTypes.map(dt => (
                    <option key={dt.id} value={dt.id}>
                      {dt.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {dietTypes.find(d => d.id === selectedDietType)?.description}
                </p>
              </div>

              <div className="space-y-2 border-t pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recent Chats (7 days)</p>
                {recentChats.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No recent conversations</p>
                ) : (
                  recentChats.map(chat => (
                    <button
                      key={chat.id}
                      onClick={() => selectChat(chat)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        currentChat?.id === chat.id
                          ? 'bg-orange-100 text-orange-900 border-l-4 border-orange-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="truncate font-medium">
                        {chat.messages[0]?.content?.substring(0, 30)}...
                      </div>
                      <div className="text-xs text-gray-500">
                        {chat.dietType} • {new Date(chat.updatedAt).toLocaleDateString()}
                      </div>
                    </button>
                  ))
                )}
              </div>

              {latestMealPlan && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-xs font-semibold text-orange-900 mb-2">Latest Meal Plan</p>
                  <p className="text-xs text-orange-700">{latestMealPlan.dietType}</p>
                  <p className="text-xs text-orange-600">{latestMealPlan.duration}</p>
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[600px]">
              {currentChat ? (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <p className="text-xl font-semibold text-gray-700 mb-2">Nutrition Advisor</p>
                          <p className="text-gray-600 max-w-md">
                            Ask me for meal ideas, recipes, or nutrition advice. I'll focus on Bengali foods and your {selectedDietType} diet!
                          </p>
                        </div>
                      </div>
                    ) : (
                      messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                              msg.role === 'user'
                                ? 'bg-orange-600 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-900 rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                    {isSendingMessage && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          <p className="text-sm">Thinking...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask about recipes, meal ideas..."
                        disabled={isSendingMessage}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isSendingMessage || !inputValue.trim()}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600">Start a new conversation to begin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Meal Plan Tab */}
        {activeTab === 'meal-plan' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Meal Plan</h2>
            <MealPlanForm dietTypes={dietTypes} onComplete={loadLatestMealPlan} />
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <p className="text-xs text-amber-900">
            <strong>Disclaimer:</strong> This nutrition guidance is for educational purposes and based on general nutritional principles.
            For personalized medical nutrition therapy or specific health conditions, consult a registered dietitian or healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}

// Meal Plan Form Component
function MealPlanForm({
  dietTypes,
  onComplete,
}: {
  dietTypes: { id: DietType; label: string }[];
  onComplete: () => void;
}) {
  const [selectedDiet, setSelectedDiet] = useState<DietType>('vegetarian');
  const [duration, setDuration] = useState<'weekly' | 'monthly'>('weekly');
  const [goals, setGoals] = useState<string[]>(['Healthy eating']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<MealPlan | null>(null);

  const toggleGoal = (goal: string) => {
    setGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const plan = await nutritionService.generateMealPlan(selectedDiet, duration, goals);
      setResult(plan);
      onComplete();
    } catch (error) {
      alert('Failed to generate meal plan: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonGoals = [
    'Weight loss',
    'Energy boost',
    'Muscle building',
    'Better digestion',
    'Budget-friendly',
    'Quick meals',
  ];

  if (result) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-6 rounded-lg">
            <p className="text-sm text-orange-600 font-medium mb-2">{result.duration.toUpperCase()} PLAN</p>
            <p className="text-2xl font-bold text-orange-900">{result.dietType}</p>
            <div className="mt-4 space-y-2 text-sm text-orange-800">
              <p>Avg Calories: {result.nutritionSummary.avgCalories}</p>
              <p>Protein: {result.nutritionSummary.avgProtein}g</p>
              <p>Carbs: {result.nutritionSummary.avgCarbs}g</p>
              <p>Fats: {result.nutritionSummary.avgFats}g</p>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="font-semibold text-orange-900 mb-3">📋 Meal Plan Overview</p>
            <div className="space-y-2 text-sm">
              {result.meals.slice(0, 3).map((meal, i) => (
                <div key={i} className="p-2 bg-white rounded border border-orange-100">
                  <p className="font-medium text-gray-900">{meal.day}</p>
                  <p className="text-xs text-gray-600">{meal.breakfast.length + meal.lunch.length + meal.dinner.length} meals</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {result.bengaliRecipes?.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <p className="font-semibold text-orange-900 mb-2">🍳 Bengali Recipes</p>
            <ul className="space-y-1">
              {result.bengaliRecipes.map((recipe, i) => (
                <li key={i} className="text-sm text-orange-800">• {recipe}</li>
              ))}
            </ul>
          </div>
        )}

        {result.recommendations?.length > 0 && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="font-semibold text-green-900 mb-2">✅ Recommendations</p>
            <ul className="space-y-1">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-green-800">• {rec}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => setResult(null)}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition"
        >
          Generate Another Plan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
          <select
            value={selectedDiet}
            onChange={e => setSelectedDiet(e.target.value as DietType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {dietTypes.map(dt => (
              <option key={dt.id} value={dt.id}>
                {dt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="duration"
                value="weekly"
                checked={duration === 'weekly'}
                onChange={() => setDuration('weekly')}
                className="mr-2"
              />
              <span className="text-sm">Weekly</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="duration"
                value="monthly"
                checked={duration === 'monthly'}
                onChange={() => setDuration('monthly')}
                className="mr-2"
              />
              <span className="text-sm">Monthly</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Goals</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonGoals.map(goal => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                goals.includes(goal)
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || goals.length === 0}
        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-3 px-4 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
        {isSubmitting ? 'Generating...' : 'Generate Meal Plan'}
      </button>
    </div>
  );
}
