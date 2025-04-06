
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import MainLayout from '@/components/Layout/MainLayout';
import { getUserProfile, updateUserProfile, UserProfile } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/lib/toast';
import { User, History } from 'lucide-react';

const UserProfilePage = () => {
  const { translations } = useLanguage();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);
        if (userProfile?.displayName) {
          setDisplayName(userProfile.displayName);
        } else {
          // Default to email username if no display name
          setDisplayName(currentUser.email?.split('@')[0] || '');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile information');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await updateUserProfile(currentUser.uid, { displayName });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="p-2 rounded-full bg-medical-blue/10 mr-3">
            <User className="h-6 w-6 text-medical-blue" />
          </div>
          <h1 className="text-2xl font-bold">{translations.auth?.profile || 'My Profile'}</h1>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentUser?.email || ''}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="submit" className="bg-medical-blue hover:bg-medical-blue-dark">
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/history')}>
                  <History className="mr-2 h-4 w-4" />
                  View History
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserProfilePage;
