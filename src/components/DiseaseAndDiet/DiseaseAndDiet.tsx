import React, { useState } from 'react';
import { DiseaseResponse, MealPlanResponse, Meal } from './types';
import { fetchDiseaseInfo, fetchDietSuggestions, getDietTypeForDisease } from './utils';

enum AppState {
  INPUT,
  LOADING_DISEASE,
  DISEASE_RESULTS,
  LOADING_DIET,
  DIET_RESULTS,
  ERROR
}

const DiseaseAndDiet: React.FC = () => {
  const [symptom, setSymptom] = useState('');
  const [disease, setDisease] = useState<DiseaseResponse | null>(null);
  const [dietPlan, setDietPlan] = useState<MealPlanResponse | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptom.trim()) return;

    try {
      // Fetch disease info
      setAppState(AppState.LOADING_DISEASE);
      const diseaseResults = await fetchDiseaseInfo(symptom);
      
      if (diseaseResults.length === 0) {
        setErrorMessage('No diseases found for this symptom. Try another term.');
        setAppState(AppState.ERROR);
        return;
      }
      
      // Get the first disease from results
      const firstDisease = diseaseResults[0];
      setDisease(firstDisease);
      setAppState(AppState.DISEASE_RESULTS);
      
      // Fetch diet plan
      setAppState(AppState.LOADING_DIET);
      const dietType = getDietTypeForDisease(firstDisease.name);
      const dietSuggestions = await fetchDietSuggestions(dietType);
      setDietPlan(dietSuggestions);
      setAppState(AppState.DIET_RESULTS);
    } catch (error) {
      setErrorMessage('An error occurred while fetching data. Please try again.');
      setAppState(AppState.ERROR);
      console.error(error);
    }
  };

  const resetForm = () => {
    setSymptom('');
    setDisease(null);
    setDietPlan(null);
    setAppState(AppState.INPUT);
    setErrorMessage('');
  };

  // Render meal card
  const MealCard: React.FC<{ meal: Meal }> = ({ meal }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-48 w-full">
        <img 
          src={`https://spoonacular.com/recipeImages/${meal.id}-556x370.jpg`} 
          alt={meal.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-2 text-gray-800">{meal.title}</h3>
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          <span>Ready in {meal.readyInMinutes} min</span>
          <span>{meal.servings} servings</span>
        </div>
        <a 
          href={meal.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block text-center py-2 px-4 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
        >
          View Recipe
        </a>
      </div>
    </div>
  );

  // Render loading spinner
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-24">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Symptom Checker & Diet Suggestions</h2>
        
        {/* Input form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              placeholder="Enter a symptom (e.g., fever, cough, headache)"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              disabled={appState !== AppState.INPUT && appState !== AppState.ERROR}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={appState !== AppState.INPUT && appState !== AppState.ERROR || !symptom.trim()}
            >
              Check
            </button>
            
            {(appState === AppState.DISEASE_RESULTS || appState === AppState.DIET_RESULTS) && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                New Search
              </button>
            )}
          </div>
        </form>

        {/* Error message */}
        {appState === AppState.ERROR && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {errorMessage}
          </div>
        )}

        {/* Disease information */}
        {appState === AppState.LOADING_DISEASE && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Searching for disease information...</h3>
            <LoadingSpinner />
          </div>
        )}

        {disease && (appState === AppState.DISEASE_RESULTS || appState === AppState.LOADING_DIET || appState === AppState.DIET_RESULTS) && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4 text-teal-700">{disease.name}</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-1">Symptoms:</h4>
                <ul className="list-disc list-inside text-gray-700 pl-2">
                  {disease.symptoms.map((symptom, index) => (
                    <li key={index} className="mb-1">{symptom}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-1">Description:</h4>
                <p className="text-gray-700">{disease.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Treatment:</h4>
                <p className="text-gray-700">{disease.treatment}</p>
              </div>
            </div>
          </div>
        )}

        {/* Diet information */}
        {appState === AppState.LOADING_DIET && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Finding recommended diet plan...</h3>
            <LoadingSpinner />
          </div>
        )}

        {dietPlan && appState === AppState.DIET_RESULTS && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-teal-700">Recommended Diet Plan</h3>
            
            <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-medium text-gray-800 mb-2">Daily Nutritional Summary:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-teal-50 rounded-lg p-3 text-center">
                  <span className="block text-sm text-gray-600">Calories</span>
                  <span className="block text-xl font-bold text-teal-700">{Math.round(dietPlan.nutrients.calories)}</span>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <span className="block text-sm text-gray-600">Protein</span>
                  <span className="block text-xl font-bold text-blue-700">{Math.round(dietPlan.nutrients.protein)}g</span>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <span className="block text-sm text-gray-600">Fat</span>
                  <span className="block text-xl font-bold text-yellow-700">{Math.round(dietPlan.nutrients.fat)}g</span>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <span className="block text-sm text-gray-600">Carbs</span>
                  <span className="block text-xl font-bold text-green-700">{Math.round(dietPlan.nutrients.carbohydrates)}g</span>
                </div>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-800 mb-4">Meals for Today:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dietPlan.meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-gray-700 mb-2">
                Diet type recommended based on the condition: 
                <span className="font-semibold text-teal-700 ml-2">
                  {getDietTypeForDisease(disease?.name || '')}
                </span>
              </p>
              <p className="text-sm text-gray-600">These meal suggestions are generated to support your health condition.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseAndDiet; 