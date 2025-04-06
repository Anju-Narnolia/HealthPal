
import React from 'react';

// import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, Github, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  //   const { translations } = useLanguage();
  return (
    <footer className=" py-16 px-6 md:px-12 lg:px-24 bg-primary/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <div className="text-primary mr-2">
                <Heart className="h-6 w-6 stroke-[2.5px]" />
              </div>
              <h1 className="font-bold text-xl">HealthPal</h1>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your personal AI health assistant, designed to provide medical information, symptom analysis, and health insights.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/chat" className="text-muted-foreground hover:text-primary transition-colors">
                  AI Chat
                </Link>
              </li>
              <li>
                <Link to="/symptoms" className="text-muted-foreground hover:text-primary transition-colors">
                  Symptom Checker
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Health Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-400 mt-12 pt-8 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} HealthPal. All rights reserved.</p>
          <p className="mt-2">Disclaimer: This AI health assistant is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
