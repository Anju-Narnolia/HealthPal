// API Ninjas Disease API response types
export interface DiseaseResponse {
  name: string;
  symptoms: string[];
  description: string;
  treatment: string;
  transmission: string;
  diagnosis: string;
  prevention: string;
}

// Spoonacular API response types
export interface MealPlanResponse {
  meals: Meal[];
  nutrients: Nutrients;
}

export interface Meal {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  image: string;
  imageType: string;
}

export interface Nutrients {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

// Diet type mapping
export type DietType = 'low-carb' | 'low-sodium' | 'high-protein' | 'iron-rich' | 'balanced';

export interface DietMapping {
  [disease: string]: DietType;
} 