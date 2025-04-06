
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, PlusCircle } from 'lucide-react';

interface HealthProfileFormProps {
  conditions: string[];
  setConditions: React.Dispatch<React.SetStateAction<string[]>>;
  allergies: string[];
  setAllergies: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit: () => void;
}

const HealthProfileForm: React.FC<HealthProfileFormProps> = ({
  conditions,
  setConditions,
  allergies,
  setAllergies,
  onSubmit,
}) => {
  const { translations } = useLanguage();
  const [conditionInput, setConditionInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');

  const handleAddCondition = () => {
    if (conditionInput.trim() && !conditions.includes(conditionInput.trim())) {
      setConditions([...conditions, conditionInput.trim()]);
      setConditionInput('');
    }
  };

  const handleAddAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    action: () => void
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="condition-input" className="text-sm font-medium">
            {translations.dietSuggestions.conditionsLabel}
          </label>
          <div className="flex gap-2">
            <Input
              id="condition-input"
              value={conditionInput}
              onChange={(e) => setConditionInput(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddCondition)}
              placeholder={translations.dietSuggestions.conditionsPlaceholder}
              className="flex-1"
            />
            <Button 
              onClick={handleAddCondition} 
              type="button"
              variant="outline"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              <span>Add</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {conditions.map((condition, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="pl-3 flex items-center gap-1 bg-gray-100"
            >
              {condition}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1 hover:bg-gray-200 rounded-full"
                onClick={() => setConditions(conditions.filter(c => c !== condition))}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="allergy-input" className="text-sm font-medium">
            {translations.dietSuggestions.allergiesLabel}
          </label>
          <div className="flex gap-2">
            <Input
              id="allergy-input"
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleAddAllergy)}
              placeholder={translations.dietSuggestions.allergiesPlaceholder}
              className="flex-1"
            />
            <Button 
              onClick={handleAddAllergy} 
              type="button"
              variant="outline"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              <span>Add</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {allergies.map((allergy, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="pl-3 flex items-center gap-1 bg-gray-100"
            >
              {allergy}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1 hover:bg-gray-200 rounded-full"
                onClick={() => setAllergies(allergies.filter(a => a !== allergy))}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      <Button 
        onClick={onSubmit} 
        className="w-full bg-medical-blue hover:bg-medical-blue-dark"
      >
        {translations.dietSuggestions.generateButton}
      </Button>
    </div>
  );
};

export default HealthProfileForm;
