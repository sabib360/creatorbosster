import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, History, CreditCard, Youtube, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface Step {
  title: string;
  content: string;
  targetId?: string;
  icon: React.ElementType;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

const STEPS: Step[] = [
  {
    title: "Welcome to CreatorBoost AI!",
    content: "Let's take a quick 1-minute tour to show you how to skyrocket your YouTube growth with AI.",
    icon: Youtube,
    position: 'center'
  },
  {
    title: "AI Generator",
    content: "This is where the magic happens. Enter your video topic to generate viral titles, hooks, and thumbnail ideas.",
    targetId: 'generator-input-form',
    icon: Sparkles,
    position: 'bottom'
  },
  {
    title: "Your Credits",
    content: "Each generation uses 1 credit. You can earn more by watching ads or upgrading to a Pro plan.",
    targetId: 'credits-display',
    icon: Zap,
    position: 'bottom'
  },
  {
    title: "History & Designs",
    content: "All your generated ideas and saved thumbnail designs are stored here so you never lose a great idea.",
    targetId: 'sidebar-history',
    icon: History,
    position: 'right'
  },
  {
    title: "Go Pro",
    content: "Upgrade to unlock unlimited generations, remove ads, and access advanced competitor analysis.",
    targetId: 'sidebar-pricing',
    icon: CreditCard,
    position: 'right'
  }
];

export default function TutorialOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('creatorboost_tutorial_completed');
    if (!hasSeenTutorial) {
      // Small delay to ensure layout is ready
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isVisible && STEPS[currentStep].targetId) {
      const element = document.getElementById(STEPS[currentStep].targetId!);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setTargetRect(null);
      }
    } else {
      setTargetRect(null);
    }
  }, [isVisible, currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTutorial();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeTutorial = () => {
    setIsVisible(false);
    localStorage.setItem('creatorboost_tutorial_completed', 'true');
  };

  if (!isVisible) return null;

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Backdrop with Spotlight */}
      <div 
        className="absolute inset-0 bg-black/40 pointer-events-auto transition-all duration-500" 
        style={{
          clipPath: targetRect ? `polygon(0% 0%, 0% 100%, ${targetRect.left - 8}px 100%, ${targetRect.left - 8}px ${targetRect.top - 8}px, ${targetRect.right + 8}px ${targetRect.top - 8}px, ${targetRect.right + 8}px ${targetRect.bottom + 8}px, ${targetRect.left - 8}px ${targetRect.bottom + 8}px, ${targetRect.left - 8}px 100%, 100% 100%, 100% 0%)` : 'none',
          backgroundColor: targetRect ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.4)'
        }} 
      />

      {/* Tutorial Card */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={cn(
            "pointer-events-auto w-full max-w-sm bg-surface brutal-border brutal-shadow p-6 rounded-2xl relative",
            targetRect ? "mt-4" : "" // Add some spacing if there's a spotlight
          )}
          style={targetRect ? {
            position: 'absolute',
            top: step.position === 'bottom' ? targetRect.bottom + 20 : 
                 step.position === 'top' ? targetRect.top - 300 : 'auto',
            left: step.position === 'right' ? targetRect.right + 20 : 
                  step.position === 'left' ? targetRect.left - 340 : 'auto',
          } : {}}
        >
          <button 
            onClick={completeTutorial}
            className="absolute top-4 right-4 p-1 hover:bg-ink/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary rounded-lg brutal-border">
              <Icon className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-display font-black uppercase tracking-tight">{step.title}</h3>
          </div>

          <p className="text-ink/80 font-medium mb-8 leading-relaxed">
            {step.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === currentStep ? "w-6 bg-primary brutal-border-sm" : "w-2 bg-ink/10"
                  )} 
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="p-2 brutal-border rounded-lg hover:bg-ink/5 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-display font-bold uppercase tracking-wider rounded-lg brutal-border hover:-translate-y-0.5 transition-transform"
              >
                {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
