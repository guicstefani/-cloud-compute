
import React, { useEffect, useState } from 'react';
import { formatCurrency } from '@/utils/calculadora';

interface AnimatedValueCardProps {
  value: number;
  label: string;
  previousValue?: number;
  className?: string;
}

export const AnimatedValueCard: React.FC<AnimatedValueCardProps> = ({
  value,
  label,
  previousValue = 0,
  className = ""
}) => {
  const [displayValue, setDisplayValue] = useState(previousValue);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      
      // Animação de contagem
      const duration = 1000; // 1 segundo
      const steps = 30;
      const increment = (value - displayValue) / steps;
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        setDisplayValue(prev => {
          const newValue = displayValue + (increment * currentStep);
          return currentStep >= steps ? value : newValue;
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setIsAnimating(false);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [value, displayValue]);

  return (
    <div className={`animated-value-card group ${className}`}>
      {/* Container com overflow hidden para animações */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 transition-all duration-500 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/20">
        
        {/* Fundo animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Barra de loading durante animação */}
        {isAnimating && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse" />
        )}
        
        {/* Conteúdo */}
        <div className="relative z-10">
          <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-medium">
            {label}
          </p>
          
          {/* Valor principal com efeito dourado */}
          <div className="relative">
            <h2 className="text-7xl font-black leading-none bg-gradient-to-r from-white via-yellow-200 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
              {formatCurrency(displayValue)}
            </h2>
            
            {/* Brilho de fundo */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {/* Indicador de mudança */}
          {value !== previousValue && (
            <div className="mt-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${value > previousValue ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
              <span className={`text-sm font-medium ${value > previousValue ? 'text-green-400' : 'text-red-400'}`}>
                {value > previousValue ? '+' : ''}{formatCurrency(value - previousValue)}
              </span>
            </div>
          )}
        </div>
        
        {/* Efeito de hover com mouse tracking */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(234,179,8,0.1), transparent 50%)'
          }}
        />
      </div>
    </div>
  );
};
