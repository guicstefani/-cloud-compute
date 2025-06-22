
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({ 
  isLoading, 
  children, 
  className,
  disabled,
  ...props 
}) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        "relative overflow-hidden",
        "transition-all duration-300",
        className
      )}
    >
      {/* Conteúdo normal */}
      <span className={cn(
        "flex items-center justify-center transition-opacity duration-300",
        isLoading ? "opacity-0" : "opacity-100"
      )}>
        {children}
      </span>
      
      {/* Estado de loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-black rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Onda de gradiente animada */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
    </button>
  );
};
