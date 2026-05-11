/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen = 'login' | 'dashboard' | 'assessment' | 'results' | 'search' | 'doctor-profile' | 'consultation' | 'settings';

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
