
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getUserSymptomHistory, getUserDietHistory, UserSymptomHistory, UserDietHistory } from '@/services/userService';
import { Loader2, ActivitySquare, Utensils, AlertCircle } from 'lucide-react';
import { toast } from '@/lib/toast';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';

const UserHistory = () => {
  const { translations } = useLanguage();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [symptomHistory, setSymptomHistory] = useState<UserSymptomHistory[]>([]);
  const [dietHistory, setDietHistory] = useState<UserDietHistory[]>([]);
  const [activeTab, setActiveTab] = useState('symptoms');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const loadHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [symptomData, dietData] = await Promise.all([
          getUserSymptomHistory(currentUser.uid),
          getUserDietHistory(currentUser.uid)
        ]);
        
        setSymptomHistory(symptomData);
        setDietHistory(dietData);
      } catch (error) {
        console.error('Error loading history:', error);
        setError(translations.common.error || 'An error occurred loading your history.');
        toast.error(translations.common.error || 'An error occurred loading your history.');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [currentUser, navigate, translations]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'MMM dd, yyyy - HH:mm');
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">{translations.history?.title || 'My Health History'}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{translations.history?.records || 'Health Records History'}</CardTitle>
            <CardDescription>
              {translations.history?.description || 'View your past health checks and diet suggestions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-medical-blue" />
              </div>
            ) : (
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="symptoms" className="flex items-center">
                    <ActivitySquare className="h-4 w-4 mr-2" />
                    {translations.history?.symptomChecks || 'Symptom Checks'}
                  </TabsTrigger>
                  <TabsTrigger value="diets" className="flex items-center">
                    <Utensils className="h-4 w-4 mr-2" />
                    {translations.history?.dietPlans || 'Diet Plans'}
                  </TabsTrigger>
                </TabsList>

                {/* Symptom History Tab */}
                <TabsContent value="symptoms">
                  {symptomHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {translations.history?.noSymptomHistory || 'No symptom check history found'}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{translations.history?.date || 'Date'}</TableHead>
                          <TableHead>{translations.history?.symptoms || 'Symptoms'}</TableHead>
                          <TableHead>{translations.history?.topDiagnosis || 'Top Diagnosis'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {symptomHistory.map((item) => (
                          <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50" 
                                   onClick={() => navigate(`/symptom-checker?id=${item.id}`)}>
                            <TableCell>{formatDate(item.date)}</TableCell>
                            <TableCell>{item.symptoms.join(', ')}</TableCell>
                            <TableCell>
                              {item.results && item.results.length > 0 
                                ? item.results[0].name 
                                : translations.common.noResults}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                {/* Diet History Tab */}
                <TabsContent value="diets">
                  {dietHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {translations.history?.noDietHistory || 'No diet plan history found'}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{translations.history?.date || 'Date'}</TableHead>
                          <TableHead>{translations.history?.healthProfile || 'Health Profile'}</TableHead>
                          <TableHead>{translations.history?.dietType || 'Diet Type'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dietHistory.map((item) => (
                          <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50"
                                   onClick={() => navigate(`/diet-suggestions?id=${item.id}`)}>
                            <TableCell>{formatDate(item.date)}</TableCell>
                            <TableCell>
                              {item.healthProfile && `${item.healthProfile.age}yo, ${item.healthProfile.gender}`}
                            </TableCell>
                            <TableCell>
                              {item.dietPlan && item.dietPlan.name ? item.dietPlan.name : translations.common.noResults}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserHistory;
