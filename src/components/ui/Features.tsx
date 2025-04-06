import {
  MessageCircle,
  Stethoscope,
  UtensilsCrossed,
  Shield,
} from "lucide-react";
import FeatureCard from "./FeatureCard";
import TransitionWrapper from "./TransitionWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
const Features = () => {
  const { translations } = useLanguage();
  const features = [
    {
      title: translations.home.features.cards[0].title,
      description: translations.home.features.cards[0].description,
      icon: <MessageCircle className="w-5 h-5" />,
      delay: 100,
    },
    {
      title: translations.home.features.cards[1].title,
      description: translations.home.features.cards[1].description,
      icon: <Stethoscope className="w-5 h-5" />,
      delay: 200,
    },
    {
      title: translations.home.features.cards[2].title,
      description: translations.home.features.cards[2].description,
      icon: <UtensilsCrossed className="w-5 h-5" />,
      delay: 400,
    },
    {
      title: translations.home.features.cards[3].title,
      description: translations.home.features.cards[3].description,
      icon: <Shield className="w-5 h-5" />,
      delay: 300,
    },
  ];

  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto">
        <TransitionWrapper animation="slide-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {translations.home.features.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {translations.home.features.description}
            </p>
          </div>
        </TransitionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
