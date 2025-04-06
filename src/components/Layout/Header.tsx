
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Heart, User, LogOut, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const { translations } = useLanguage();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigateToProfile = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-secondary border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <Heart className="h-8 w-8 text-medical-blue mr-2" />
          <Link to="/" className="text-2xl font-bold text-medical-blue">
            {translations.app.title}
          </Link>
        </div>
        <nav className="flex items-center space-x-1 sm:space-x-4">
          <Link to="/" className="px-3 py-2 text-gray-700 hover:text-medical-blue">
            {translations.nav.home}
          </Link>
          <Link to="/symptom-checker" className="px-3 py-2 text-gray-700 hover:text-medical-blue">
            {translations.nav.symptomChecker}
          </Link>
          <Link to="/diet-suggestions" className="px-3 py-2 text-gray-700 hover:text-medical-blue">
            {translations.nav.dietSuggestions}
          </Link>
          <LanguageSwitcher />
          
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2">
                  <User className="h-5 w-5 mr-1" />
                  <span className="sr-only sm:not-sr-only sm:ml-1 truncate max-w-[80px]">
                    {currentUser.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={navigateToProfile}>
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/history')}>
                  <History className="h-4 w-4 mr-2" />
                  My History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {translations.auth?.logout || 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2 ml-2">
              <Button variant="ghost" size="sm">
                <Link to="/login">
                  {translations.auth?.login?.title || 'Login'}
                </Link>
              </Button>
              <Button  variant="outline" size="sm">
                <Link to="/signup">
                  {translations.auth?.signup?.title || 'Sign up'}
                </Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
