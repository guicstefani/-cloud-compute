
import React from 'react';
import { cn } from '@/lib/utils';

interface LoginCardProps {
  children: React.ReactNode;
  className?: string;
}

export const LoginCard: React.FC<LoginCardProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "w-full max-w-md",
      "bg-[#1a1a1a]/80 backdrop-blur-xl",
      "border border-[#333333]/50",
      "rounded-3xl p-8",
      "shadow-2xl shadow-black/50",
      "transition-all duration-500",
      "hover:border-[#DCAE1D]/30 hover:shadow-[#DCAE1D]/10",
      "animate-slide-up",
      className
    )}>
      {children}
    </div>
  );
};
