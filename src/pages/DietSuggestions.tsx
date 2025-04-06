import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MainLayout from '@/components/Layout/MainLayout';
import HealthProfileForm from '@/components/DietSuggestions/HealthProfileForm';
import DietPlan from '@/components/DietSuggestions/DietPlan';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Apple } from 'lucide-react';
import { toast } from "@/lib/toast";

// Mock data for diet plan
const MOCK_DIET_PLAN = [
  {
    mealTime: "Breakfast",
    recommendedFoods: [
      "Oatmeal with berries",
      "Greek yogurt",
      "Whole grain toast with avocado",
      "Green tea"
    ],
    avoidFoods: [
      "Sugary cereals",
      "White bread",
      "Processed meats"
    ],
    icon: "coffee"
  },
  {
    mealTime: "Lunch",
    recommendedFoods: [
      "Grilled chicken salad",
      "Quinoa bowl with vegetables",
      "Lentil soup",
      "Water with lemon"
    ],
    avoidFoods: [
      "Fast food",
      "Sodas",
      "Fried foods"
    ],
    icon: "utensils"
  },
  {
    mealTime: "Dinner",
    recommendedFoods: [
      "Steamed fish with herbs",
      "Roasted vegetables",
      "Brown rice",
      "Herbal tea"
    ],
    avoidFoods: [
      "Heavy creams and sauces",
      "Refined carbohydrates",
      "Alcohol"
    ],
    icon: "utensils"
  },
  {
    mealTime: "Snacks",
    recommendedFoods: [
      "Nuts and seeds",
      "Fresh fruits",
      "Vegetable sticks with hummus",
      "Yogurt"
    ],
    avoidFoods: [
      "Chips and crackers",
      "Candy",
      "Processed snacks"
    ],
    icon: "apple"
  }
];

const DietSuggestions = () => {
  const { translations } = useLanguage();
  const [conditions, setConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietPlan, setDietPlan] = useState<typeof MOCK_DIET_PLAN>([]);

  const handleGenerateDiet = () => {
    if (conditions.length === 0 && allergies.length === 0) {
      toast.error("Please add at least one health condition or allergy.");
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setDietPlan(MOCK_DIET_PLAN);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="p-2 rounded-full bg-medical-green/10 mr-3">
            <Apple className="h-6 w-6 text-medical-green" />
          </div>
          <h1 className="text-2xl font-bold">{translations.dietSuggestions.title}</h1>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{translations.dietSuggestions.healthProfileTitle}</CardTitle>
            <CardDescription>
              Enter your health conditions and allergies to get personalized diet recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HealthProfileForm
              conditions={conditions}
              setConditions={setConditions}
              allergies={allergies}
              setAllergies={setAllergies}
              onSubmit={handleGenerateDiet}
            />
          </CardContent>
        </Card>

        <DietPlan isLoading={isGenerating} dietPlan={dietPlan} />
      </div>
    </MainLayout>
  );
};

export default DietSuggestions;
