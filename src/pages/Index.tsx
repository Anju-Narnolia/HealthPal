
import { useLanguage } from '@/contexts/LanguageContext';
import MainLayout from '@/components/Layout/MainLayout';
import React from "react";
import Hero from "@/components/ui/Hero";
import HowItWork from "@/components/ui/HowItWork";
import Features from "@/components/ui/Features";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import TransitionWrapper from "@/components/ui/TransitionWrapper";

const Index = () => {
    const { translations } = useLanguage();
  return (
    <MainLayout>
      <div className="min-h-screen flex flex-col ">
        <main className="">
          <Hero />
          <HowItWork />
          <Features />
          <section className="py-24  md:px-12 lg:px-24 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="max-w-7xl mx-auto text-center">
            <TransitionWrapper animation="slide-up">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {translations.home.cta.title}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  {translations.home.cta.description}
                </p>
                <Link to="/symptom-checker">
                  <Button
                    size="lg"
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    {translations.home.cta.button}
                  </Button>
                </Link>
              </TransitionWrapper>
            </div>
          </section>
        </main>
      </div>
    </MainLayout>
  );
};

export default Index;
