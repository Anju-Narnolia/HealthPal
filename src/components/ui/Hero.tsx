import React from "react";
import { MessageSquare, Brain, Bell, Activity } from "lucide-react";
import { Button } from "./button";
import { Link } from "react-router-dom";
import TransitionWrapper from "./TransitionWrapper";
import { useLanguage } from '@/contexts/LanguageContext';

const Hero = () => {

  const { translations } = useLanguage();
    return (
      <section className="pt-2 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="max-h-[90vh]">
              <TransitionWrapper animation="fade-in">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-6">
                  {translations.home.hero.badge}
                </span>
              </TransitionWrapper>
              <TransitionWrapper delay={100} animation="slide-up">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  {translations.home.hero.title} <br />
                  <span className="text-primary">{translations.home.hero.titleHighlight}</span>
                </h1>
              </TransitionWrapper>
              <TransitionWrapper delay={200} animation="slide-up">
                <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                  {translations.home.hero.description}
                </p>
              </TransitionWrapper>
            <TransitionWrapper delay={300} animation="fade-in">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/chat">
                  <Button
                    size="lg"
                    icon={<MessageSquare className="w-4 h-4" />}
                  >
                    Chat Now
                  </Button>
                </Link>
                <Link to="/symptom-checker">
                  <Button variant="outline" size="lg">
                    Check Symptoms
                  </Button>
                </Link>
              </div>
            </TransitionWrapper>
          </div>
          <TransitionWrapper
            delay={400}
            animation="scale-in"
            className="relative "
          >
            <div className="relative max-h-[80vh]">
              <div className="relative z-20 bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="w-full aspect-[3/4] bg-gradient-to-br from-primary/5 to-primary/20 rounded-2xl flex items-center justify-center">
                  <div className="glass p-8 rounded-2xl w-full max-w-sm mx-auto">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                        <Brain className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">HealthPal AI</h3>
                        <p className="text-muted-foreground text-sm">
                          Your personal health assistant
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-3 bg-muted rounded-xl text-sm">
                        I've been experiencing headaches and fatigue lately.
                        What might be causing this?
                      </div>
                      <div className="p-3 bg-primary/10 rounded-xl text-sm">
                        There are several possible causes for headaches and
                        fatigue, including stress, dehydration, lack of sleep,
                        or poor diet. Would you like me to ask you a few
                        questions to narrow down the possibilities?
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-10 -right-8 glass p-4 rounded-xl shadow-sm  animate-float z-50">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <div
                className="absolute bottom-10 -left-8 glass p-4 rounded-xl shadow-sm z-50 animate-float"
                style={{ animationDelay: "1s" }}
              >
                <Bell className="w-8 h-8 text-primary" />
              </div>
            </div>
          </TransitionWrapper>
        </div>
      </div>
    </section>
  );
};

export default Hero;
