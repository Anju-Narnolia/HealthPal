
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Apple, Coffee, Utensils, Moon, Loader2, Check, X } from 'lucide-react';

interface MealPlan {
  mealTime: string;
  recommendedFoods: string[];
  avoidFoods: string[];
  icon: React.ReactNode;
}

interface DietPlanProps {
  isLoading: boolean;
  dietPlan: MealPlan[];
}

const DietPlan: React.FC<DietPlanProps> = ({ isLoading, dietPlan }) => {
  const { translations } = useLanguage();

  const getMealIcon = (mealTime: string) => {
    const lowerMealTime = mealTime.toLowerCase();
    
    if (lowerMealTime.includes('breakfast')) return <Coffee className="h-5 w-5 text-orange-500" />;
    if (lowerMealTime.includes('lunch')) return <Utensils className="h-5 w-5 text-green-500" />;
    if (lowerMealTime.includes('dinner')) return <Utensils className="h-5 w-5 text-blue-500" />;
    if (lowerMealTime.includes('snack')) return <Apple className="h-5 w-5 text-red-500" />;
    return <Moon className="h-5 w-5 text-purple-500" />;
  };

  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 text-medical-blue animate-spin mb-4" />
        <p>{translations.dietSuggestions.loading}</p>
      </div>
    );
  }

  if (dietPlan.length === 0) {
    return (
      <Alert className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{translations.common.noResults}</AlertTitle>
        <AlertDescription>
          Please add health conditions or allergies and generate diet suggestions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-semibold">{translations.dietSuggestions.results}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dietPlan.map((meal, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                {getMealIcon(meal.mealTime)}
                {meal.mealTime}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  {translations.dietSuggestions.foods}:
                </p>
                <ul className="mt-1 text-sm text-gray-600 space-y-1">
                  {meal.recommendedFoods.map((food, foodIndex) => (
                    <li key={foodIndex} className="flex items-start ml-6">
                      <span className="mr-2">•</span>
                      {food}
                    </li>
                  ))}
                </ul>
              </div>

              {meal.avoidFoods.length > 0 && (
                <div>
                  <Separator className="my-2" />
                  <p className="text-sm font-medium flex items-center gap-2">
                    <X className="h-4 w-4 text-red-500" />
                    {translations.dietSuggestions.avoidFoods}:
                  </p>
                  <ul className="mt-1 text-sm text-gray-600 space-y-1">
                    {meal.avoidFoods.map((food, foodIndex) => (
                      <li key={foodIndex} className="flex items-start ml-6">
                        <span className="mr-2">•</span>
                        {food}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DietPlan;
