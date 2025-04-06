
import React from 'react';
import { cn } from "@/components/ui/utils";
import TransitionWrapper from './TransitionWrapper';
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale-in' | 'scale-up' | 'bounce';
}
const FeatureCard = ({ 
  title, 
  description, 
  icon, 
  delay = 0, 
  className,
  animation = 'slide-up'
}: FeatureCardProps) => {
  return (
    <TransitionWrapper delay={delay} animation={animation} duration={800}>
      <div className={cn(
        "glass p-6 rounded-2xl h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]",
        className
      )}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary mr-3">
            {icon}
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </TransitionWrapper>
  );
};

export default FeatureCard;
