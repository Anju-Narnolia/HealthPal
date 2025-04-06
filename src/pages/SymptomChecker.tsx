
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/Layout/MainLayout';
import SymptomInput from '@/components/SymptomChecker/SymptomInput';
import SymptomResults from '@/components/SymptomChecker/SymptomResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ActivitySquare, Lightbulb } from 'lucide-react';
import { toast } from "@/lib/toast";
import { analyzeSymptoms, getExampleResults } from '@/services/symptomService';
import { saveSymptomHistory, getUserSymptomHistory } from '@/services/userService';

// Define the types for our API results
export interface ConditionResult {
  name: string;
  probability: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

const SymptomChecker = () => {
  const { translations } = useLanguage();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const historyId = searchParams.get('id');
  
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ConditionResult[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    // If historyId is provided, fetch the specific history item
    if (historyId && currentUser) {
      const loadHistoryItem = async () => {
        try {
          setIsLoadingHistory(true);
          const history = await getUserSymptomHistory(currentUser.uid);
          const historyItem = history.find(item => item.id === historyId);
          
          if (historyItem) {
            setSymptoms(historyItem.symptoms);
            setResults(historyItem.results);
            toast.info("Loaded from your history");
          }
        } catch (error) {
          console.error("Error loading history item:", error);
          toast.error(translations.common.error);
        } finally {
          setIsLoadingHistory(false);
        }
      };
      
      loadHistoryItem();
    }
  }, [historyId, currentUser, translations]);

  const handleAnalyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      toast.error(translations.symptomChecker.noSymptoms);
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const diagnosisResults = await analyzeSymptoms(symptoms);
      setResults(diagnosisResults);
      
      // Save to history if user is logged in
      if (currentUser && diagnosisResults.length > 0) {
        await saveSymptomHistory(currentUser.uid, symptoms, diagnosisResults);
        toast.success("Results saved to your history");
      } else if (diagnosisResults.length > 0) {
        // If not logged in but we have results
        toast.info("Sign in to save your results to history");
      }
      
      // If using mock data, show a toast notification
      if (diagnosisResults.length > 0) {
        toast.info("Using simulated results. API subscription required for real diagnosis.");
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      toast.error(translations.common.error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUseExample = async () => {
    setIsAnalyzing(true);
    setSymptoms(['severe headache', 'fever', 'fatigue', 'sensitivity to light']);
    
    try {
      const exampleResults = await getExampleResults();
      setResults(exampleResults);
      
      // Save example to history if user is logged in
      if (currentUser) {
        await saveSymptomHistory(
          currentUser.uid, 
          ['severe headache', 'fever', 'fatigue', 'sensitivity to light'], 
          exampleResults
        );
        toast.success("Example results saved to your history");
      }
      
      toast.info("Showing example results for demonstration purposes.");
    } catch (error) {
      console.error("Error loading example:", error);
      toast.error(translations.common.error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="p-2 rounded-full bg-medical-blue/10 mr-3">
            <ActivitySquare className="h-6 w-6 text-medical-blue" />
          </div>
          <h1 className="text-2xl font-bold">{translations.symptomChecker.title}</h1>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{translations.symptomChecker.title}</CardTitle>
            <CardDescription>
              {translations.symptomChecker.inputLabel}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SymptomInput symptoms={symptoms} setSymptoms={setSymptoms} />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAnalyzeSymptoms}
                disabled={isAnalyzing || isLoadingHistory || symptoms.length === 0}
                className="w-full bg-medical-blue hover:bg-medical-blue-dark"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {translations.common.loading}
                  </>
                ) : (
                  translations.symptomChecker.analyzeButton
                )}
              </Button>
              
              <Button
                onClick={handleUseExample}
                disabled={isAnalyzing || isLoadingHistory}
                variant="outline"
                className="w-full"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Use Example Symptoms
              </Button>
            </div>
          </CardContent>
        </Card>

        <SymptomResults isLoading={isAnalyzing || isLoadingHistory} conditions={results} />
      </div>
    </MainLayout>
  );
};

export default SymptomChecker;
