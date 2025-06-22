
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingLabelProps {
  label: string;
  value: string;
  error?: string;
  valid?: boolean | null;
  children: React.ReactNode;
}

export const FloatingLabel: React.FC<FloatingLabelProps> = ({
  label,
  value,
  error,
  valid,
  children
}) => {
  const [focused, setFocused] = useState(false);
  const shouldFloat = focused || value.length > 0;

  return (
    <div className="relative">
      {/* Container do input com eventos de foco */}
      <div 
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {children}
      </div>
      
      {/* Label flutuante */}
      <label className={cn(
        "absolute left-12 transition-all duration-300 pointer-events-none",
        shouldFloat 
          ? "top-0 -translate-y-3 text-xs text-[#DCAE1D] bg-[#1a1a1a] px-2" 
          : "top-1/2 -translate-y-1/2 text-base text-gray-400"
      )}>
        {label}
      </label>
      
      {/* Linha de foco animada */}
      <div className={cn(
        "absolute bottom-0 left-0 h-0.5 transition-all duration-300",
        focused 
          ? "w-full bg-gradient-to-r from-[#DCAE1D] to-[#F4C430]" 
          : "w-0 bg-transparent"
      )} />
      
      {/* Mensagem de erro */}
      {error && (
        <div className="mt-2 text-red-400 text-sm animate-slide-down flex items-center">
          <span className="w-4 h-4 mr-2 animate-spin">⚠</span>
          {error}
        </div>
      )}
    </div>
  );
};
