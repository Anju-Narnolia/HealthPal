
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
// import Button  from '@/components/ui/button.tsx';

function HowItWork() {
  const { translations } = useLanguage();
  
  const steps = translations.home.howItWorks.steps;

  return (
    <section className="py-24 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-4">{translations.home.howItWorks.title}</h2>
        <p className="text-gray-600">
          {translations.home.howItWorks.description}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="mb-6 flex items-center justify-center">
              <span className="text-4xl font-bold text-health-400 opacity-30">{step.number}</span>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-5 left-[60%] w-full border-t-2 border-dashed border-health-200"></div>
              )}
            </div>
            <h3 className="text-lg font-semibold mb-3 text-center">{step.title}</h3>
            <p className="text-gray-600 text-sm text-center">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default HowItWork;
