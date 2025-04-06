
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PlusCircle, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SymptomInputProps {
  symptoms: string[];
  setSymptoms: React.Dispatch<React.SetStateAction<string[]>>;
}

const SymptomInput: React.FC<SymptomInputProps> = ({ symptoms, setSymptoms }) => {
  const { translations } = useLanguage();
  const [inputValue, setInputValue] = useState('');

  const handleAddSymptom = () => {
    if (inputValue.trim() && !symptoms.includes(inputValue.trim())) {
      setSymptoms([...symptoms, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSymptom();
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="symptom-input" className="text-sm font-medium">
          {translations.symptomChecker.inputLabel}
        </label>
        <div className="flex gap-2">
          <Input
            id="symptom-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={translations.symptomChecker.inputPlaceholder}
            className="flex-1"
          />
          <Button 
            onClick={handleAddSymptom} 
            type="button"
            variant="outline"
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">{translations.symptomChecker.addSymptom}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {symptoms.map((symptom, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="pl-3 flex items-center gap-1 bg-gray-100"
          >
            {symptom}
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 ml-1 hover:bg-gray-200 rounded-full"
              onClick={() => handleRemoveSymptom(symptom)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove</span>
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SymptomInput;
