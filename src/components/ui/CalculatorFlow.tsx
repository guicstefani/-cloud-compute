
import React from 'react';
import { motion } from 'framer-motion';
import { Server, Calculator, FileText, CheckCircle } from 'lucide-react';
import { designSystem } from '@/styles/designSystem';

interface Step {
  id: number;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface CalculatorFlowProps {
  currentStep: number;
  onStepClick?: (stepId: number) => void;
}

const CalculatorFlow = ({ currentStep, onStepClick }: CalculatorFlowProps) => {
  const steps: Step[] = [
    { 
      id: 1, 
      name: 'Configurar VMs', 
      icon: <Server className="w-6 h-6" />,
      description: 'Defina recursos e especificações'
    },
    { 
      id: 2, 
      name: 'Calcular Custos', 
      icon: <Calculator className="w-6 h-6" />,
      description: 'Analise investimento total'
    },
    { 
      id: 3, 
      name: 'Exportar Proposta', 
      icon: <FileText className="w-6 h-6" />,
      description: 'Gere documentação profissional'
    }
  ];

  return (
    <div className="mb-12">
      {/* Mobile Progress */}
      <div className="md:hidden mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Etapa {currentStep} de {steps.length}
          </h2>
          <span className="text-sm text-gray-400">
            {Math.round((currentStep / steps.length) * 100)}% concluído
          </span>
        </div>
        <div className={`w-full bg-[${designSystem.colors.border}] rounded-full h-2`}>
          <motion.div
            className={`bg-[${designSystem.colors.primary}] h-2 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Desktop Steps */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1 flex items-center">
            <motion.div
              className="relative cursor-pointer"
              onClick={() => onStepClick?.(step.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`w-20 h-20 rounded-full flex items-center justify-center relative z-10 transition-all duration-300
                  ${currentStep >= step.id 
                    ? `bg-[${designSystem.colors.primary}] text-black shadow-lg` 
                    : `bg-[${designSystem.colors.surface}] border-2 border-[${designSystem.colors.border}] text-gray-400`}`}
                whileHover={currentStep >= step.id ? {} : { borderColor: designSystem.colors.primary }}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="w-8 h-8" />
                ) : (
                  step.icon
                )}
              </motion.div>
              
              {/* Glow effect for active step */}
              {currentStep === step.id && (
                <motion.div
                  className={`absolute inset-0 bg-[${designSystem.colors.primary}] rounded-full blur-xl opacity-30`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                <p className={`text-sm font-medium whitespace-nowrap mb-1 ${
                  currentStep >= step.id ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-gray-500 max-w-24">
                  {step.description}
                </p>
              </div>
            </motion.div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-6 mt-4">
                <motion.div
                  className={`h-full rounded-full ${
                    currentStep > step.id 
                      ? `bg-[${designSystem.colors.primary}]` 
                      : `bg-[${designSystem.colors.border}]`
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: currentStep > step.id ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ originX: 0 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorFlow;
