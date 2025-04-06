import React, { useEffect, useState } from "react";
import { cn } from "@/components/ui/utils";

interface TransitionWrapperProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?:
    | "fade-in"
    | "slide-up"
    | "slide-down"
    | "slide-left"
    | "slide-right"
    | "scale-in"
    | "scale-up"
    | "bounce";
  duration?: number;
  once?: boolean;
}

const TransitionWrapper = ({
  children,
  className,
  delay = 0,
  animation = "fade-in",
  duration = 600,
  once = true,
}: TransitionWrapperProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (once && !hasAnimated) {
        setHasAnimated(true);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, once, hasAnimated]);

  useEffect(() => {
    if (!once && hasAnimated) {
      setIsVisible(false);
      const resetTimer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      return () => clearTimeout(resetTimer);
    }
  }, [children, animation, once, hasAnimated, isVisible]);

  const getAnimationClass = () => {
    return !isVisible
      ? "opacity-0"
      : {
          "fade-in": "animate-fade-in",
          "slide-up": "animate-slide-up",
          "slide-down": "animate-slide-down",
          "slide-left": "animate-slide-left",
          "slide-right": "animate-slide-right",
          "scale-in": "animate-scale-in",
          "scale-up": "animate-scale-up",
          bounce: "animate-bounce",
        }[animation] || "animate-fade-in";
  };

  return (
    <div
      className={cn(
        getAnimationClass(),
        hasAnimated && once ? "" : "transition-all",
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default TransitionWrapper;
