import React from 'react';
import DiseaseAndDiet from '../components/DiseaseAndDiet';

const DiseaseAndDietPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Disease & Diet Advisor</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
          Enter your symptoms to identify potential conditions and get personalized diet recommendations to help manage them.
        </p>
        <DiseaseAndDiet />
      </div>
    </div>
  );
};

export default DiseaseAndDietPage; 