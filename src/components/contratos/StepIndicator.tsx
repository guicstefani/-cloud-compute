
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
}

const StepIndicator = ({ steps, currentStep, completedSteps, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = completedSteps.includes(stepNumber);
        const isCurrent = currentStep === stepNumber;
        const isClickable = onStepClick && (isCompleted || stepNumber <= Math.max(...completedSteps, currentStep));
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <button
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                  {
                    // Completed step
                    "bg-gold text-black": isCompleted,
                    // Current step
                    "bg-gold/20 text-gold border-2 border-gold": isCurrent && !isCompleted,
                    // Future step
                    "bg-gray-800 text-gray-400 border border-gray-600": !isCurrent && !isCompleted,
                    // Clickable
                    "hover:scale-105 cursor-pointer": isClickable,
                    // Disabled
                    "cursor-not-allowed": !isClickable
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  stepNumber
                )}
              </button>
              <div className="mt-2 text-center">
                <div className={cn(
                  "text-sm font-medium",
                  {
                    "text-gold": isCurrent,
                    "text-white": isCompleted,
                    "text-gray-400": !isCurrent && !isCompleted
                  }
                )}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1 max-w-20">
                  {step.description}
                </div>
              </div>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-4 transition-colors duration-300",
                {
                  "bg-gold": completedSteps.includes(stepNumber),
                  "bg-gray-700": !completedSteps.includes(stepNumber)
                }
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
