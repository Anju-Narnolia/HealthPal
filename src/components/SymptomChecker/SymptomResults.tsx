
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ConditionResult } from '@/pages/SymptomChecker';

interface SymptomResultsProps {
  isLoading: boolean;
  conditions: ConditionResult[];
}

const SymptomResults: React.FC<SymptomResultsProps> = ({ isLoading, conditions }) => {
  const { translations } = useLanguage();

  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 text-medical-blue animate-spin mb-4" />
        <p>{translations.symptomChecker.loading}</p>
      </div>
    );
  }

  if (conditions.length === 0) {
    return (
      <Alert className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{translations.common.noResults}</AlertTitle>
        <AlertDescription>
          {translations.symptomChecker.noSymptoms}
        </AlertDescription>
      </Alert>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-semibold">{translations.symptomChecker.results}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conditions.map((condition, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{condition.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-500">{translations.common.probability}:</span>
                <Badge variant="outline" className="font-normal">
                  {condition.probability}
                </Badge>
                <span className="text-sm text-gray-500 ml-2">{translations.common.severity}:</span>
                <Badge className={`font-normal ${getSeverityColor(condition.severity)}`}>
                  {condition.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <p className="text-sm font-medium">{translations.common.recommendation}:</p>
                <p className="text-sm text-gray-600">{condition.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SymptomResults;
