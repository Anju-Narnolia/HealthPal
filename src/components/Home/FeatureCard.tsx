
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  actionText: string;
  linkTo: string;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  actionText,
  linkTo,
  gradient,
}) => {
  return (
    <Card className={`overflow-hidden border ${gradient}`}>
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-white text-gray-800 hover:bg-gray-100 border border-gray-200">
          <Link to={linkTo}>{actionText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;
