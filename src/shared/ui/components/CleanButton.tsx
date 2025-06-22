
/**
 * CleanButton - Componente de botão limpo e consistente
 * Substitua gradualmente os botões antigos por este
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface CleanButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const CleanButton = React.forwardRef<HTMLButtonElement, CleanButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    fullWidth,
    loading,
    icon,
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Sizes
          {
            'h-8 px-3 text-sm rounded-md': size === 'sm',
            'h-10 px-4 text-sm rounded-lg': size === 'md', 
            'h-12 px-6 text-base rounded-lg': size === 'lg',
          },
          
          // Variants
          {
            // Primary - Dourado Optidata
            'bg-[#f5a623] text-white hover:bg-[#d68910] focus:ring-[#f5a623] shadow-md hover:shadow-lg': 
              variant === 'primary',
            
            // Secondary - Fundo escuro
            'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] border border-[#333333] focus:ring-[#f5a623]':
              variant === 'secondary',
            
            // Ghost - Transparente
            'text-[#a0a0a0] hover:text-white hover:bg-[#2a2a2a] focus:ring-[#f5a623]':
              variant === 'ghost',
            
            // Outline - Contorno dourado
            'border-2 border-[#f5a623] text-[#f5a623] hover:bg-[#f5a623] hover:text-white focus:ring-[#f5a623]':
              variant === 'outline',
          },
          
          // Full width
          {
            'w-full': fullWidth,
          },
          
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
        )}
        {icon && !loading && icon}
        {children}
      </button>
    );
  }
);

CleanButton.displayName = 'CleanButton';
