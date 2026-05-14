import { useState, useEffect } from 'react';
import { MentalHealthChat, MentalHealthMessage, MentalHealthAssessment } from '../types';
import { mentalHealthService } from '../services/mentalHealthService';
import { Send, Plus, MessageSquare, BarChart3, AlertCircle, Loader2 } from 'lucide-react';

interface MentalHealthPageProps {
  onNavigate: (screen: string) => void;
}

export function MentalHealthPage({ onNavigate }: MentalHealthPageProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'assessment'>('chat');
  const [currentChat, setCurrentChat] = useState<MentalHealthChat | null>(null);
  const [recentChats, setRecentChats] = useState<MentalHealthChat[]>([]);
  const [messages, setMessages] = useState<MentalHealthMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [latestAssessment, setLatestAssessment] = useState<MentalHealthAssessment | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    loadRecentChats();
    loadLatestAssessment();
  }, []);

  const loadRecentChats = async () => {
    try {
      const chats = await mentalHealthService.getRecentChats(7);
      setRecentChats(chats);
      if (chats.length > 0 && !currentChat) {
        setCurrentChat(chats[0]);
        setMessages(chats[0].messages);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const loadLatestAssessment = async () => {
    try {
      const assessment = await mentalHealthService.getLatestAssessment();
      setLatestAssessment(assessment);
    } catch (error) {
      console.error('Failed to load assessment:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      setIsLoading(true);
      const newChat = await mentalHealthService.createNewChat();
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
      await mentalHealthService.sendMessage(currentChat.id, inputValue);
      
      // Reload chat to get updated messages including assistant response
      const updatedChat = await mentalHealthService.getChat(currentChat.id);
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

  const selectChat = async (chat: MentalHealthChat) => {
    setCurrentChat(chat);
    setMessages(chat.messages);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-purple-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🧠 Mental Health & Wellness
              </h1>
              <p className="text-sm text-gray-600 mt-1">Emotional support & self-care guidance</p>
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
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare size={18} />
            Emotional Support Chat
          </button>
          <button
            onClick={() => setActiveTab('assessment')}
            className={`px-4 py-3 font-medium flex items-center gap-2 border-b-2 transition ${
              activeTab === 'assessment'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 size={18} />
            Wellness Assessment
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar with chat history */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-4">
              <button
                onClick={handleNewChat}
                disabled={isLoading}
                className="w-full mb-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Plus size={18} />
                New Chat
              </button>

              <div className="space-y-2">
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
                          ? 'bg-purple-100 text-purple-900 border-l-4 border-purple-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="truncate font-medium">
                        {chat.messages[0]?.content?.substring(0, 30)}...
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(chat.updatedAt).toLocaleDateString()}
                      </div>
                    </button>
                  ))
                )}
              </div>

              {latestAssessment && (
                <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-semibold text-blue-900 mb-2">Latest Wellness Score</p>
                  <div className="text-2xl font-bold text-blue-600">{latestAssessment.score}</div>
                  <p className="text-xs text-blue-700">{latestAssessment.wellnessLevel}</p>
                </div>
              )}
            </div>

            {/* Main chat area */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[600px]">
              {currentChat ? (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-center">
                        <div>
                          <p className="text-xl font-semibold text-gray-700 mb-2">Welcome to Emotional Support</p>
                          <p className="text-gray-600 max-w-md">
                            Share your feelings, thoughts, or what's on your mind. I'm here to listen and provide supportive guidance.
                          </p>
                        </div>
                      </div>
                    ) : (
                      messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                              msg.role === 'user'
                                ? 'bg-purple-600 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-900 rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            {msg.crisisIndicators && msg.crisisIndicators.length > 0 && (
                              <div className="mt-2 p-2 bg-red-100 rounded flex items-start gap-2">
                                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-red-700">
                                  If you're in crisis, please reach out to a counselor or trusted person.
                                </p>
                              </div>
                            )}
                            {msg.detectedEmotion && msg.role === 'user' && (
                              <p className="text-xs mt-2 opacity-75">Mood: {msg.detectedEmotion}</p>
                            )}
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
                        placeholder="Share your thoughts..."
                        disabled={isSendingMessage}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isSendingMessage || !inputValue.trim()}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
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

        {/* Assessment Tab */}
        {activeTab === 'assessment' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mental Wellness Assessment</h2>
            <MentalHealthAssessmentForm onComplete={loadLatestAssessment} />
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <p className="text-xs text-amber-900">
            <strong>Important Disclaimer:</strong> This mental health support system is not a replacement for professional mental health care. 
            If you're experiencing a crisis or having thoughts of self-harm, please contact a mental health professional or crisis helpline immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

// Assessment form component
function MentalHealthAssessmentForm({ onComplete }: { onComplete: () => void }) {
  const [answers, setAnswers] = useState({
    mood: 5,
    anxiety: 5,
    sleep: 5,
    stress: 5,
    socialConnection: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const assessment = await mentalHealthService.createAssessment(answers);
      setResult(assessment);
      onComplete();
    } catch (error) {
      alert('Failed to create assessment: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-lg">
            <p className="text-sm text-purple-600 font-medium mb-2">Overall Wellness Score</p>
            <p className="text-4xl font-bold text-purple-900">{result.score}</p>
            <p className="text-lg text-purple-700 font-semibold mt-2">{result.wellnessLevel}</p>
          </div>

          <div className="space-y-3">
            {Object.entries(result.dimensions).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 capitalize">{key === 'socialConnection' ? 'Social Connection' : key}</span>
                  <span className="text-gray-600">{value}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {result.riskFactors?.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="font-semibold text-red-900 mb-2">Areas of Concern</p>
            <ul className="space-y-1">
              {result.riskFactors.map((factor: string, i: number) => (
                <li key={i} className="text-sm text-red-800">• {factor}</li>
              ))}
            </ul>
          </div>
        )}

        {result.recommendations?.length > 0 && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="font-semibold text-green-900 mb-2">Recommendations</p>
            <ul className="space-y-1">
              {result.recommendations.map((rec: string, i: number) => (
                <li key={i} className="text-sm text-green-800">• {rec}</li>
              ))}
            </ul>
          </div>
        )}

        {result.needsProfessionalHelp && (
          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
            <p className="font-semibold text-yellow-900">We recommend speaking with a mental health professional</p>
            <p className="text-sm text-yellow-800 mt-2">Your wellness score suggests you may benefit from professional support. Please reach out to a counselor or therapist.</p>
          </div>
        )}

        <button
          onClick={() => setResult(null)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition"
        >
          Take Assessment Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-600">Rate your current mental wellness on a scale of 1-10 (1 = very low, 10 = excellent)</p>

      {Object.entries(answers).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
            {key === 'socialConnection' ? 'Social Connection' : key}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="10"
              value={value}
              onChange={e => setAnswers({ ...answers, [key]: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="text-lg font-bold text-purple-600 w-8">{value}</span>
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
        {isSubmitting ? 'Analyzing...' : 'Get My Wellness Score'}
      </button>
    </div>
  );
}
