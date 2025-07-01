
import React from 'react';
import { cn } from '@/lib/utils';

interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const GoldButton = ({ children, onClick, className = "", ...props }: GoldButtonProps) => (
  <button
    onClick={onClick}
    className={cn(
      "px-6 py-3 rounded-xl font-semibold",
      "bg-gradient-to-r from-gold to-gold-dark",
      "text-black shadow-lg shadow-gold/25",
      "hover:shadow-xl hover:shadow-gold/40",
      "hover:scale-[1.02] active:scale-[0.98]",
      "transition-all duration-200",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default GoldButton;
