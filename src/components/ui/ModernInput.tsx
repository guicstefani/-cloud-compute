
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const ModernInput = ({ label, className = "", ...props }: ModernInputProps) => (
  <div className="space-y-2">
    {label && (
      <label className="text-sm font-medium text-white/80">{label}</label>
    )}
    <input
      className={cn(
        "w-full px-4 py-3 rounded-xl",
        "bg-white/5 border border-white/10",
        "text-white placeholder-white/40",
        "focus:bg-white/10 focus:border-gold",
        "focus:outline-none focus:ring-2 focus:ring-gold/20",
        "transition-all duration-300",
        className
      )}
      {...props}
    />
  </div>
);

export default ModernInput;
