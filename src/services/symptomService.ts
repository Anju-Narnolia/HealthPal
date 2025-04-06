import { ConditionResult } from '@/pages/SymptomChecker';

// RapidAPI key - in a production app, this should be stored in environment variables
const RAPIDAPI_KEY = 'dcd4b3f3f7mshe50334b5124c629p1e4a86jsn8f705d0ba267';
const RAPIDAPI_HOST = 'ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com';

interface PatientInfo {
  age: number;
  gender: string;
  height: number;
  weight: number;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  lifestyle: {
    smoking: boolean;
    alcohol: string;
    exercise: string;
    diet: string;
  };
}

// Default patient info - in a real app, this could be customized by the user
const defaultPatientInfo: PatientInfo = {
  age: 35,
  gender: 'female',
  height: 165,
  weight: 65,
  medicalHistory: ['hypertension', 'seasonal allergies'],
  currentMedications: ['lisinopril 10mg', 'cetirizine 10mg'],
  allergies: ['penicillin'],
  lifestyle: {
    smoking: false,
    alcohol: 'occasional',
    exercise: 'moderate',
    diet: 'balanced'
  }
};

// Example symptoms from the curl command
const exampleSymptoms = [
  'severe headache',
  'fever',
  'fatigue',
  'sensitivity to light'
];

// Mock data to use when the API is unavailable
const mockConditions: Record<string, ConditionResult[]> = {
  headache: [
    {
      name: 'Tension Headache',
      probability: 'High',
      severity: 'low',
      recommendation: 'Rest, over-the-counter pain relievers, and stress management techniques.'
    },
    {
      name: 'Migraine',
      probability: 'Medium',
      severity: 'medium',
      recommendation: 'Rest in a dark, quiet room. Consider over-the-counter pain medications or consult a doctor for prescription treatments.'
    }
  ],
  fever: [
    {
      name: 'Common Cold',
      probability: 'High',
      severity: 'low',
      recommendation: 'Rest, fluids, and over-the-counter fever reducers.'
    },
    {
      name: 'Influenza',
      probability: 'Medium',
      severity: 'medium',
      recommendation: 'Rest, fluids, and fever reducers. Contact doctor if symptoms worsen.'
    }
  ],
  cough: [
    {
      name: 'Common Cold',
      probability: 'High',
      severity: 'low',
      recommendation: 'Rest, fluids, and over-the-counter cough suppressants if needed.'
    },
    {
      name: 'Bronchitis',
      probability: 'Medium',
      severity: 'medium',
      recommendation: 'Rest, fluids, and humidifier. Consult doctor if symptoms persist over 3 weeks.'
    }
  ],
  'body pain': [
    {
      name: 'Muscle Strain',
      probability: 'High',
      severity: 'low',
      recommendation: 'Rest, ice, compression, and elevation (RICE). Over-the-counter pain relievers.'
    },
    {
      name: 'Influenza',
      probability: 'Medium',
      severity: 'medium',
      recommendation: 'Rest, fluids, and fever reducers. Contact doctor if symptoms worsen.'
    }
  ],
  fatigue: [
    {
      name: 'Stress',
      probability: 'High',
      severity: 'low',
      recommendation: 'Improve sleep habits, manage stress, and consider relaxation techniques.'
    },
    {
      name: 'Anemia',
      probability: 'Low',
      severity: 'medium',
      recommendation: 'Consult a doctor for blood tests and possible iron supplements.'
    }
  ],
  'example': [
    {
      name: 'Migraine',
      probability: 'High',
      severity: 'medium',
      recommendation: 'Rest in a dark, quiet room. Consider over-the-counter pain medications or consult a doctor for prescription treatments for migraines.'
    },
    {
      name: 'Influenza',
      probability: 'Medium',
      severity: 'medium',
      recommendation: 'Rest, fluids, and fever reducers. Contact doctor if symptoms worsen.'
    },
    {
      name: 'Viral Meningitis',
      probability: 'Low',
      severity: 'high',
      recommendation: 'Seek immediate medical attention if headache is severe and accompanied by fever and neck stiffness.'
    }
  ],
  default: [
    {
      name: 'General Discomfort',
      probability: 'Medium',
      severity: 'low',
      recommendation: 'Rest and monitor symptoms. Consult a healthcare provider if symptoms persist or worsen.'
    }
  ]
};

export async function analyzeSymptoms(symptoms: string[]): Promise<ConditionResult[]> {
  // Check if user wants to use the example symptoms demonstration
  if (symptoms.some(s => s.toLowerCase().includes('example') || s.toLowerCase().includes('demo'))) {
    console.log('Using example symptoms demonstration');
    return mockConditions['example'];
  }
  
  try {
    const response = await fetch('https://ai-medical-diagnosis-api-symptoms-to-results.p.rapidapi.com/analyzeSymptomsAndDiagnose?noqueue=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': RAPIDAPI_HOST,
        'x-rapidapi-key': RAPIDAPI_KEY
      },
      body: JSON.stringify({
        symptoms,
        patientInfo: defaultPatientInfo,
        lang: 'en'
      })
    });

    if (!response.ok) {
      console.log(`API request failed with status ${response.status}`);
      return getMockResults(symptoms);
    }

    const data = await response.json();
    console.log('API response:', data);

    // Process and map the API response to our ConditionResult format
    if (data.possibleConditions && Array.isArray(data.possibleConditions)) {
      return data.possibleConditions.map((condition: any) => {
        // Map the API response to our condition format
        return {
          name: condition.name,
          probability: mapProbability(condition.probability),
          severity: mapSeverity(condition.severity),
          recommendation: condition.recommendations || 
            `Consult with a healthcare provider about ${condition.name}.`
        };
      });
    } else {
      // If the API doesn't return the expected format, return mock data
      return getMockResults(symptoms);
    }
  } catch (error) {
    console.error('Error calling symptom analysis API', error);
    // Return mock data in case of API failure
    return getMockResults(symptoms);
  }
}

// Helper function to get mock results based on symptoms
function getMockResults(symptoms: string[]): ConditionResult[] {
  console.log('Using mock data for symptoms:', symptoms);
  
  let results: ConditionResult[] = [];
  
  // For each symptom, add related conditions
  symptoms.forEach(symptom => {
    const lowerSymptom = symptom.toLowerCase();
    // Find matching symptom or use default
    const matchingSymptoms = Object.keys(mockConditions).filter(key => 
      lowerSymptom.includes(key) || key.includes(lowerSymptom)
    );
    
    if (matchingSymptoms.length > 0) {
      matchingSymptoms.forEach(match => {
        // Avoid duplicates
        mockConditions[match].forEach(condition => {
          if (!results.find(r => r.name === condition.name)) {
            results.push(condition);
          }
        });
      });
    }
  });
  
  // If no specific matches were found, return the default
  if (results.length === 0) {
    results = [...mockConditions.default];
  }
  
  return results;
}

// Helper function to map API probability to our format (High, Medium, Low)
function mapProbability(probability: number | string): string {
  if (typeof probability === 'number') {
    if (probability > 0.7) return 'High';
    if (probability > 0.4) return 'Medium';
    return 'Low';
  }
  
  // If it's already a string, return it
  return probability as string;
}

// Helper function to map API severity to our format (high, medium, low)
function mapSeverity(severity: string | number): 'high' | 'medium' | 'low' {
  if (typeof severity === 'number') {
    if (severity > 7) return 'high';
    if (severity > 4) return 'medium';
    return 'low';
  }
  
  // If it's a string, try to normalize it
  const severityStr = severity.toString().toLowerCase();
  if (severityStr.includes('high') || severityStr.includes('severe')) return 'high';
  if (severityStr.includes('medium') || severityStr.includes('moderate')) return 'medium';
  
  return 'low';
}

// Function to get results for the exact example from the curl command
export function getExampleResults(): Promise<ConditionResult[]> {
  return analyzeSymptoms(exampleSymptoms);
}
