import { DietMapping, DietType, DiseaseResponse, MealPlanResponse } from './types';

// API Keys from environment variables
const DISEASE_API_KEY = import.meta.env.VITE_DISEASE_API_KEY || "5rPmR7mqvxvwUzCNAF+1sQ==VaWdLFU9plmJdV2s";
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY || "0c33c773bc9d467e95594ba0d01d9587";

// Disease to diet mapping
export const diseaseToDietMap: DietMapping = {
  'diabetes': 'low-carb',
  'diabetes mellitus': 'low-carb',
  'type 2 diabetes': 'low-carb',
  'hypertension': 'low-sodium',
  'high blood pressure': 'low-sodium',
  'obesity': 'high-protein',
  'overweight': 'high-protein',
  'anemia': 'iron-rich',
  'iron deficiency': 'iron-rich',
  'arthritis': 'balanced',
  'asthma': 'balanced',
  'cholesterol': 'low-sodium',
  'high cholesterol': 'low-sodium',
  'heart disease': 'low-sodium',
  'gastroenteritis': 'balanced',
  'influenza': 'balanced',
  'flu': 'balanced',
  'common cold': 'balanced',
  'migraine': 'balanced',
  'default': 'balanced'
};

// Function to get diet type based on disease name
export const getDietTypeForDisease = (diseaseName: string): DietType => {
  const lowerCaseName = diseaseName.toLowerCase();
  
  // Check for exact matches
  if (lowerCaseName in diseaseToDietMap) {
    return diseaseToDietMap[lowerCaseName];
  }
  
  // Check for partial matches
  for (const [disease, diet] of Object.entries(diseaseToDietMap)) {
    if (lowerCaseName.includes(disease) || disease.includes(lowerCaseName)) {
      return diet;
    }
  }
  
  // Default diet type
  return diseaseToDietMap.default;
};

// API Functions
export const fetchDiseaseInfo = async (symptom: string): Promise<DiseaseResponse[]> => {
  try {
    const response = await fetch(`https://api.api-ninjas.com/v1/disease?name=${encodeURIComponent(symptom)}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': DISEASE_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching disease info:', error);
    throw error;
  }
};

export const fetchDietSuggestions = async (dietType: DietType): Promise<MealPlanResponse> => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/mealplanner/generate?timeFrame=day&apiKey=${SPOONACULAR_API_KEY}&diet=${dietType}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching diet suggestions:', error);
    throw error;
  }
}; 