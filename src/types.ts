/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen = 'login' | 'dashboard' | 'assessment' | 'results' | 'search' | 'doctor-profile' | 'consultation' | 'settings' | 'maternal' | 'ai-assistant' | 'history' | 'mental-health' | 'nutrition';

export type Language = 'EN' | 'BN';

export type UserRole = 'patient' | 'doctor' | 'worker';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experience: string;
  hospital: string;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  nextAvailable: string;
  image: string;
}

export interface HealthAssessment {
  // Basic Info
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  height: string;
  weight: string;
  bloodGroup: string;
  
  // Clinical History
  existingDiseases: string[];
  familyHistory: string[];
  allergies: string[];
  medicationHistory: string;
  
  // Lifestyle
  smokingStatus: 'Non-smoker' | 'Occasional' | 'Active';
  sleepPattern: string; // hours
  foodHabits: string;
  waterIntake: string; // items/day or liters
  physicalActivity: 'Sedentary' | 'Moderate' | 'Active';
  stressLevel: 'Low' | 'Medium' | 'High';
  
  // Maternal Health (Optional)
  isPregnant: boolean;
  pregnancyWeeks?: number;
  
  // Current State
  symptoms: string[];
}

export interface HealthReport {
  healthScore: number;
  risks: {
    category: string;
    level: 'Low' | 'Medium' | 'High';
    description: string;
    confidence: number;
  }[];
  recommendations: string[];
  suggestedTests: string[];
  suggestedSpecialists: string[];
  lifestylePlan: string[];
  medicalReasoning: string;
}

export interface StoredAssessment {
  id: string;
  userId: string;
  status: 'pending' | 'completed';
  data: HealthAssessment;
  report?: HealthReport;
  createdAt: any;
}

export interface PregnancyProgress {
  week: number;
  babyGrowth: string;
  babySizeDesc: string; // e.g. "Size of a Grape"
  guidance: string[];
  nutrition: string[];
  exercise: string[];
  warnings: string[];
  medicineReminders: string[];
  vaccinationReminders: string[];
}

export interface ConsultationRecord {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  notes: string;
  createdAt: string;
}

export type EmotionLevel = 'calm' | 'anxious' | 'stressed' | 'sad' | 'overwhelmed' | 'hopeful' | 'neutral';

export interface MentalHealthMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  detectedEmotion?: EmotionLevel;
  crisisIndicators?: string[];
}

export interface MentalHealthChat {
  id: string;
  userId: string;
  messages: MentalHealthMessage[];
  createdAt: string;
  updatedAt: string;
  summary?: string;
  emotionalTrend?: EmotionLevel;
}

export interface MentalHealthAssessment {
  id: string;
  userId: string;
  timestamp: string;
  score: number; // 0-100
  wellnessLevel: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
  dimensions: {
    mood: number;
    anxiety: number;
    sleep: number;
    stress: number;
    socialConnection: number;
  };
  recommendations: string[];
  riskFactors: string[];
  needsProfessionalHelp: boolean;
}

export type DietType = 'vegetarian' | 'vegan' | 'diabetic' | 'weight-loss' | 'muscle-gain' | 'gluten-free' | 'dairy-free' | 'budget-friendly';

export interface NutritionChat {
  id: string;
  userId: string;
  messages: NutritionMessage[];
  dietType?: DietType;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface MealPlan {
  id: string;
  userId: string;
  dietType: DietType;
  duration: 'weekly' | 'monthly';
  meals: {
    day: string;
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  }[];
  nutritionSummary: {
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFats: number;
  };
  bengaliRecipes: string[];
  recommendations: string[];
  createdAt: string;
}

export interface NutritionAssessment {
  id: string;
  userId: string;
  timestamp: string;
  dietType: DietType;
  goals: string[];
  allergies: string[];
  preferences: string[];
  constraints: string[];
}
